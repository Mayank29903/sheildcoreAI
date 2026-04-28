# ShieldCoreAI | Google Solution Challenge 2026
"""
Video Perceptual Fingerprinting.
WHY: Stolen sports clips are re-encoded. pHash per keyframe creates a
robust fingerprint sequence that survives transcoding, cropping, and watermarks.
Strategy: Sample 8 keyframes via linspace, generate pHash per frame,
store as comma-separated string in Firestore.
"""

import os
import logging
import tempfile
import numpy as np
import imagehash
from PIL import Image

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

logger = logging.getLogger(__name__)
KEYFRAME_COUNT = 8


def generate_video_fingerprint(video_path: str) -> dict:
    """
    Generate a perceptual fingerprint sequence for a video file.
    Returns a dict with frame_hashes (list), fingerprint_string, and frame_count.
    """
    if not CV2_AVAILABLE:
        return {
            'success': False,
            'error': 'OpenCV not available',
            'frame_hashes': [],
            'fingerprint_string': ''
        }

    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {
                'success': False,
                'error': 'Could not open video',
                'frame_hashes': [],
                'fingerprint_string': ''
            }

        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total <= 0:
            cap.release()
            return {
                'success': False,
                'error': 'No frames',
                'frame_hashes': [],
                'fingerprint_string': ''
            }

        indices = np.linspace(0, total - 1, min(KEYFRAME_COUNT, total), dtype=int)
        frame_hashes = []
        tmp_dir = tempfile.gettempdir()

        for idx in indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
            ret, frame = cap.read()
            if not ret:
                continue
            tmp_path = os.path.join(tmp_dir, f'vfp_{idx}.jpg')
            cv2.imwrite(tmp_path, frame)
            try:
                img = Image.open(tmp_path).convert('RGB')
                h = str(imagehash.phash(img))
                frame_hashes.append(h)
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)

        cap.release()
        fingerprint_string = ','.join(frame_hashes)

        return {
            'success': True,
            'frame_hashes': frame_hashes,
            'fingerprint_string': fingerprint_string,
            'frame_count': len(frame_hashes),
            'total_frames_analyzed': total
        }
    except Exception as e:
        logger.error(f'video_phash failed: {e}')
        return {
            'success': False,
            'error': str(e),
            'frame_hashes': [],
            'fingerprint_string': ''
        }


def compare_video_fingerprints(stored_fp: str, incoming_fp: str, threshold: int = 10) -> dict:
    """
    Compare two video fingerprint strings (comma-separated pHash sequences).
    Returns similarity score and match verdict.
    Uses minimum Hamming distance across cross-pairs of frames.
    """
    stored = [imagehash.hex_to_hash(h) for h in stored_fp.split(',') if h]
    incoming = [imagehash.hex_to_hash(h) for h in incoming_fp.split(',') if h]

    if not stored or not incoming:
        return {'is_match': False, 'similarity_percent': 0.0, 'min_hamming': None}

    distances = []
    for sh in stored:
        for ih in incoming:
            distances.append(sh - ih)

    min_dist = min(distances)
    avg_dist = sum(distances) / len(distances)
    similarity = max(0.0, (64 - avg_dist) / 64 * 100)

    return {
        'is_match': min_dist <= threshold,
        'similarity_percent': round(similarity, 2),
        'min_hamming': min_dist,
        'avg_hamming': round(avg_dist, 2)
    }
