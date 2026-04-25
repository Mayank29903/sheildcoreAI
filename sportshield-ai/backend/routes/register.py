# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import os
import time
import uuid
import json
import hashlib
import mimetypes
from datetime import datetime, timezone
from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from firebase_admin import firestore
from services.rate_limiter import limiter
from services.file_validator import validate_upload
from config.firebase import get_firestore, upload_to_storage, increment_rtdb_counter, get_rtdb
from models.exif_forensics import analyze_exif
from models.phash import generate_fingerprint
from models.watermark import build_watermark_metadata, embed_watermark
from config.settings import RIGHTS_VALUE_USD, TMP_DIR

router = APIRouter()

@router.post("/")
@limiter.limit("5/minute")
async def register_asset(
    request: Request,
    file: UploadFile = File(...),
    owner_name: str = Form(...),
    owner_email: str = Form(...),
    organization: str = Form(...),
    asset_name: str = Form(...),
    sport_category: str = Form(...),
    content_type_label: str = Form(...),
    user_uid: str = Form(...)
):
    content = await validate_upload(file)
    asset_id = str(uuid.uuid4())
    ext = mimetypes.guess_extension(file.content_type) or '.bin'
    tmp_path = os.path.join(TMP_DIR, f"{asset_id}_original{ext}")
    wm_path = os.path.join(TMP_DIR, f"{asset_id}_watermarked.png")
    
    with open(tmp_path, 'wb') as f:
        f.write(content)
        
    try:
        exif_result = analyze_exif(tmp_path)
        fingerprint = generate_fingerprint(tmp_path)
        cert_id = fingerprint['sha256'][:12].upper()
        registered_at_unix = int(time.time())
        
        if file.content_type.startswith('image/'):
            wm_metadata = build_watermark_metadata(
                cert_id, owner_name, owner_email, asset_id,
                asset_name, sport_category, organization, registered_at_unix
            )
            embed_watermark(tmp_path, wm_path, wm_metadata)
        else:
            wm_path = tmp_path
            
        c2pa_manifest = {
            'asset_id': asset_id, 'cert_id': cert_id,
            'owner_name': owner_name, 'owner_email': owner_email,
            'organization': organization, 'registered_at': registered_at_unix,
            'standard': 'C2PA-compatible'
        }
        manifest_hash = hashlib.sha256(json.dumps(c2pa_manifest, sort_keys=True).encode()).hexdigest()
        
        orig_url = upload_to_storage(tmp_path, f"assets/{user_uid}/{asset_id}/original{ext}")
        wm_url = upload_to_storage(wm_path, f"assets/{user_uid}/{asset_id}/watermarked{'.png' if file.content_type.startswith('image/') else ext}")
        
        rights_value = RIGHTS_VALUE_USD.get(sport_category, 250)
        
        db = get_firestore()
        db.collection('assets').document(asset_id).set({
            'asset_id': asset_id, 'owner_uid': user_uid, 'owner_name': owner_name,
            'owner_email': owner_email, 'organization': organization, 'asset_name': asset_name,
            'sport_category': sport_category, 'content_type': content_type_label,
            'original_url': orig_url, 'watermarked_url': wm_url, 'phash': fingerprint['phash'],
            'dhash': fingerprint['dhash'], 'ahash': fingerprint['ahash'], 'sha256': fingerprint['sha256'],
            'cert_id': cert_id, 'exif_snapshot': exif_result.get('exif_data', {}),
            'c2pa_manifest_hash': manifest_hash, 'estimated_rights_value_usd': rights_value,
            'registered_at': firestore.SERVER_TIMESTAMP, 'registered_at_unix': registered_at_unix,
            'total_violations': 0, 'total_rights_value_protected_usd': 0, 'status': 'active'
        })
        
        increment_rtdb_counter('dashboard_stats', 'assets_protected', 1)
        rtdb = get_rtdb()
        rtdb.child('dashboard_stats/rights_value_protected_usd').transaction(lambda v: (v or 0) + rights_value)
        
        return {
            'cert_id': cert_id, 'asset_id': asset_id, 'phash': fingerprint['phash'],
            'sha256': fingerprint['sha256'], 'original_url': orig_url, 'watermarked_url': wm_url,
            'registered_at': datetime.now(timezone.utc).isoformat(), 'organization': organization,
            'asset_name': asset_name, 'sport_category': sport_category, 'exif_snapshot': exif_result.get('exif_data', {})
        }
    finally:
        if os.path.exists(tmp_path): os.remove(tmp_path)
        if os.path.exists(wm_path) and wm_path != tmp_path: os.remove(wm_path)
