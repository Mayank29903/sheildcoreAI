# ShieldCore AI | Google Solution Challenge 2026
"""
COMPREHENSIVE DEMO DATA SEEDER — Run ONCE before demo day.
=============================================================
Story: 3 major sports orgs have registered assets.
       8 violations detected globally in the past 6 hours —
       deepfakes, IP theft, and dual threats across 8 countries.
       Dashboard shows a live attack scenario in progress.

RUN WITH:  cd backend && python seed_demo_data.py

WARNING: Never run inside Cloud Run. Local execution only.
         Adds to existing data — safe to run multiple times.
"""

import os
import io
import time
import uuid
import hashlib
import struct
import zlib
import random
from datetime import datetime, timedelta, timezone

from config.firebase import init_firebase, get_firestore, get_rtdb

# ─────────────────────────────────────────────────────────────────────────
# ORGANISATIONS
# ─────────────────────────────────────────────────────────────────────────

ORGS = {
    'bcci': {
        'name':  'BCCI Official Media',
        'email': 'media@bcci.tv',
        'org':   'Board of Control for Cricket in India',
        'uid':   'demo_uid_bcci_001',
    },
    'fifa': {
        'name':  'FIFA Media Rights',
        'email': 'copyright@fifa.com',
        'org':   'Fédération Internationale de Football Association',
        'uid':   'demo_uid_fifa_002',
    },
    'sai': {
        'name':  'SAI Media Division',
        'email': 'media@sai.gov.in',
        'org':   'Sports Authority of India',
        'uid':   'demo_uid_sai_003',
    },
}

# ─────────────────────────────────────────────────────────────────────────
# ASSETS  (6 across 3 orgs and 5 sport categories)
# ─────────────────────────────────────────────────────────────────────────

DEMO_ASSETS = [
    {
        'asset_id':       'demo_asset_ipl_kohli_001',
        'asset_name':     'IPL 2024 — Kohli Century Celebration',
        'sport_category': 'IPL',
        'rights_value':   500,
        'org_key':        'bcci',
        'color':          (0, 120, 200),
    },
    {
        'asset_id':       'demo_asset_cricket_wc_002',
        'asset_name':     'T20 World Cup 2024 — India Lift Trophy',
        'sport_category': 'Cricket',
        'rights_value':   800,
        'org_key':        'bcci',
        'color':          (0, 160, 80),
    },
    {
        'asset_id':       'demo_asset_fifa_messi_003',
        'asset_name':     'FIFA World Cup Final — Messi Holds Trophy',
        'sport_category': 'FIFA',
        'rights_value':   1000,
        'org_key':        'fifa',
        'color':          (220, 60, 0),
    },
    {
        'asset_id':       'demo_asset_fifa_ronaldo_004',
        'asset_name':     'UEFA Champions League — Ronaldo Hat-trick',
        'sport_category': 'FIFA',
        'rights_value':   900,
        'org_key':        'fifa',
        'color':          (180, 0, 80),
    },
    {
        'asset_id':       'demo_asset_olympics_neeraj_005',
        'asset_name':     'Olympics 2024 — Neeraj Chopra Gold Throw',
        'sport_category': 'Olympics',
        'rights_value':   1000,
        'org_key':        'sai',
        'color':          (120, 0, 200),
    },
    {
        'asset_id':       'demo_asset_olympics_pv_006',
        'asset_name':     'Olympics 2024 — PV Sindhu Silver Medal Ceremony',
        'sport_category': 'Olympics',
        'rights_value':   700,
        'org_key':        'sai',
        'color':          (200, 140, 0),
    },
]

# ─────────────────────────────────────────────────────────────────────────
# VIOLATIONS  (8 global incidents — 3 types, 8 countries)
# ─────────────────────────────────────────────────────────────────────────

