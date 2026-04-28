# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import os
import uuid
import httpx
from fastapi import APIRouter, HTTPException, Request
from google.cloud.firestore import FieldFilter
from firebase_admin import firestore
from config.firebase import get_firestore
from models.phash import compare_to_registry
from services.geo_lookup import get_geo_from_url
from services.email_svc import send_takedown_email
from services.dmca import generate_dmca_notice
from config.settings import TMP_DIR

router = APIRouter()

@router.get("/")
async def get_violations(asset_id: str = None, status: str = None, sport_category: str = None, detection_type: str = None, limit: int = 50):
    # Fetch all, sort and filter in memory to avoid needing multiple composite indexes
    docs = get_firestore().collection('violations').order_by('detected_at', direction=firestore.Query.DESCENDING).stream()
    
    results = []
    for d in docs:
        data = d.to_dict()
        if asset_id and data.get('asset_id') != asset_id: continue
        if status and data.get('status') != status: continue
        if sport_category and data.get('sport_category') != sport_category: continue
        if detection_type and data.get('detection_type') != detection_type: continue
        results.append(data)
        if len(results) >= limit:
            break
            
    return results

@router.get("/{asset_id}/timeline")
async def get_violation_timeline(asset_id: str):
    # Fetch all for asset, sort in memory
    docs = get_firestore().collection('violations').where(filter=FieldFilter('asset_id', '==', asset_id)).stream()
    results = [d.to_dict() for d in docs]
    results.sort(key=lambda x: x.get('detected_at') or '')
    return results

@router.post("/{violation_id}/takedown")
async def send_takedown(violation_id: str):
    ref = get_firestore().collection('violations').document(violation_id)
    doc = ref.get()
    if not doc.exists: raise HTTPException(404, "Violation not found")
    
    ref.update({'status': 'takedown_sent', 'takedown_sent_at': firestore.SERVER_TIMESTAMP})
    res = await send_takedown_email(doc.to_dict(), 'abuse@domain.com')
    return {'success': res['sent'], 'email_sent': res['sent']}

@router.post("/{violation_id}/dmca")
async def generate_dmca(violation_id: str, request: Request):
    """Generate a legally valid DMCA takedown notice using Gemini AI."""
    body = await request.json()
    language = body.get('language', 'en')

    db = get_firestore()
    v_ref = db.collection('violations').document(violation_id)
    v_doc = v_ref.get()
    if not v_doc.exists:
        raise HTTPException(404, "Violation not found")
    violation = v_doc.to_dict()

    asset = {}
    if violation.get('asset_id'):
        a_doc = db.collection('assets').document(violation['asset_id']).get()
        if a_doc.exists:
            asset = a_doc.to_dict()

    notice = await generate_dmca_notice(violation, asset, language)
    v_ref.update({'dmca_notice': notice, 'dmca_generated_at': firestore.SERVER_TIMESTAMP})
    return notice

@router.post("/report-url")
async def report_url(request: Request):
    body = await request.json()
    url = body.get('url')
    if not url: raise HTTPException(400, "URL required")
    
    tmp_path = os.path.join(TMP_DIR, f"report_{uuid.uuid4().hex}.jpg")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=8.0)
            if resp.status_code != 200: raise Exception("Fetch failed")
            with open(tmp_path, 'wb') as f:
                f.write(resp.content)
                
        phash_res = await compare_to_registry(tmp_path)
        if phash_res.get('is_match') and phash_res.get('hamming_distance') <= 10:
            geo = await get_geo_from_url(url)
            v_id = str(uuid.uuid4())
            doc = {
                'violation_id': v_id, 'asset_id': phash_res.get('matched_asset_id'),
                'asset_name': phash_res.get('matched_asset_name'), 'source_url': url,
                'source_domain': 'user_report', 'similarity_percent': phash_res.get('similarity_percent'),
                'detection_method': 'user_report', 'detection_type': 'theft',
                'geo_lat': geo.get('geo_lat'), 'geo_lng': geo.get('geo_lng'),
                'geo_city': geo.get('geo_city'), 'geo_country': geo.get('geo_country'),
                'status': 'detected', 'detected_at': firestore.SERVER_TIMESTAMP
            }
            get_firestore().collection('violations').document(v_id).set(doc)
            return {'matched': True, 'violation_id': v_id, 'similarity_percent': doc['similarity_percent']}
        return {'matched': False, 'violation_id': None, 'similarity_percent': 0.0}
    finally:
        if os.path.exists(tmp_path): os.remove(tmp_path)
