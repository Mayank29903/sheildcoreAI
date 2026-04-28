# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import time
import logging
from datetime import datetime, timedelta, timezone
from google.cloud.firestore import FieldFilter
from config.firebase import get_firestore, get_rtdb

logger = logging.getLogger(__name__)

async def check_viral_spread(asset_id: str, asset_name: str) -> dict:
    try:
        db = get_firestore()
        rtdb = get_rtdb()
        
        now = datetime.now(timezone.utc)
        one_hr_ago = now - timedelta(hours=1)
        six_hr_ago = now - timedelta(hours=6)
        
        docs = db.collection('violations').where(filter=FieldFilter('asset_id', '==', asset_id)).stream()
        
        last_1hr, last_6hr, total = 0, 0, 0
        timeline = []
        
        for doc in docs:
            total += 1
            data = doc.to_dict()
            dt = data.get('detected_at')
            if dt:
                timeline.append(dt)
                if dt >= one_hr_ago: last_1hr += 1
                if dt >= six_hr_ago: last_6hr += 1
                
        if last_1hr >= 5: alert_level, color = "VIRAL_SPREAD", "#ef4444"
        elif last_1hr >= 3: alert_level, color = "RAPID_SPREAD", "#f97316"
        elif last_1hr >= 1: alert_level, color = "SPREADING", "#f59e0b"
        else: alert_level, color = "CONTAINED", "#10b981"
        
        info = {
            'asset_name': asset_name,
            'owner_name': 'Known Owner',
            'violations_last_hour': last_1hr,
            'violations_last_6hr': last_6hr,
            'violations_total': total,
            'alert_level': alert_level,
            'color': color,
            'is_active': alert_level != 'CONTAINED',
            'updated_at': int(time.time() * 1000)
        }
        
        rtdb.child(f'viral_alerts/{asset_id}').set(info)
        return info
    except Exception as e:
        logger.error(f"check_viral_spread failed: {e}")
        return {}
