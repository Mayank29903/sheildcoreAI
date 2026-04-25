# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""WHY ip-api.com: Free, no API key, 45 req/min.
Adds geographic context to violations so propagation map shows real cities."""

import httpx
import logging
import urllib.parse

logger = logging.getLogger(__name__)

async def get_geo_from_domain(domain: str) -> dict:
    empty = {'geo_lat': None, 'geo_lng': None, 'geo_city': None, 'geo_country': None}
    try:
        domain = domain.replace('http://', '').replace('https://', '').split('/')[0]
        if not domain or domain.startswith('127.0.0.1') or domain.startswith('localhost'):
            return empty

        url = f"http://ip-api.com/json/{domain}?fields=status,lat,lon,city,country,countryCode"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=3.0)

        if resp.status_code == 200:
            data = resp.json()
            if data.get('status') == 'success':
                return {
                    'geo_lat': data.get('lat'),
                    'geo_lng': data.get('lon'),
                    'geo_city': data.get('city'),
                    'geo_country': data.get('country')
                }
        return empty
    except Exception as e:
        logger.warning(f"Geo lookup failed: {e}")
        return empty

async def get_geo_from_url(url: str) -> dict:
    try:
        netloc = urllib.parse.urlparse(url).netloc
        if not netloc: return {'geo_lat': None, 'geo_lng': None, 'geo_city': None, 'geo_country': None}
        return await get_geo_from_domain(netloc)
    except Exception:
        return {'geo_lat': None, 'geo_lng': None, 'geo_city': None, 'geo_country': None}
