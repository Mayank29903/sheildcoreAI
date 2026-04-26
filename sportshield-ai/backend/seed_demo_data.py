# ShieldCore AI | Google Solution Challenge 2026 | First Prize Target

"""
COMPREHENSIVE DEMO DATA SEEDER — Run ONCE before demo day.
=============================================================
Creates a complete, realistic demo scenario:

STORY:  BCCI registers 3 official cricket media assets.
        4 piracy violations appear across 4 global hotspots.
        A deepfake scan record shows a detected fake face.
        Dashboard stats reflect a "live attack" scenario.

RUN WITH:  cd backend && python seed_demo_data.py

WARNING: Never run inside Cloud Run. Local execution only.
         This will OVERWRITE existing demo_ documents.
"""

import os
import io
import time
import hashlib
import struct
import zlib
from datetime import datetime, timedelta, timezone

# ── Bootstrap imports before config ──────────────────────────────────────
from config.firebase import init_firebase, get_firestore, get_rtdb


# ─────────────────────────────────────────────────────────────────────────
# DEMO CONSTANTS
# ─────────────────────────────────────────────────────────────────────────

OWNER = {
    'name':  'BCCI Official Media',
    'email': 'media@bcci.tv',
    'org':   'Board of Control for Cricket in India',
    'uid':   'demo_bcci_uid_001',
}

DEMO_ASSETS = [
    {
        'asset_id':     'demo_asset_ipl_final_001',
        'asset_name':   'IPL Finals — Winning Six Moment',
        'sport_category': 'IPL',
        'rights_value': 500,
        'cert_suffix':  'A1B2C3',
    },
    {
        'asset_id':     'demo_asset_athlete_portrait_002',
        'asset_name':   'Virat Kohli Official Portrait 2024',
        'sport_category': 'Cricket',
        'rights_value': 400,
        'cert_suffix':  'D4E5F6',
    },
    {
        'asset_id':     'demo_asset_trophy_003',
        'asset_name':   'World Cup Trophy Ceremony',
        'sport_category': 'Cricket',
        'rights_value': 800,
        'cert_suffix':  'G7H8I9',
    },
]

VIOLATION_CITIES = [
    {
        'lat': 51.5074,  'lng': -0.1278,
        'city': 'London',      'country': 'UK',
        'domain': 'sportspiracy.co.uk',
        'hours_ago': 5.5,  'asset_idx': 0,
        'type': 'theft',   'similarity': 98.5,
    },
    {
        'lat': 25.2048,  'lng': 55.2708,
        'city': 'Dubai',       'country': 'UAE',
        'domain': 'sportsmedia-free.ae',
        'hours_ago': 3.5,  'asset_idx': 1,
        'type': 'theft',   'similarity': 97.2,
    },
    {
        'lat': 19.0760,  'lng': 72.8777,
        'city': 'Mumbai',      'country': 'India',
        'domain': 'cricketfreestream.in',
        'hours_ago': 1.5,  'asset_idx': 0,
        'type': 'deepfake', 'similarity': 0.0,
    },
    {
        'lat': 1.3521,   'lng': 103.8198,
        'city': 'Singapore',   'country': 'SG',
        'domain': 'freesports.sg',
        'hours_ago': 0.42,  'asset_idx': 2,
        'type': 'both',    'similarity': 99.1,
    },
]

DEMO_SCAN = {
    'scan_id':                'demo_scan_deepfake_001',
    'user_uid':               OWNER['uid'],
    'file_name':              'synthetic_face.jpg',
    'file_type':              'image/jpeg',
    'file_size_bytes':        245000,
    'trust_score':            22,
    'threat_level':           'CRITICAL',
    'deepfake_is_fake':       True,
    'deepfake_confidence':    94.7,
    'deepfake_verdict':       'DEEPFAKE DETECTED',
    'deepfake_frames_analyzed': 1,
    'asset_match_found':      False,
    'watermark_found':        False,
    'exif_flags':             ['EXIF_STRIPPED', 'SUSPICIOUS_SOFTWARE'],
    'exif_risk_score':        85,
    'exif_risk_label':        'CRITICAL',
    'content_dna_score':      18,
    'content_dna_grade':      'CONFIRMED THREAT',
    'content_dna_color':      '#ff3d3d',
    'gemini_legal_report': {
        'summary':          'A synthetic face image was detected with 94.7% confidence. This is a high-risk deepfake potentially used for sports betting fraud or identity impersonation.',
        'threat_level':     'CRITICAL',
        'immediate_actions': [
            'Preserve the original file and its metadata immediately',
            'Report to National Cyber Crime Portal at cybercrime.gov.in',
            'Contact CERT-In for technical assistance',
            'Document all instances where the deepfake appeared',
        ],
        'report_to': [
            {'authority': 'National Cyber Crime Portal', 'url': 'https://cybercrime.gov.in',  'how': 'Online complaint'},
            {'authority': 'CERT-In',                    'url': 'https://cert-in.org.in',     'how': 'Email incident@cert-in.org.in'},
            {'authority': 'Cyber Cell',                 'url': 'https://cybercrime.gov.in',  'how': 'File FIR at local Cyber Cell'},
        ],
        'legal_sections': [
            'IT Act 2000 Section 66C — Identity Theft (3 years imprisonment)',
            'IT Act 2000 Section 66D — Cheating by Personation (3 years + ₹1 lakh fine)',
            'IT Act 2000 Section 67 — Publishing Obscene Material',
            'IPC Section 469 — Forgery for Harming Reputation',
        ],
        'evidence_to_preserve': [
            'Original file with timestamp',
            'URL/source where deepfake was found',
            'Screenshots of the content in context',
            'Any communications referencing the deepfake',
        ],
        'estimated_timeline': '3–6 months for formal investigation; interim injunction possible within 2 weeks',
        'rights_impact':      'Potential reputational damage to athlete/organization; financial fraud risk estimated ₹50 lakh+',
    },
}