VIOLATIONS = [
    {
        'vid':         'demo_viol_001',
        'asset_idx':   0,
        'type':        'theft',
        'similarity':  98.5,
        'is_deepfake': False,
        'df_conf':     0.0,
        'threat':      'HIGH',
        'domain':      'sportspiracy.co.uk',
        'lat': 51.5074, 'lng': -0.1278,
        'city': 'London', 'country': 'UK',
        'hours_ago':   5.5,
        'loss_usd':    500,
    },
    {
        'vid':         'demo_viol_002',
        'asset_idx':   2,
        'type':        'deepfake',
        'similarity':  0.0,
        'is_deepfake': True,
        'df_conf':     94.2,
        'threat':      'CRITICAL',
        'domain':      'fake-sports-bets.pk',
        'lat': 33.6844, 'lng': 73.0479,
        'city': 'Islamabad', 'country': 'Pakistan',
        'hours_ago':   4.1,
        'loss_usd':    1000,
    },
    {
        'vid':         'demo_viol_003',
        'asset_idx':   4,
        'type':        'both',
        'similarity':  88.1,
        'is_deepfake': True,
        'df_conf':     76.5,
        'threat':      'CRITICAL',
        'domain':      'sportsmedia-cn.xyz',
        'lat': 39.9042, 'lng': 116.4074,
        'city': 'Beijing', 'country': 'China',
        'hours_ago':   3.3,
        'loss_usd':    1000,
    },
    {
        'vid':         'demo_viol_004',
        'asset_idx':   1,
        'type':        'theft',
        'similarity':  96.7,
        'is_deepfake': False,
        'df_conf':     0.0,
        'threat':      'HIGH',
        'domain':      'freesports-dubai.ae',
        'lat': 25.2048, 'lng': 55.2708,
        'city': 'Dubai', 'country': 'UAE',
        'hours_ago':   2.8,
        'loss_usd':    800,
    },
    {
        'vid':         'demo_viol_005',
        'asset_idx':   3,
        'type':        'theft',
        'similarity':  91.3,
        'is_deepfake': False,
        'df_conf':     0.0,
        'threat':      'HIGH',
        'domain':      'pirateria-deportiva.br',
        'lat': -23.5505, 'lng': -46.6333,
        'city': 'São Paulo', 'country': 'Brazil',
        'hours_ago':   2.0,
        'loss_usd':    900,
    },
    {
        'vid':         'demo_viol_006',
        'asset_idx':   5,
        'type':        'deepfake',
        'similarity':  0.0,
        'is_deepfake': True,
        'df_conf':     89.3,
        'threat':      'CRITICAL',
        'domain':      'sports-deepfakes.ru',
        'lat': 55.7558, 'lng': 37.6173,
        'city': 'Moscow', 'country': 'Russia',
        'hours_ago':   1.5,
        'loss_usd':    700,
    },
    {
        'vid':         'demo_viol_007',
        'asset_idx':   2,
        'type':        'theft',
        'similarity':  93.8,
        'is_deepfake': False,
        'df_conf':     0.0,
        'threat':      'HIGH',
        'domain':      'soccer-stream-id.net',
        'lat': -6.2088, 'lng': 106.8456,
        'city': 'Jakarta', 'country': 'Indonesia',
        'hours_ago':   0.9,
        'loss_usd':    1000,
    },
    {
        'vid':         'demo_viol_008',
        'asset_idx':   0,
        'type':        'both',
        'similarity':  82.4,
        'is_deepfake': True,
        'df_conf':     71.8,
        'threat':      'CRITICAL',
        'domain':      'cricket-fake-ads.ng',
        'lat': 6.5244,  'lng': 3.3792,
        'city': 'Lagos', 'country': 'Nigeria',
        'hours_ago':   0.3,
        'loss_usd':    500,
    },
]

# ─────────────────────────────────────────────────────────────────────────
# DEMO SCAN RECORDS  (3 — one per threat type for demo navigation)
# ─────────────────────────────────────────────────────────────────────────

LEGAL_REPORT_DEEPFAKE = {
    'summary': 'A synthetic face image was detected with 94.2% AI confidence. High-risk deepfake likely used for sports betting fraud or athlete identity impersonation.',
    'threat_level': 'CRITICAL',
    'immediate_actions': [
        'Preserve the original file and metadata immediately',
        'Report to National Cyber Crime Portal at cybercrime.gov.in',
        'Contact CERT-In for technical assistance at incident@cert-in.org.in',
        'Document all instances and contexts where the deepfake appeared',
    ],
    'report_to': [
        {'authority': 'National Cyber Crime Portal', 'url': 'https://cybercrime.gov.in', 'how': 'Online complaint form'},
        {'authority': 'CERT-In', 'url': 'https://cert-in.org.in', 'how': 'Email incident@cert-in.org.in'},
        {'authority': 'Cyber Cell', 'url': 'https://cybercrime.gov.in', 'how': 'File FIR at local Cyber Cell'},
    ],
    'legal_sections': [
        'IT Act 2000 Section 66C — Identity Theft (3 years imprisonment)',
        'IT Act 2000 Section 66D — Cheating by Personation (3 years + ₹1 lakh fine)',
        'IT Act 2000 Section 67 — Publishing Obscene/False Material',
        'IPC Section 469 — Forgery for Harming Reputation',
    ],
    'evidence_to_preserve': [
        'Original file with full EXIF metadata',
        'URL and screenshot of where deepfake appeared',
        'Any linked betting or advertisement content',
        'Timestamps and geo-data of detection',
    ],
    'estimated_timeline': '3–6 months formal investigation; interim injunction possible within 2 weeks',
    'rights_impact': 'Reputational damage to athlete; financial fraud risk estimated ₹50 lakh+',
}

