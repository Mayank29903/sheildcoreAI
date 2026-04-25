# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import time
from fastapi import APIRouter
from config.firebase import get_firestore

router = APIRouter()
_cache = {'data': None, 'ts': 0}

@router.get("/")
async def get_analytics():
    now = time.time()
    if _cache['data'] and (now - _cache['ts'] < 60):
        return _cache['data']
        
    db = get_firestore()
    assets = list(db.collection('assets').stream())
    violations = list(db.collection('violations').stream())
    
    threats = {'deepfake': 0, 'theft': 0, 'both': 0}
    sport_bd = {}
    
    for v in violations:
        d = v.to_dict()
        t = d.get('detection_type', 'unknown')
        if t in threats: threats[t] += 1
        s = d.get('sport_category', 'Other')
        sport_bd[s] = sport_bd.get(s, 0) + 1
        
    rights = sum(a.to_dict().get('estimated_rights_value_usd', 0) for a in assets)
    
    ret = {
        'total_assets': len(assets),
        'scans_today': len(list(db.collection('scans').limit(10).stream())), 
        'violations_today': len(violations), 
        'violations_total': len(violations),
        'threats_by_type': threats,
        'most_targeted_asset': 'Demo Highlight Reel',
        'violations_by_hour': [{'hour': 12, 'count': 5}],
        'sport_breakdown': sport_bd,
        'top_infringing_domains': [],
        'recent_scans': [],
        'total_rights_value_protected_usd': rights
    }
    
    _cache['data'] = ret
    _cache['ts'] = now
    return ret
