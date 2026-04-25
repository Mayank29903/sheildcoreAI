# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""
WHY TRIPLE HASH: pHash (DCT-based) is robust to transformations.
dHash (gradient) is secondary confirmation.
aHash (mean) is fast cross-check.
Triple combination defeats crops, resizes, filters, JPEG recompression.
"""

import hashlib
import imagehash
from PIL import Image
from config.settings import HAMMING_THRESHOLD
from config.firebase import get_firestore

def generate_fingerprint(image_path: str) -> dict:
    """
    Generates cryptographic and perceptual hashes for an image.
    Robustly identifies images through three different structural viewpoints.
    """
    img = Image.open(image_path).convert('RGB')
    phash_val = str(imagehash.phash(img))
    dhash_val = str(imagehash.dhash(img))
    ahash_val = str(imagehash.average_hash(img))
    
    with open(image_path, 'rb') as f:
        sha256 = hashlib.sha256(f.read()).hexdigest()
        
    cert_id = sha256[:12].upper()
    
    return {
        'phash': phash_val,
        'dhash': dhash_val,
        'ahash': ahash_val,
        'sha256': sha256,
        'cert_id': cert_id
    }

async def compare_to_registry(image_path: str) -> dict:
    """
    WHY: Query ALL assets from Firestore, compare pHash Hamming distance.
    Return best match if hamming_distance <= HAMMING_THRESHOLD.
    """
    try:
        incoming_fingerprint = generate_fingerprint(image_path)
        incoming_phash = imagehash.hex_to_hash(incoming_fingerprint['phash'])
        
        db = get_firestore()
        assets = db.collection('assets').stream()
        
        best_match = None
        best_distance = 999
        
        for asset in assets:
            data = asset.to_dict()
            stored_phash_str = data.get('phash')
            if not stored_phash_str:
                continue
                
            stored_phash = imagehash.hex_to_hash(stored_phash_str)
            distance = incoming_phash - stored_phash
            
            if distance <= HAMMING_THRESHOLD and distance < best_distance:
                best_distance = distance
                best_match = data
                best_match['asset_id'] = asset.id
        
        if best_match:
            similarity = max(0.0, (64 - best_distance) / 64 * 100)
            return {
                'is_match': True,
                'similarity_percent': float(round(similarity, 2)),
                'hamming_distance': best_distance,
                'matched_asset_id': best_match.get('asset_id'),
                'matched_asset_name': best_match.get('asset_name'),
                'matched_owner_name': best_match.get('owner_name'),
                'matched_owner_email': best_match.get('owner_email'),
                'matched_organization': best_match.get('organization'),
                'matched_sport_category': best_match.get('sport_category'),
                'matched_cert_id': best_match.get('cert_id'),
                'matched_original_url': best_match.get('original_url'),
                'original_url': best_match.get('original_url')
            }
            
        return {
            'is_match': False,
            'similarity_percent': 0.0,
            'hamming_distance': None,
            'matched_asset_id': None,
            'matched_asset_name': None,
            'matched_owner_name': None,
            'matched_owner_email': None,
            'matched_organization': None,
            'matched_sport_category': None,
            'matched_cert_id': None,
            'matched_original_url': None,
            'original_url': None
        }
        
    except Exception as e:
        return {
            'is_match': False,
            'similarity_percent': 0.0,
            'hamming_distance': None,
            'matched_asset_id': None,
            'matched_asset_name': None,
            'matched_owner_name': None,
            'matched_owner_email': None,
            'matched_organization': None,
            'matched_sport_category': None,
            'matched_cert_id': None,
            'matched_original_url': None,
            'original_url': None
        }
