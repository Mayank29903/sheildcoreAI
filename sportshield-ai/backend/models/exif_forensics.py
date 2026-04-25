# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""
WHY: THE SECRET WEAPON. Zero other teams have EXIF forensics.
Professional sports cameras ALWAYS embed EXIF. Stolen copies almost NEVER do.
EXIF analysis per ISO 12234-2 metadata standards.
"""

import os
import piexif
from datetime import datetime

SUSPICIOUS_SOFTWARE_KEYWORDS = [
    'telegram','whatsapp','instagram','tiktok','facebook','twitter',
    'scrapy','curl','wget','python-requests','urllib','httpx',
    'requests','android','iphone','samsung','xiaomi'
]

def analyze_exif(image_path: str) -> dict:
    """
    Extracts and scores metadata to flag social media strips, scrapers, and resaves.
    """
    flags = []
    risk_score = 0
    exif_data = {
        'camera_make': None,
        'camera_model': None,
        'captured_at': None,
        'gps_present': False,
        'software': None
    }

    try:
        # Step 1: Attempt to load EXIF
        try:
            exif_dict = piexif.load(image_path)
            
            if not any(exif_dict.values()):
                flags.append('EXIF_STRIPPED')
                risk_score += 40
        except Exception:
            flags.append('EXIF_PARSE_ERROR')
            risk_score += 15
            exif_dict = None

        if exif_dict is not None:
            # Step 2: '0th' IFD processing
            if "0th" in exif_dict and isinstance(exif_dict["0th"], dict) and exif_dict["0th"]:
                make = exif_dict["0th"].get(piexif.ImageIFD.Make, b'')
                model = exif_dict["0th"].get(piexif.ImageIFD.Model, b'')
                software = exif_dict["0th"].get(piexif.ImageIFD.Software, b'')
                
                exif_data['camera_make'] = make.decode('utf-8', 'ignore').strip() if isinstance(make, bytes) else str(make).strip()
                exif_data['camera_model'] = model.decode('utf-8', 'ignore').strip() if isinstance(model, bytes) else str(model).strip()
                exif_data['software'] = software.decode('utf-8', 'ignore').strip() if isinstance(software, bytes) else str(software).strip()
                exif_data['gps_present'] = bool(exif_dict.get('GPS'))

                if not exif_data['camera_make'] and not exif_data['camera_model']:
                    flags.append('NO_CAMERA_INFO')
                    risk_score += 15
                    
                if exif_data['software']:
                    sw_lower = exif_data['software'].lower()
                    if any(kw in sw_lower for kw in SUSPICIOUS_SOFTWARE_KEYWORDS):
                        flags.append('SUSPICIOUS_SOFTWARE')
                        risk_score += 35

            else:
                flags.append('EXIF_STRIPPED')
                risk_score += 40

            # Step 3 & 5: 'Exif' IFD Date Processing & Resave checks
            captured_at_dt = None
            if "Exif" in exif_dict and isinstance(exif_dict["Exif"], dict):
                captured_at_raw = exif_dict["Exif"].get(piexif.ExifIFD.DateTimeOriginal, b'')
                captured_at_str = captured_at_raw.decode('utf-8', 'ignore').strip() if isinstance(captured_at_raw, bytes) else str(captured_at_raw).strip()
                exif_data['captured_at'] = captured_at_str if captured_at_str else None
                
                if captured_at_str:
                    try:
                        captured_at_dt = datetime.strptime(captured_at_str, "%Y:%m:%d %H:%M:%S")
                    except ValueError:
                        pass
            
            # Step 4: Thumbnail check
            if not exif_dict.get('thumbnail'):
                flags.append('THUMBNAIL_ABSENT')
                risk_score += 10

            # File mtime comparison
            file_mtime = os.path.getmtime(image_path)
            file_mtime_dt = datetime.fromtimestamp(file_mtime)
            
            if captured_at_dt:
                delta = file_mtime_dt - captured_at_dt
                if delta.days > 30:
                    flags.append('RESAVE_DETECTED')
                    risk_score += 20

    except Exception:
        # Failsafe execution policy; never raise
        flags = ['EXIF_PARSE_ERROR']
        risk_score = 15

    # Step 6: Risk Categorization and Clamping
    risk_score = max(0, min(100, risk_score))

    if risk_score >= 60:
        risk_label = 'HIGH'
    elif risk_score >= 30:
        risk_label = 'MEDIUM'
    else:
        risk_label = 'LOW'

    # Step 7
    if not flags:
        flags.append('EXIF_CLEAN')
        risk_score = 0

    return {
        'flags': sorted(list(set(flags))),
        'risk_score': risk_score,
        'risk_label': risk_label,
        'exif_data': exif_data,
        'summary': f"{len(flags) if 'EXIF_CLEAN' not in flags else 0} forensic signals detected"
    }