# ─────────────────────────────────────────────────────────────────────────
# MINIMAL PNG GENERATOR (no Pillow needed for seeding)
# Creates a valid 100x100 solid-color PNG in memory.
# ─────────────────────────────────────────────────────────────────────────

def _make_png_bytes(r: int, g: int, b: int, width: int = 100, height: int = 100) -> bytes:
    """Generate a minimal valid PNG file with a solid color."""
    def chunk(tag: bytes, data: bytes) -> bytes:
        c = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    raw  = b''
    row  = bytes([r, g, b] * width)
    for _ in range(height):
        raw += b'\x00' + row                      # filter byte 0 (None)
    idat = zlib.compress(raw)

    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', ihdr)
        + chunk(b'IDAT', idat)
        + chunk(b'IEND', b'')
    )


def _make_cert_id(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:12].upper()


def _make_phash_hex(data: bytes) -> str:
    """Deterministic fake pHash (for demo only — real pHash uses imagehash)."""
    h = hashlib.md5(data).hexdigest()
    return h[:16]


# ─────────────────────────────────────────────────────────────────────────
# SEED FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────

def seed_demo_assets(db):
    """Register 3 demo assets with realistic fingerprints."""
    now_unix = int(time.time())
    colors   = [(0, 120, 200), (0, 180, 100), (220, 80, 0)]   # blue, green, orange

    for i, asset in enumerate(DEMO_ASSETS):
        png_bytes = _make_png_bytes(*colors[i])
        sha256    = hashlib.sha256(png_bytes).hexdigest()
        cert_id   = sha256[:12].upper()
        phash     = _make_phash_hex(png_bytes)

        doc = {
            'asset_id':                    asset['asset_id'],
            'owner_uid':                   OWNER['uid'],
            'owner_name':                  OWNER['name'],
            'owner_email':                 OWNER['email'],
            'organization':                OWNER['org'],
            'asset_name':                  asset['asset_name'],
            'sport_category':              asset['sport_category'],
            'content_type':                'image/png',
            'cert_id':                     cert_id,
            'sha256':                      sha256,
            'phash':                       phash,
            'dhash':                       phash,        # simplified for demo
            'ahash':                       phash,
            'estimated_rights_value_usd':  asset['rights_value'],
            'registered_at_unix':          now_unix - (i * 3600),
            'total_violations':            [2, 1, 1][i],
            'status':                      'active',
            'exif_snapshot':               {},
            'original_url':                f'https://demo.shieldcore.ai/assets/{asset["asset_id"]}.png',
            'watermarked_url':             f'https://demo.shieldcore.ai/assets/{asset["asset_id"]}_wm.png',
        }
        db.collection('assets').document(asset['asset_id']).set(doc)
        print(f"  ✓ Asset registered: {asset['asset_name']} | CERT: {cert_id}")


