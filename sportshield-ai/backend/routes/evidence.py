# SportShield AI | Google Solution Challenge 2026 | First Prize Target

from fastapi import APIRouter, HTTPException, Response
from config.firebase import get_firestore
from services.pdf_gen import generate_evidence_pdf

router = APIRouter()

@router.get("/{scan_id}/report.pdf")
async def download_evidence_pdf(scan_id: str):
    db = get_firestore()
    doc = db.collection('scans').document(scan_id).get()
    
    if not doc.exists:
        raise HTTPException(404, "Scan target missing")
        
    scan_data = doc.to_dict()
    asset_data = None
    if scan_data.get('matched_asset_id'):
        adoc = db.collection('assets').document(scan_data['matched_asset_id']).get()
        if adoc.exists: asset_data = adoc.to_dict()
            
    pdf_bytes = generate_evidence_pdf(scan_data, asset_data)
    
    return Response(
        content=pdf_bytes, media_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="sportshield_evidence_{scan_id[:8]}.pdf"'}
    )
