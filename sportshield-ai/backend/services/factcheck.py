# SportShield AI | Google Solution Challenge 2026 | First Prize Target

import httpx
import logging
from config.settings import FACT_CHECK_API_KEY

logger = logging.getLogger(__name__)

async def check_fact_claims(query: str) -> list:
    if not FACT_CHECK_API_KEY:
        return []
        
    try:
        url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params={'query': query, 'key': FACT_CHECK_API_KEY, 'languageCode': 'en', 'pageSize': 5}, timeout=5.0)
            
        if resp.status_code == 200:
            claims = resp.json().get('claims', [])
            res = []
            for c in claims[:3]:
                review = c.get('claimReview', [{}])[0]
                res.append({
                    'claim_text': c.get('text', ''),
                    'claimant': c.get('claimant', 'Unknown'),
                    'rating': review.get('textualRating', 'Unknown'),
                    'publisher': review.get('publisher', {}).get('name', 'Unknown'),
                    'url': review.get('url', ''),
                    'claim_date': c.get('claimDate', '')
                })
            return res
        return []
    except Exception as e:
        logger.warning(f"Fact check failed: {e}")
        return []
