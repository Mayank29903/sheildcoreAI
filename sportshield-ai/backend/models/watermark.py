# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""
WHY LSB STEGANOGRAPHY: Ownership proof embedded at pixel level.
stegano library (NOT invisible-watermark — has C++ deps breaking Cloud Run).
CRITICAL LIMITATION: stegano works with PNG ONLY.
JPEG compression destroys LSB data.
For demo: OS screenshots save as PNG and watermark survives.
Stolen JPEG copies are caught by pHash instead.
"""

import json
from stegano import lsb

WATERMARK_METADATA_FIELDS = [
    'cert_id', 'owner_name', 'owner_email', 'asset_id', 'asset_name',
    'sport_category', 'organization', 'registered_at', 'issued_by', 'standard'
]


def build_watermark_metadata(
    cert_id: str, owner_name: str, owner_email: str, asset_id: str,
    asset_name: str, sport_category: str, organization: str,
    registered_at_unix: int
) -> dict:
    """
    Constructs the robust JSON payload to be embedded into the image
    as a watermark.
    """
    return {
        'cert_id': cert_id,
        'owner_name': owner_name,
        'owner_email': owner_email,
        'asset_id': asset_id,
        'asset_name': asset_name,
        'sport_category': sport_category,
        'organization': organization,
        'registered_at': registered_at_unix,
        'issued_by': 'SportShield AI v2.0',
        'standard': 'C2PA-compatible'
    }


def embed_watermark(image_path: str, out_path: str, metadata: dict) -> str:
    """
    Embed JSON metadata as LSB steganography in PNG.
    Returns out_path on success. Raises on failure.
    """
    payload = json.dumps(metadata, separators=(',', ':'))
    secret = lsb.hide(image_path, payload)
    secret.save(out_path)
    return out_path


def extract_watermark(image_path: str) -> dict | None:
    """
    Extract and parse LSB watermark from image.
    Returns None on ANY failure — never raises.
    WHY NONE NOT EXCEPTION: scan.py treats None as 'no watermark found'
    and continues processing other signals.
    """
    try:
        payload = lsb.reveal(image_path)
        if not payload:
            return None

        data = json.loads(payload)

        if 'cert_id' not in data:
            return None

        return data
    except Exception:
        return None
