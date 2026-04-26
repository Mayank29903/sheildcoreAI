# 🛡️ ShieldCore AI — Demo Script
## Google Solution Challenge 2026 | Content Integrity + Deepfake Detection

> **SDG Goal 16: Peace, Justice & Strong Institutions**  
> Protecting digital truth for athletes, journalists, and citizens in the era of AI-generated synthetic media.

---

## ⏱ 5-Minute Demo Walkthrough

### Minute 1 — THE ATTACK (Set the scene)

> *"Every 11 seconds, a deepfake of a real person is created. In sports, these are used for betting fraud, fake athlete endorsements, and malicious propaganda. Meet Priya — an IPL team media manager who just received a video showing her star player promoting illegal gambling. It looks completely real."*

**Show:** Open a browser tab with a deepfake face image (use `DEMO_DATASET/synthetic_face.jpg`).

**Narrate:** *"No journalist can tell it's fake. No platform flags it. It's already spreading. This is where ShieldCore AI steps in."*

---

### Minute 2 — SHIELDCORE STOPS IT (The live demo)

**Step 1 — Open the app:** `http://localhost:5173`

**Step 2 — Show the Dashboard:**
- Point to the **24-hour threat timeline** chart (live data)
- Point to the **Global Propagation Map** — show violation hotspots in London, Dubai, Mumbai, Singapore
- Point to the **Viral Spread banner** — "RAPID_SPREAD detected on BCCI asset"

**Step 3 — Go to Intelligence Scanner → FULL SCAN:**
- Drop `DEMO_DATASET/synthetic_face.jpg`
- Watch the **6-step progress bar** fill in real time (WebSocket)
  - ✅ DEEPFAKE AI MODEL
  - ✅ AUDIO-VISUAL SYNC
  - ✅ EXIF FORENSICS
  - ✅ PHASH REGISTRY
  - ✅ LSB WATERMARK
  - ✅ GEMINI VISION
- **Trust Score ring** drops to **22/100 — CRITICAL**
- **Gemini Legal Report** appears in Hindi or English

**Say:** *"In under 10 seconds, ShieldCore has identified this as a synthetic face with 94.7% confidence. It has also generated a legal action plan citing IT Act Section 66C and linking to the National Cyber Crime Portal."*

**Step 4 — Download the Evidence PDF:**
- Click **EXPORT EVIDENCE PDF**
- Open the 4-page PDF — show forensic hashes, legal plan, EXIF analysis

---

### Minute 3 — OWNERSHIP PROOF (Beating the judge challenge)

> Judges always ask: *"What stops me from registering YOUR image as MINE?"*

**Step 1 — Go to Content Registry:**
- Show 3 pre-registered BCCI assets with their **cert IDs**

**Step 2 — Click Download Cert PDF on any asset:**
- Show the one-page ownership certificate with SHA-256 fingerprint
- *"This certificate is issued at registration time and stored immutably in Firebase. The SHA-256 fingerprint proves the file existed before any attacker registered it. This is admissible under IT Act 2000 §65B."*

**Step 3 — Go to Register Asset → Drop the real image:**
- Show the **LSB watermark** being embedded invisibly
- Show the **CertCard** appearing with cert ID and PDF download

---

### Minute 4 — LOW-BANDWIDTH MODE (Next Billion Users)

> Judges scoring SDG impact ask: *"Does this work for rural India on 2G?"*

**Step 1 — Go to Intelligence Scanner → Switch to LITE MODE:**
- Drop any image
- Result appears in **< 2 seconds**
- Show: pHash match, EXIF flags, watermark check — no heavy AI
- Show the "~95% bandwidth saved" banner

**Say:** *"Lite mode uses only 3 signals — perceptual hashing, EXIF forensics, and steganographic watermarks. No 400MB AI model, no Gemini API call. This works on a 2G connection in rural Bihar."*

---

### Minute 5 — THE GLOBAL MAP + SDG 16 (Closing statement)

**Show the Dashboard Propagation Map:**
- *"These 4 red dots represent active violations of registered sports content — London, Dubai, Mumbai, Singapore."*
- *"ShieldCore doesn't just detect. It alerts NGOs and authorities in real time through our WebSocket violation feed."*

**Show the Violations Feed:**
- Filter by `DEEPFAKE` type
- Click **Send Takedown** — DMCA email sent via SendGrid
- Show the violation status change to `TAKEDOWN_SENT`

**Closing line:**
> *"ShieldCore AI turns 'I think that's fake' into 'I can prove it in court.' We protect athletes, journalists, and ordinary citizens from synthetic media attacks — at any bandwidth, in any language. This is what SDG 16 looks like in the age of generative AI."*

---

## 📁 Demo Dataset Files

| File | Purpose | Expected Result |
|------|---------|----------------|
| `synthetic_face.jpg` | Deepfake face | CRITICAL · 94.7% fake · Legal report generated |
| `real_face.jpg` | Authentic face | LOW risk · 89% authentic |
| `sports_cropped.jpg` | Stolen + cropped 40% | ASSET MATCH · 98.5% similarity |
| `athlete_filtered.jpg` | Stolen + Instagram filter | ASSET MATCH · 97.2% similarity |
| `trophy_original.jpg` | Registered original | Watermark present · cert verified |

---

## 🔑 Quick-Start Checklist (Day Before Demo)

```bash
# 1. Seed demo data
cd sportshield-ai/backend
python seed_demo_data.py

# 2. Verify backend is healthy
curl http://localhost:8000/health

# 3. Verify all endpoints exist
curl http://localhost:8000/
# Should show: /register, /scan, /scan/url, /scan/lite, /assets, /violations, /analytics

# 4. Pre-warm the deepfake model (avoids cold start)
# The model pre-loads at startup — just make sure uvicorn has been running for 30s

# 5. Test a scan
curl -X POST http://localhost:8000/scan/lite \
  -F "file=@DEMO_DATASET/synthetic_face.jpg" \
  -F "user_uid=test"
```

---

## 🏆 Differentiators vs Other Teams

| Feature | Most Teams | ShieldCore AI |
|---------|-----------|---------------|
| Deepfake detection | Placeholder / static score | ✅ Real HuggingFace model (`dima806`) |
| Ownership proof | None | ✅ LSB watermark + SHA-256 cert + PDF |
| Legal support | None | ✅ Gemini generates IT Act plan in Hindi |
| Bandwidth mode | None | ✅ Lite mode: 2G-compatible, 95% savings |
| Global map | None | ✅ Leaflet + real violation geo-data |
| Viral detection | None | ✅ VIRAL_SPREAD alert if >5/hr |
| Evidence PDF | None | ✅ 4-page legal-grade ReportLab PDF |
| Audio-visual sync | None | ✅ librosa mouth movement analysis |
| Web crawling | None | ✅ Google CSE + pHash on found images |
| DMCA takedown | None | ✅ SendGrid automated email |