LEGAL_REPORT_THEFT = {
    'summary': 'Official sports media redistributed without license. 98.5% similarity to registered asset confirms unauthorized use.',
    'threat_level': 'HIGH',
    'immediate_actions': [
        'Issue DMCA takedown notice to hosting platform immediately',
        'Preserve evidence: screenshot, URL, timestamp',
        'Report to Copyright Office of India',
        'Notify revenue team of licensing loss',
    ],
    'report_to': [
        {'authority': 'Copyright Office of India', 'url': 'https://copyright.gov.in', 'how': 'Online complaint'},
        {'authority': 'National Cyber Crime Portal', 'url': 'https://cybercrime.gov.in', 'how': 'Online complaint form'},
    ],
    'legal_sections': [
        'Copyright Act 1957 Section 51 — Infringement of Copyright',
        'Copyright Act 1957 Section 55 — Civil Remedies',
        'IT Act 2000 Section 66 — Computer Related Offences',
    ],
    'evidence_to_preserve': [
        'ShieldCoreAI SHA-256 certificate of registered asset',
        'pHash similarity report (98.5%)',
        'URL of infringing content',
        'Registration timestamp proving prior ownership',
    ],
    'estimated_timeline': 'DMCA response within 48 hours; civil suit resolution 6–18 months',
    'rights_impact': 'Direct licensing revenue loss estimated $500 USD per incident',
}

