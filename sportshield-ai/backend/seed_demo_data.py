# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""
Run ONCE before demo day. Creates realistic demo data.
NEVER run this from inside Cloud Run — local execution only.
"""

import time
from datetime import datetime, timedelta, timezone
from config.firebase import init_firebase, get_firestore, get_rtdb

VIOLATION_CITIES = [
    {'lat': 51.5074, 'lng': -0.1278, 'hours_ago': 5.5, 'domain': 'sportspiracy.co.uk'},
    {'lat': 25.2048, 'lng': 55.2708, 'hours_ago': 3.5, 'domain': 'sportsmedia-free.ae'},
    {'lat': 19.0760, 'lng': 72.8777, 'hours_ago': 1.5, 'domain': 'cricketfreestream.in'},
    {'lat': 1.3521,  'lng': 103.8198,'hours_ago': 0.42,'domain': 'freesports.sg'}
]

ASSET_ID = 'demo_cricket_stadium_asset_001'
OWNER = {'name': 'BCCI Official Media', 'email': 'media@bcci.tv', 'org': 'BCCI Official'}

def seed_demo_asset(db):
    db.collection('assets').document(ASSET_ID).set({
        'asset_id': ASSET_ID, 'owner_name': OWNER['name'], 'owner_email': OWNER['email'],
        'organization': OWNER['org'], 'asset_name': 'Final Match Highlight Reel',
        'sport_category': 'Cricket', 'total_violations': 4, 'status': 'active',
        'estimated_rights_value_usd': 94000
    })

def seed_violations(db, rtdb):
    now = datetime.now(timezone.utc)
    now_ms = int(time.time() * 1000)
    for i, city in enumerate(VIOLATION_CITIES):
        v_id = f"demo_violation_{i}"
        dt = now - timedelta(hours=city['hours_ago'])
        dt_ms = int(dt.timestamp() * 1000)
        
        doc = {
            'violation_id': v_id, 'asset_id': ASSET_ID, 'asset_name': 'Final Match Highlight Reel',
            'owner_name': OWNER['name'], 'organization': OWNER['org'], 'sport_category': 'Cricket',
            'source_domain': city['domain'], 'geo_lat': city['lat'], 'geo_lng': city['lng'],
            'detected_at': dt, 'status': 'detected', 'detection_type': 'theft', 'similarity_percent': 98.5
        }
        db.collection('violations').document(v_id).set(doc)
        
        rtdb.child(f'violations_live/{v_id}').set({
            'asset_name': doc['asset_name'], 'owner_name': doc['owner_name'], 'organization': doc['organization'],
            'sport_category': doc['sport_category'], 'detection_type': 'theft', 'similarity_percent': doc['similarity_percent'],
            'threat_level': 'HIGH', 'source_domain': doc['source_domain'], 'detected_at': dt_ms, 'expires_at': now_ms + 3600000
        })

def seed_viral_alert(rtdb):
    rtdb.child(f'viral_alerts/{ASSET_ID}').set({
        'asset_name': 'Final Match Highlight Reel', 'owner_name': OWNER['name'],
        'violations_last_hour': 2, 'violations_last_6hr': 4, 'violations_total': 4,
        'alert_level': 'RAPID_SPREAD', 'color': '#f97316', 'is_active': True, 'updated_at': int(time.time() * 1000)
    })

def seed_dashboard_stats(rtdb):
    rtdb.child('dashboard_stats').set({
        'assets_protected': 47, 'total_scans_today': 123, 'violations_today': 8,
        'rights_value_protected_usd': 94000, 'last_updated': int(time.time() * 1000)
    })

def main():
    init_firebase()
    db, rtdb = get_firestore(), get_rtdb()
    seed_demo_asset(db)
    seed_violations(db, rtdb)
    seed_viral_alert(rtdb)
    seed_dashboard_stats(rtdb)
    
    print("DEMO DATA SEEDED SUCCESSFULLY")

if __name__ == '__main__':
    main()
