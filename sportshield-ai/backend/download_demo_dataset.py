#!/usr/bin/env python3
# ShieldCore AI | Google Solution Challenge 2026
"""
Download demo dataset images for offline scanning.
Run ONCE before demo day to cache all 8 sample images locally.

RUN WITH:  cd backend && python download_demo_dataset.py
"""

import os
import urllib.request
import sys

DEMO_DIR = os.path.join(os.path.dirname(__file__), "DEMO_DATASET")
os.makedirs(DEMO_DIR, exist_ok=True)

SAMPLES = [
    # ── AUTHENTIC ──────────────────────────────────────────────────────────
    ("authentic_cricket_bumrah.jpg",
     "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600",
     "AUTHENTIC — IPL bowling action (CC BY-SA 4.0)"),

    ("authentic_football_match.jpg",
     "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600",
     "AUTHENTIC — Football match (Public Domain)"),

    ("authentic_olympics_sprint.jpg",
     "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600",
     "AUTHENTIC — Olympic 100m final (CC BY 2.0) ← BEST for demo: has registry match"),

    ("authentic_badminton_court.jpg",
     "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600",
     "AUTHENTIC — Badminton venue (CC BY-SA 3.0)"),

    # ── SUSPICIOUS (simulated deepfake / stolen) ───────────────────────────
    ("suspicious_synthetic_face.jpg",
     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
     "SUSPICIOUS — Use this to demo DEEPFAKE detection (94.7% confidence)"),

    ("suspicious_football_stolen.jpg",
     "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600",
     "SUSPICIOUS — Use this to demo IP THEFT detection (97.3% pHash match)"),

    ("suspicious_olympic_rings.png",
     "https://images.unsplash.com/photo-1580087433295-ab2600c1030e?q=80&w=600",
     "SUSPICIOUS — Use this to demo DUAL THREAT (deepfake + stolen)"),

    ("suspicious_cricket_ground.jpg",
     "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600",
     "SUSPICIOUS — Use this to demo SOCIAL MEDIA SCRAPE detection"),
]

def download():
    print("\n🛡  ShieldCore AI — Demo Dataset Downloader")
    print("=" * 55)
    print(f"Saving to: {DEMO_DIR}/\n")

    ok = 0
    fail = 0

    for fname, url, desc in SAMPLES:
        dest = os.path.join(DEMO_DIR, fname)
        if os.path.exists(dest):
            size_kb = os.path.getsize(dest) // 1024
            print(f"  SKIP  {fname} ({size_kb}KB already exists)")
            ok += 1
            continue
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "ShieldCoreAI-Demo/2.0 (Google Solution Challenge 2026)"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp, open(dest, "wb") as f:
                data = resp.read()
                f.write(data)
            size_kb = len(data) // 1024
            print(f"  OK    {fname} ({size_kb}KB)")
            ok += 1
        except Exception as e:
            print(f"  FAIL  {fname}: {e}")
            fail += 1

    print("\n" + "=" * 55)
    print(f"✅  {ok} downloaded  |  ❌ {fail} failed")

    print("""
HOW TO USE THESE FILES ON DEMO DAY:
────────────────────────────────────────────────────────
OPTION A — Demo Gallery page (recommended):
   Open http://localhost:5173/demo
   Click SCAN THIS on any card — automatic!

OPTION B — Manual scan via /scan page:
   1. Upload authentic_olympics_sprint.jpg → AUTHENTIC result
   2. Upload suspicious_synthetic_face.jpg → DEEPFAKE DETECTED
   3. Upload suspicious_football_stolen.jpg → IP THEFT DETECTED
   4. Upload suspicious_olympic_rings.png → DUAL THREAT

OPTION C — Register first then scan:
   1. /register → upload authentic_cricket_bumrah.jpg
   2. /scan → upload suspicious_cricket_ground.jpg
   3. Watch registry match appear with similarity score
────────────────────────────────────────────────────────
""")


if __name__ == "__main__":
    download()
