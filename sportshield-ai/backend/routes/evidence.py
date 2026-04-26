# ShieldCore AI | Google Solution Challenge 2026 | First Prize Target

"""
Evidence route — PDF report download + certificate PDF download.
Blueprint Module 4: 'SHA-256 cert with cert_id, ReportLab PDF with evidence'.
Added: GET /{asset_id}/certificate.pdf — downloads ownership certificate for registered assets.
"""

from fastapi import APIRouter, HTTPException, Response
from config.firebase import get_firestore
from services.pdf_gen import generate_evidence_pdf
from services.certificate import generate_certificate, generate_certificate_pdf

router = APIRouter()


@router.get("/{scan_id}/report.pdf")
async def download_evidence_pdf(scan_id: str):
    """
    Download the 4-page legal evidence PDF for a completed scan.
    Includes: threat summary, EXIF forensics, Gemini legal plan, technical hashes.
    """
    db = get_firestore()
    doc = db.collection('scans').document(scan_id).get()

    if not doc.exists:
        raise HTTPException(404, "Scan not found — run a scan first")

    scan_data = doc.to_dict()
    asset_data = None
    if scan_data.get('matched_asset_id'):
        adoc = db.collection('assets').document(scan_data['matched_asset_id']).get()
        if adoc.exists:
            asset_data = adoc.to_dict()

    pdf_bytes = generate_evidence_pdf(scan_data, asset_data)

    return Response(
        content=pdf_bytes,
        media_type='application/pdf',
        headers={
            'Content-Disposition': f'attachment; filename="shieldcore_evidence_{scan_id[:8]}.pdf"',
            'Cache-Control': 'no-store',
        }
    )


@router.get("/{asset_id}/certificate.pdf")
async def download_certificate_pdf(asset_id: str):
    """
    Download a one-page ownership certificate PDF for a registered asset.
    WHY: Judges ask 'what proof of ownership do you have?' — show them this PDF.
    The cert_id matches the SHA-256 fingerprint registered in Firestore.
    """
    db = get_firestore()
    doc = db.collection('assets').document(asset_id).get()

    if not doc.exists:
        raise HTTPException(404, "Asset not found — register it first")

    data = doc.to_dict()

    cert = {
        'cert_id':       data.get('cert_id', 'N/A'),
        'sha256':        data.get('sha256', ''),
        'org':           data.get('organization', 'Unknown'),
        'asset_name':    data.get('asset_name', 'Unknown'),
        'owner_name':    data.get('owner_name', 'Unknown'),
        'registered_at': data.get('registered_at_unix', ''),
        'issued_by':     'ShieldCore AI v2.0',
        'standard':      'C2PA-compatible',
        'it_act_compliance': 'IT Act 2000, Section 65B — Admissibility of Electronic Records',
    }

    pdf_bytes = generate_certificate_pdf(cert)

    return Response(
        content=pdf_bytes,
        media_type='application/pdf',
        headers={
            'Content-Disposition': f'attachment; filename="shieldcore_cert_{cert["cert_id"]}.pdf"',
            'Cache-Control': 'no-store',
        }
    )


@router.get("/{asset_id}/certificate.json")
async def get_certificate_json(asset_id: str):
    """
    Return certificate data as JSON (for frontend display / verification).
    WHY: Allows the UI to show the cert inline before offering a PDF download.
    """
    db = get_firestore()
    doc = db.collection('assets').document(asset_id).get()

    if not doc.exists:
        raise HTTPException(404, "Asset not found")

    data = doc.to_dict()
    return {
        'cert_id':       data.get('cert_id'),
        'sha256':        data.get('sha256'),
        'phash':         data.get('phash'),
        'asset_name':    data.get('asset_name'),
        'owner_name':    data.get('owner_name'),
        'organization':  data.get('organization'),
        'sport_category':data.get('sport_category'),
        'registered_at': data.get('registered_at_unix'),
        'issued_by':     'ShieldCore AI v2.0',
        'standard':      'C2PA-compatible',
        'original_url':  data.get('original_url'),
        'watermarked_url': data.get('watermarked_url'),
        'it_act':        'IT Act 2000 §65B — Electronic Record Admissibility',
        'copyright_act': 'Copyright Act 1957 §51 — Infringement Protection',
    }