def seed_violations(db, rtdb):
    """Seed 4 global violations matching the demo story."""
    now      = datetime.now(timezone.utc)
    now_ms   = int(time.time() * 1000)

    for i, city in enumerate(VIOLATION_CITIES):
        v_id    = f'demo_violation_{i:03d}'
        a_idx   = city['asset_idx']
        asset   = DEMO_ASSETS[a_idx]
        dt      = now - timedelta(hours=city['hours_ago'])
        dt_ms   = int(dt.timestamp() * 1000)

        doc = {
            'violation_id':      v_id,
            'asset_id':          asset['asset_id'],
            'asset_name':        asset['asset_name'],
            'owner_name':        OWNER['name'],
            'owner_email':       OWNER['email'],
            'organization':      OWNER['org'],
            'sport_category':    asset['sport_category'],
            'source_url':        f'https://{city["domain"]}/stolen_{i}.jpg',
            'source_domain':     city['domain'],
            'detection_method':  'auto_crawl',
            'detection_type':    city['type'],
            'similarity_percent': city['similarity'],
            'is_deepfake':       city['type'] in ('deepfake', 'both'),
            'deepfake_confidence': 91.2 if city['type'] in ('deepfake', 'both') else 0.0,
            'geo_lat':           city['lat'],
            'geo_lng':           city['lng'],
            'geo_city':          city['city'],
            'geo_country':       city['country'],
            'estimated_loss_usd': asset['rights_value'],
            'status':            'detected',
            'detected_at':       dt,
            'evidence_scan_id':  DEMO_SCAN['scan_id'],
        }
        db.collection('violations').document(v_id).set(doc)

        rtdb.child(f'violations_live/{v_id}').set({
            'asset_name':        asset['asset_name'],
            'owner_name':        OWNER['name'],
            'organization':      OWNER['org'],
            'sport_category':    asset['sport_category'],
            'detection_type':    city['type'],
            'similarity_percent': city['similarity'],
            'threat_level':      'CRITICAL' if city['type'] in ('deepfake', 'both') else 'HIGH',
            'source_domain':     city['domain'],
            'geo_city':          city['city'],
            'geo_country':       city['country'],
            'detected_at':       dt_ms,
            'expires_at':        now_ms + 3_600_000,
        })
        print(f"  ✓ Violation seeded: {city['city']}, {city['country']} | {city['type'].upper()}")


def seed_deepfake_scan(db):
    """Seed one completed deepfake scan record (the 'stopped attack' moment in the demo)."""
    db.collection('scans').document(DEMO_SCAN['scan_id']).set({
        **DEMO_SCAN,
        'scanned_at': datetime.now(timezone.utc),
    })
    print(f"  ✓ Demo scan record: {DEMO_SCAN['scan_id']} | DEEPFAKE DETECTED | Trust: {DEMO_SCAN['trust_score']}")


def seed_viral_alert(rtdb):
    """Seed a VIRAL_SPREAD alert for the first demo asset."""
    a = DEMO_ASSETS[0]
    rtdb.child(f'viral_alerts/{a["asset_id"]}').set({
        'asset_name':            a['asset_name'],
        'owner_name':            OWNER['name'],
        'violations_last_hour':  3,
        'violations_last_6hr':   4,
        'violations_total':      4,
        'alert_level':           'RAPID_SPREAD',
        'color':                 '#f97316',
        'is_active':             True,
        'source_count':          4,
        'updated_at':            int(time.time() * 1000),
    })
    print(f"  ✓ Viral alert seeded: {a['asset_name']} — RAPID_SPREAD")


def seed_dashboard_stats(rtdb):
    """Set realistic dashboard counters for the demo."""
    rtdb.child('dashboard_stats').set({
        'assets_protected':           47,
        'total_scans_today':          123,
        'violations_today':           8,
        'rights_value_protected_usd': 94_000,
        'last_updated':               int(time.time() * 1000),
    })
    print('  ✓ Dashboard stats: 47 assets | 123 scans | 8 violations | $94,000 protected')


# ─────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────

def main():
    print('\n🛡  ShieldCore AI — Demo Data Seeder')
    print('=' * 50)

    print('\n[1/6] Initializing Firebase...')
    init_firebase()
    db   = get_firestore()
    rtdb = get_rtdb()

    print('\n[2/6] Seeding demo assets...')
    seed_demo_assets(db)

    print('\n[3/6] Seeding violations...')
    seed_violations(db, rtdb)

    print('\n[4/6] Seeding deepfake scan record...')
    seed_deepfake_scan(db)

    print('\n[5/6] Seeding viral alert...')
    seed_viral_alert(rtdb)

    print('\n[6/6] Seeding dashboard stats...')
    seed_dashboard_stats(rtdb)

    print('\n' + '=' * 50)
    print('✅  DEMO DATA SEEDED SUCCESSFULLY')
    print('\nNext steps:')
    print('  1. Open the dashboard — you should see 47 assets, 8 violations, $94K protected')
    print('  2. Go to Violations Feed — 4 global incidents appear on the map')
    print('  3. Go to Registry — 3 BCCI assets are registered')
    print('  4. Go to Evidence /report/demo_scan_deepfake_001 — deepfake report ready')
    print('  5. Start demo recording!\n')


if __name__ == '__main__':
    main()
