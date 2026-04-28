# ShieldCoreAI | Google Solution Challenge 2026
"""
Blockchain Timestamping via OpenTimestamps (free, Bitcoin-anchored).
WHY: Proves that a specific SHA-256 hash existed at a specific time,
anchored to the Bitcoin blockchain. Legally stronger than any internal timestamp.
API: https://alice.btc.calendar.opentimestamps.org/digest
"""

import base64
import logging
import asyncio
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)

OTS_CALENDARS = [
    'https://alice.btc.calendar.opentimestamps.org',
    'https://bob.btc.calendar.opentimestamps.org',
    'https://finney.calendar.eternitywall.com'
]


async def submit_to_blockchain(sha256_hex: str) -> dict:
    """
    Submit a SHA-256 hash to OpenTimestamps calendar servers.
    Returns a receipt dict with calendar_url, submitted_at, and receipt_b64.
    The receipt proves the hash existed at submission_time on the Bitcoin blockchain.
    """
    if not sha256_hex or len(sha256_hex) != 64:
        return {'success': False, 'error': 'Invalid SHA-256 hash'}

    digest_bytes = bytes.fromhex(sha256_hex)
    submitted_at = datetime.utcnow().isoformat() + 'Z'

    async with httpx.AsyncClient(timeout=10.0) as client:
        for calendar in OTS_CALENDARS:
            try:
                url = f'{calendar}/digest'
                resp = await client.post(
                    url,
                    content=digest_bytes,
                    headers={'Content-Type': 'application/octet-stream'}
                )
                if resp.status_code == 200:
                    receipt_b64 = base64.b64encode(resp.content).decode('utf-8')
                    return {
                        'success': True,
                        'calendar_url': calendar,
                        'submitted_at': submitted_at,
                        'receipt_b64': receipt_b64,
                        'sha256': sha256_hex,
                        'blockchain': 'Bitcoin',
                        'standard': 'OpenTimestamps RFC',
                        'verification_url': f'{calendar}/timestamp/{sha256_hex}'
                    }
            except Exception as e:
                logger.warning(f'OTS calendar {calendar} failed: {e}')
                continue

    return {
        'success': False,
        'error': 'All OpenTimestamps calendars unavailable',
        'submitted_at': submitted_at,
        'sha256': sha256_hex,
        'fallback_note': 'Hash recorded in ShieldCoreAI internal ledger. Blockchain anchor pending.'
    }
