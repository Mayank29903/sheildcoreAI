# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import os
import uuid
import httpx
from fastapi import APIRouter, Request
from config.settings import GOOGLE_CSE_KEY, GOOGLE_CSE_CX, TMP_DIR
from config.firebase import get_firestore
from models.phash import compare_to_registry
from services.geo_lookup import get_geo_from_url
from firebase_admin import firestore
from services.rate_limiter import limiter

router = APIRouter()

@router.post("/")
@limiter.limit("2/minute")
async def crawl_asset(request: Request):
    body = await request.json()
    asset_id = body.get('asset_id')
    max_results = body.get('max_results', 10)
    
    if not GOOGLE_CSE_KEY or not asset_id:
        return {'asset_id': asset_id, 'crawled_urls': 0, 'violations_found': 0, 'violations': []}
        
    db = get_firestore()
    doc = db.collection('assets').document(asset_id).get()
    if not doc.exists: return {'asset_id': asset_id, 'crawled_urls': 0, 'violations_found': 0, 'violations': []}
        
    data = doc.to_dict()
    q = f"{data.get('asset_name')} {data.get('sport_category')}"
    url = f"https://www.googleapis.com/customsearch/v1?key={GOOGLE_CSE_KEY}&cx={GOOGLE_CSE_CX}&searchType=image&q={q}&num={max_results}"
    
    found = []
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=5.0)
            if resp.status_code == 200:
                for it in resp.json().get('items', []):
                    img_url = it.get('link')
                    if not img_url: continue
                    tmp_path = os.path.join(TMP_DIR, f"crawl_{uuid.uuid4().hex}.jpg")
                    try:
                        img_resp = await client.get(img_url, timeout=8.0)
                        if img_resp.status_code == 200:
                            with open(tmp_path, 'wb') as f: f.write(img_resp.content)
                            match = await compare_to_registry(tmp_path)
                            if match.get('is_match') and match.get('hamming_distance') <= 10:
                                geo = await get_geo_from_url(img_url)
                                v_id = str(uuid.uuid4())
                                vdoc = {
                                    'violation_id': v_id, 'asset_id': asset_id, 'source_url': img_url,
                                    'detection_method': 'auto_crawl', 'detection_type': 'theft', 'status': 'detected',
                                    'detected_at': firestore.SERVER_TIMESTAMP,
                                    'geo_lat': geo.get('geo_lat'), 'geo_lng': geo.get('geo_lng'),
                                    'geo_city': geo.get('geo_city'), 'geo_country': geo.get('geo_country')
                                }
                                db.collection('violations').document(v_id).set(vdoc)
                                found.append(vdoc)
                    finally:
                        if os.path.exists(tmp_path): os.remove(tmp_path)
    except: pass
    return {'asset_id': asset_id, 'crawled_urls': max_results, 'violations_found': len(found), 'violations': found}
