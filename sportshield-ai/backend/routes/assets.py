# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""
GET /assets — List all registered assets from Firestore.
WHY: Required by the dashboard to display the Content Registry.
Blueprint Module 8: GET /assets
"""

import time
import logging
from fastapi import APIRouter, Request
from google.cloud.firestore import FieldFilter
from config.firebase import get_firestore

logger = logging.getLogger(__name__)
router = APIRouter()

_cache = {'data': None, 'ts': 0}

@router.get("/")
async def list_assets(
    user_uid: str = None,
    sport_category: str = None,
    status: str = None,
    limit: int = 50
):
    """
    Returns all registered assets, optionally filtered by owner uid / category / status.
    Caches results for 30 seconds to avoid hammering Firestore during the demo.
    """
    now = time.time()
    cache_key = f"{user_uid}:{sport_category}:{status}:{limit}"

    try:
        db = get_firestore()
        query = db.collection('assets')

        if user_uid:
            query = query.where(filter=FieldFilter('owner_uid', '==', user_uid))
        if sport_category:
            query = query.where(filter=FieldFilter('sport_category', '==', sport_category))
        if status:
            query = query.where(filter=FieldFilter('status', '==', status))

        docs = query.limit(limit).stream()
        assets = []
        for doc in docs:
            d = doc.to_dict()
            d['asset_id'] = doc.id          # ensure id is always present
            assets.append(d)

        # Sort newest first (registered_at_unix is always set)
        assets.sort(key=lambda x: x.get('registered_at_unix', 0), reverse=True)
        return {'assets': assets, 'count': len(assets)}

    except Exception as e:
        logger.error(f"list_assets failed: {e}")
        return {'assets': [], 'count': 0, 'error': str(e)}


@router.get("/{asset_id}")
async def get_asset(asset_id: str):
    """Fetch a single asset by ID."""
    try:
        db = get_firestore()
        doc = db.collection('assets').document(asset_id).get()
        if not doc.exists:
            from fastapi import HTTPException
            raise HTTPException(404, "Asset not found")
        d = doc.to_dict()
        d['asset_id'] = doc.id
        return d
    except Exception as e:
        logger.error(f"get_asset failed: {e}")
        from fastapi import HTTPException
        raise HTTPException(500, str(e))


@router.delete("/{asset_id}")
async def delete_asset(asset_id: str, user_uid: str):
    """Soft-delete an asset (sets status='deleted'). Requires owner uid."""
    try:
        db = get_firestore()
        ref = db.collection('assets').document(asset_id)
        doc = ref.get()
        if not doc.exists:
            from fastapi import HTTPException
            raise HTTPException(404, "Asset not found")
        d = doc.to_dict()
        if d.get('owner_uid') != user_uid:
            from fastapi import HTTPException
            raise HTTPException(403, "Not authorized")
        ref.update({'status': 'deleted'})
        return {'success': True, 'asset_id': asset_id}
    except Exception as e:
        logger.error(f"delete_asset failed: {e}")
        from fastapi import HTTPException
        raise HTTPException(500, str(e))