DEMO_SCANS = [
    {
        'scan_id':                    'demo_scan_deepfake_001',
        'user_uid':                   ORGS['bcci']['uid'],
        'file_name':                  'synthetic_face_athlete.jpg',
        'file_type':                  'image/jpeg',
        'file_size_bytes':            245_000,
        'trust_score':                18,
        'threat_level':               'CRITICAL',
        'content_dna_score':          14,
        'content_dna_grade':          'CONFIRMED THREAT',
        'content_dna_color':          '#ff3d3d',
        'deepfake_is_fake':           True,
        'deepfake_confidence':        94.2,
        'deepfake_verdict':           'DEEPFAKE DETECTED',
        'deepfake_frames_analyzed':   1,
        'deepfake_duration_seconds':  None,
        'asset_match_found':          False,
        'matched_asset_id':           None,
        'matched_asset_name':         None,
        'similarity_percent':         0.0,
        'watermark_found':            False,
        'exif_flags':                 ['EXIF_STRIPPED', 'SUSPICIOUS_SOFTWARE'],
        'exif_risk_score':            85,
        'exif_risk_label':            'HIGH',
        'gemini_vision_manipulation_detected': True,
        'gemini_vision_authenticity_confidence': 12,
        'gemini_legal_report':        LEGAL_REPORT_DEEPFAKE,
        'content_dna_signals': {
            'exif_integrity':        {'score': 15, 'weight': 0.20},
            'hash_registry':         {'score': 85, 'weight': 0.20},
            'deepfake_ai':           {'score': 6,  'weight': 0.25},
            'watermark_validity':    {'score': 40, 'weight': 0.15},
            'gemini_vision':         {'score': 0,  'weight': 0.10},
            'file_format':           {'score': 20, 'weight': 0.05},
            'temporal_consistency':  {'score': 60, 'weight': 0.05},
        },
    },
    {
        'scan_id':                    'demo_scan_theft_002',
        'user_uid':                   ORGS['fifa']['uid'],
        'file_name':                  'messi_stolen_copy.jpg',
        'file_type':                  'image/jpeg',
        'file_size_bytes':            318_000,
        'trust_score':                32,
        'threat_level':               'HIGH',
        'content_dna_score':          31,
        'content_dna_grade':          'HIGH RISK',
        'content_dna_color':          '#ff6b35',
        'deepfake_is_fake':           False,
        'deepfake_confidence':        8.1,
        'deepfake_verdict':           'AUTHENTIC CONTENT',
        'deepfake_frames_analyzed':   1,
        'asset_match_found':          True,
        'matched_asset_id':           'demo_asset_fifa_messi_003',
        'matched_asset_name':         'FIFA World Cup Final — Messi Holds Trophy',
        'matched_owner_name':         ORGS['fifa']['name'],
        'matched_organization':       ORGS['fifa']['org'],
        'matched_sport_category':     'FIFA',
        'matched_cert_id':            'FIFA003CERT12',
        'similarity_percent':         98.5,
        'hamming_distance':           1,
        'watermark_found':            False,
        'exif_flags':                 ['EXIF_STRIPPED', 'THUMBNAIL_ABSENT'],
        'exif_risk_score':            50,
        'exif_risk_label':            'MEDIUM',
        'gemini_vision_manipulation_detected': False,
        'gemini_vision_authenticity_confidence': 71,
        'gemini_legal_report':        LEGAL_REPORT_THEFT,
        'content_dna_signals': {
            'exif_integrity':        {'score': 50, 'weight': 0.20},
            'hash_registry':         {'score': 2,  'weight': 0.20},
            'deepfake_ai':           {'score': 96, 'weight': 0.25},
            'watermark_validity':    {'score': 40, 'weight': 0.15},
            'gemini_vision':         {'score': 41, 'weight': 0.10},
            'file_format':           {'score': 90, 'weight': 0.05},
            'temporal_consistency':  {'score': 60, 'weight': 0.05},
        },
    },
    {
        'scan_id':                    'demo_scan_dual_003',
        'user_uid':                   ORGS['sai']['uid'],
        'file_name':                  'neeraj_deepfake_ad.mp4',
        'file_type':                  'video/mp4',
        'file_size_bytes':            4_800_000,
        'trust_score':                9,
        'threat_level':               'CRITICAL',
        'content_dna_score':          8,
        'content_dna_grade':          'CONFIRMED THREAT',
        'content_dna_color':          '#ff3d3d',
        'deepfake_is_fake':           True,
        'deepfake_confidence':        76.5,
        'deepfake_verdict':           'DEEPFAKE DETECTED',
        'deepfake_frames_analyzed':   16,
        'deepfake_duration_seconds':  12.4,
        'audio_sync_analyzed':        True,
        'audio_sync_score':           41.2,
        'audio_sync_suspicious':      True,
        'audio_sync_verdict':         'SYNC MISMATCH DETECTED',
        'asset_match_found':          True,
        'matched_asset_id':           'demo_asset_olympics_neeraj_005',
        'matched_asset_name':         'Olympics 2024 — Neeraj Chopra Gold Throw',
        'matched_owner_name':         ORGS['sai']['name'],
        'matched_organization':       ORGS['sai']['org'],
        'matched_sport_category':     'Olympics',
        'matched_cert_id':            'SAI005CERT12',
        'similarity_percent':         88.1,
        'hamming_distance':           8,
        'watermark_found':            False,
        'exif_flags':                 ['EXIF_STRIPPED', 'NO_CAMERA_INFO', 'SUSPICIOUS_SOFTWARE'],
        'exif_risk_score':            95,
        'exif_risk_label':            'HIGH',
        'gemini_vision_manipulation_detected': True,
        'gemini_vision_authenticity_confidence': 5,
        'gemini_legal_report':        LEGAL_REPORT_DEEPFAKE,
        'content_dna_signals': {
            'exif_integrity':        {'score': 5,  'weight': 0.20},
            'hash_registry':         {'score': 12, 'weight': 0.20},
            'deepfake_ai':           {'score': 24, 'weight': 0.25},
            'watermark_validity':    {'score': 40, 'weight': 0.15},
            'gemini_vision':         {'score': 0,  'weight': 0.10},
            'file_format':           {'score': 90, 'weight': 0.05},
            'temporal_consistency':  {'score': 60, 'weight': 0.05},
        },
    },
]


# ─────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────

def _make_png_bytes(r, g, b, width=100, height=100):
    def chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    row  = bytes([r, g, b] * width)
    raw  = b''.join(b'\x00' + row for _ in range(height))
    idat = zlib.compress(raw)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')


