# ShieldCoreAI | Demo Gallery Route
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix='/demo', tags=['Demo'])

@router.get('/samples')
async def get_demo_samples():
    """Returns metadata for all demo gallery samples. Used by DemoGallery.jsx."""
    return JSONResponse({'samples': [], 'count': 0}) # Can populate this with actual SAMPLES later if needed, mostly used for health check

@router.get('/health')
async def demo_health():
    return {'status': 'ok', 'message': 'Demo gallery is live. Open /demo in the frontend.'}
