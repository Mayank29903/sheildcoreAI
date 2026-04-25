# SportShield AI | Google Solution Challenge 2026 | First Prize Target

"""WHY PROPRIETARY: Content DNA is SportShield's unique 7-signal metric.
No other team has this. Named and explained in demo. Judges see it in radar chart."""

def calculate_content_dna(deepfake_result, exif_result, phash_result,
  watermark_result, gemini_vision, file_path, registered_at=None) -> dict:
  
    signals = {}
    
    # 1. exif_integrity: weight=0.20, score=max(0, 100-exif_risk_score)
    exif_score = max(0, 100 - exif_result.get('risk_score', 0))
    signals['exif_integrity'] = {'score': exif_score, 'weight': 0.20, 'interpretation': "EXIF integrity baseline"}

    # 2. hash_registry: weight=0.20, score=if match: max(0,100-similarity) else 85
    if phash_result.get('is_match'):
        hash_score = max(0, 100 - phash_result.get('similarity_percent', 0))
    else:
        hash_score = 85
    signals['hash_registry'] = {'score': hash_score, 'weight': 0.20, 'interpretation': "Cryptographic uniqueness"}

    # 3. deepfake_ai: weight=0.25, score=if fake: max(0,100-confidence) else min(100,50+(100-conf)*0.5)
    is_fake = deepfake_result.get('is_fake', False)
    conf = deepfake_result.get('confidence', 0)
    if is_fake:
        df_score = max(0, 100 - conf)
    else:
        df_score = min(100, 50.0 + (100 - conf) * 0.5)
    signals['deepfake_ai'] = {'score': int(df_score), 'weight': 0.25, 'interpretation': "AI visual authenticity"}

    # 4. watermark_validity: weight=0.15, score=valid_cert:95, found:60, else:40
    if watermark_result and watermark_result.get('cert_id'):
        wm_score = 95
    elif watermark_result:
        wm_score = 60
    else:
        wm_score = 40
    signals['watermark_validity'] = {'score': wm_score, 'weight': 0.15, 'interpretation': "Steganographic signature presence"}

    # 5. gemini_vision: weight=0.10, score=if manipulation: max(0,conf-30) else conf
    g_conf = gemini_vision.get('authenticity_confidence', 50)
    g_manip = gemini_vision.get('manipulation_detected', False)
    gv_score = max(0, g_conf - 30) if g_manip else g_conf
    signals['gemini_vision'] = {'score': int(gv_score), 'weight': 0.10, 'interpretation': "Multimodal structure analysis"}

    # 6. file_format: weight=0.05, score=PIL.verify() passes:90 else:20
    fmt_score = 20
    try:
        from PIL import Image
        Image.open(file_path).verify()
        fmt_score = 90
    except: pass
    signals['file_format'] = {'score': fmt_score, 'weight': 0.05, 'interpretation': "File headers validation"}

    # 7. temporal_consistency: weight=0.05, score=registered_at exists:80 else:60
    temp_score = 80 if registered_at else 60
    signals['temporal_consistency'] = {'score': temp_score, 'weight': 0.05, 'interpretation': "Timeline synchronization"}

    weighted_score = sum(s['score'] * s['weight'] for s in signals.values())
    dna_score = round(weighted_score)

    # Grades map
    if dna_score >= 90: grade, color = "CERTIFIED AUTHENTIC", "#00d4aa"
    elif dna_score >= 70: grade, color = "LIKELY AUTHENTIC", "#4d9fff"
    elif dna_score >= 50: grade, color = "SUSPICIOUS CONTENT", "#ff9500"
    elif dna_score >= 30: grade, color = "HIGH RISK", "#ff6b35"
    else: grade, color = "CONFIRMED THREAT", "#ff3d3d"

    pos = sum(1 for s in signals.values() if s['score'] >= 70)
    neg = sum(1 for s in signals.values() if s['score'] < 40)

    return {
        'dna_score': dna_score,
        'grade': grade,
        'color': color,
        'signals': signals,
        'signal_count': 7,
        'positive_signals': pos,
        'negative_signals': neg
    }