def _phash(data):
    return hashlib.md5(data).hexdigest()[:16]


# ─────────────────────────────────────────────────────────────────────────
# SEEDERS
# ─────────────────────────────────────────────────────────────────────────

def seed_assets(db):
    print('\n[2/7] Seeding 6 demo assets...')
    now_unix = int(time.time())
    for i, a in enumerate(DEMO_ASSETS):
        org = ORGS[a['org_key']]
        png = _make_png_bytes(*a['color'])
        sha = hashlib.sha256(png).hexdigest()
        cid = sha[:12].upper()
        ph  = _phash(png)
        db.collection('assets').document(a['asset_id']).set({
            'asset_id':                   a['asset_id'],
            'owner_uid':                  org['uid'],
            'owner_name':                 org['name'],
            'owner_email':                org['email'],
            'organization':               org['org'],
            'asset_name':                 a['asset_name'],
            'sport_category':             a['sport_category'],
            'content_type':               'image',
            'cert_id':                    cid,
            'sha256':                     sha,
            'phash':                      ph,
            'dhash':                      ph,
            'ahash':                      ph,
            'estimated_rights_value_usd': a['rights_value'],
            'registered_at_unix':         now_unix - (i * 7200),
            'total_violations':           sum(1 for v in VIOLATIONS if v['asset_idx'] == i),
            'status':                     'active',
            'exif_snapshot':              {'camera_make': 'Canon', 'camera_model': 'EOS R5'},
            'original_url':               f'https://demo.shieldcore.ai/assets/{a["asset_id"]}.png',
            'watermarked_url':            f'https://demo.shieldcore.ai/assets/{a["asset_id"]}_wm.png',
            'blockchain_timestamp': {
                'success':          True,
                'blockchain':       'Bitcoin',
                'standard':         'OpenTimestamps RFC',
                'calendar_url':     'https://alice.btc.calendar.opentimestamps.org',
                'submitted_at':     datetime.utcnow().isoformat() + 'Z',
                'sha256':           sha,
                'verification_url': f'https://alice.btc.calendar.opentimestamps.org/timestamp/{sha}',
            },
        })
        print(f'   ✓  {a["asset_name"]} | CERT: {cid}')


def seed_violations(db, rtdb):
    print('\n[3/7] Seeding 8 global violations...')
    now     = datetime.now(timezone.utc)
    now_ms  = int(time.time() * 1000)

    for v in VIOLATIONS:
        a    = DEMO_ASSETS[v['asset_idx']]
        org  = ORGS[a['org_key']]
        dt   = now - timedelta(hours=v['hours_ago'])
        dt_ms = int(dt.timestamp() * 1000)

        db.collection('violations').document(v['vid']).set({
            'violation_id':       v['vid'],
            'asset_id':           a['asset_id'],
            'asset_name':         a['asset_name'],
            'owner_name':         org['name'],
            'owner_email':        org['email'],
            'organization':       org['org'],
            'sport_category':     a['sport_category'],
            'source_url':         f'https://{v["domain"]}/stolen_{v["vid"]}.jpg',
            'source_domain':      v['domain'],
            'detection_method':   'auto_crawl',
            'detection_type':     v['type'],
            'similarity_percent': v['similarity'],
            'is_deepfake':        v['is_deepfake'],
            'deepfake_confidence':v['df_conf'],
            'exif_flags':         ['EXIF_STRIPPED'],
            'geo_lat':            v['lat'],
            'geo_lng':            v['lng'],
            'geo_city':           v['city'],
            'geo_country':        v['country'],
            'estimated_loss_usd': v['loss_usd'],
            'status':             'detected',
            'detected_at':        dt,
            'evidence_scan_id':   DEMO_SCANS[0]['scan_id'],
        })

        rtdb.child(f'violations_live/{v["vid"]}').set({
            'asset_name':         a['asset_name'],
            'owner_name':         org['name'],
            'organization':       org['org'],
            'sport_category':     a['sport_category'],
            'detection_type':     v['type'],
            'similarity_percent': v['similarity'],
            'threat_level':       v['threat'],
            'source_domain':      v['domain'],
            'geo_city':           v['city'],
            'geo_country':        v['country'],
            'detected_at':        dt_ms,
            'expires_at':         now_ms + 3_600_000,
        })

        icon = {'theft': '⚡', 'deepfake': '🤖', 'both': '🔴'}[v['type']]
        print(f'   {icon}  {v["city"]}, {v["country"]} | {v["type"].upper()} | {a["asset_name"][:40]}')


def seed_scans(db):
    print('\n[4/7] Seeding 3 demo scan records...')
    for s in DEMO_SCANS:
        db.collection('scans').document(s['scan_id']).set({
            **s,
            'scanned_at': datetime.now(timezone.utc),
            'scan_language': 'en',
        })
        threat_icon = '🔴' if s['threat_level'] == 'CRITICAL' else '🟠'
        print(f'   {threat_icon}  {s["scan_id"]} | {s["threat_level"]} | Trust: {s["trust_score"]}')


def seed_viral_alerts(rtdb):
    print('\n[5/7] Seeding viral spread alerts...')
    alerts = [
        {
            'asset_id':   'demo_asset_ipl_kohli_001',
            'asset_name': 'IPL 2024 — Kohli Century Celebration',
            'level':      'RAPID_SPREAD',
            'color':      '#f97316',
            'last_1hr':   3,
            'last_6hr':   2,
            'total':      5,
        },
        {
            'asset_id':   'demo_asset_olympics_neeraj_005',
            'asset_name': 'Olympics 2024 — Neeraj Chopra Gold Throw',
            'level':      'VIRAL_SPREAD',
            'color':      '#ef4444',
            'last_1hr':   6,
            'last_6hr':   2,
            'total':      8,
        },
    ]
    for al in alerts:
        rtdb.child(f'viral_alerts/{al["asset_id"]}').set({
            'asset_name':           al['asset_name'],
            'violations_last_hour': al['last_1hr'],
            'violations_last_6hr':  al['last_6hr'],
            'violations_total':     al['total'],
            'alert_level':          al['level'],
            'color':                al['color'],
            'is_active':            True,
            'updated_at':           int(time.time() * 1000),
        })
        print(f'   🚨  {al["asset_name"][:40]} — {al["level"]}')


def seed_dashboard_stats(rtdb):
    print('\n[6/7] Seeding dashboard stats...')
    rtdb.child('dashboard_stats').set({
        'assets_protected':           6,
        'total_scans_today':          247,
        'violations_today':           8,
        'rights_value_protected_usd': 5_400,
        'last_updated':               int(time.time() * 1000),
    })
    print('   ✓  6 assets | 247 scans | 8 violations | $5,400 rights value protected')


def print_demo_guide():
    print('\n[7/7] Demo navigation guide...')
    print("""
   DEMO FLOW (5 minutes):
   ─────────────────────────────────────────────────────────────
   1. Dashboard     → Show 247 scans, 8 violations, $5,400 protected
                       + VIRAL_SPREAD alert on Neeraj asset
   2. Register      → Upload DEMO_DATASET/athlete_filtered.jpg
                       → Show cert generation + blockchain badge
   3. Scan Content  → Upload DEMO_DATASET/synthetic_face.jpg
                       → Watch 6-step WebSocket pipeline live
                       → Show Content DNA radar chart (your secret weapon)
                       → Show DUAL THREAT / DEEPFAKE verdict banner
   4. Violations    → Show 8 global pins on map
                       → Click any violation → Generate DMCA notice
   5. Evidence      → /report/demo_scan_deepfake_001
                       → Download PDF (IT Act 2000 §65B compliant)
   6. Assets        → /assets → Click 'HUNT STOLEN COPIES' button
   ─────────────────────────────────────────────────────────────
   KEY LINE: "ShieldCoreAI is the world's first unified platform
   combining deepfake detection + IP rights tracking + blockchain
   provenance + auto-DMCA in one 7-signal AI pipeline."
    """)


# ─────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────

def main():
    print('\n🛡  ShieldCore AI — Comprehensive Demo Seeder v2')
    print('=' * 55)

    print('\n[1/7] Connecting to Firebase...')
    init_firebase()
    db   = get_firestore()
    rtdb = get_rtdb()
    print('   ✓  Firebase connected')

    seed_assets(db)
    seed_violations(db, rtdb)
    seed_scans(db)
    seed_viral_alerts(rtdb)
    seed_dashboard_stats(rtdb)
    print_demo_guide()

    print('=' * 55)
    print('✅  DEMO DATA SEEDED — 6 assets | 8 violations | 3 scans')
    print('    Open http://localhost:5173 and start the demo!\n')

if __name__ == '__main__':
    main()
