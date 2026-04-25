# ShieldCoreAI - Master Setup Prompt

Copy this entire prompt and paste it into another AI assistant when you want instant project-aware help.

---

```text
You are helping me fix and run my project called ShieldCoreAI (also called SportShield AI).
It is a sports media rights protection platform built with FastAPI (Python backend) + React/Vite (frontend) + Firebase + Gemini AI.

Here is my complete project structure:
- sportshield-ai/backend/main.py                    -> FastAPI app entry point
- sportshield-ai/backend/config/firebase.py         -> Firebase Admin SDK init, Firestore, Storage, RTDB
- sportshield-ai/backend/config/settings.py         -> All env vars loaded via python-dotenv
- sportshield-ai/backend/routes/scan.py             -> POST /scan/ endpoint - uploads file, runs AI pipeline
- sportshield-ai/backend/routes/register.py         -> POST /register/ - registers asset, embeds watermark
- sportshield-ai/backend/routes/violations.py       -> GET /violations/ - lists violations from Firestore
- sportshield-ai/backend/routes/analytics.py        -> GET /analytics/ - dashboard stats from RTDB
- sportshield-ai/backend/models/deepfake.py         -> HuggingFace pipeline: dima806/deepfake_vs_real_image_detection
- sportshield-ai/backend/models/phash.py            -> Triple pHash (phash+dhash+ahash) + Firestore registry compare
- sportshield-ai/backend/models/watermark.py        -> LSB steganography watermark embed/extract
- sportshield-ai/backend/models/exif_forensics.py   -> piexif EXIF metadata forensics
- sportshield-ai/backend/models/audio_sync.py       -> OpenCV Haar cascade lip sync detection
- sportshield-ai/backend/services/gemini.py         -> Gemini 1.5 Flash vision analysis + legal report generation
- sportshield-ai/backend/services/scheduler.py      -> APScheduler viral spread detection
- sportshield-ai/backend/services/content_dna.py    -> Content fingerprinting
- sportshield-ai/backend/seed_demo_data.py          -> Seeds Firestore+RTDB with demo violations
- sportshield-ai/frontend/src/lib/firebase.js       -> Frontend Firebase init (reads VITE_ env vars)
- sportshield-ai/frontend/src/lib/api.js            -> Axios client pointing to VITE_API_URL
- sportshield-ai/frontend/src/hooks/useScanProgress.js -> WebSocket + polling fallback for scan progress
- sportshield-ai/frontend/src/pages/Landing.jsx     -> Login page with Google Auth
- sportshield-ai/frontend/src/pages/ScanContent.jsx -> Upload + real-time scan progress UI
- sportshield-ai/frontend/src/pages/Dashboard.jsx   -> Stats dashboard
- sportshield-ai/frontend/src/pages/ViolationsFeed.jsx -> Live violations feed
- sportshield-ai/frontend/src/pages/RegisterAsset.jsx  -> Asset registration form
- sportshield-ai/frontend/src/components/features/ScanResults.jsx -> Full scan result display
- sportshield-ai/frontend/src/components/features/UploadZone.jsx  -> Drag-drop file upload
- sportshield-ai/frontend/src/components/features/GeminiReport.jsx -> Legal report display

MY CURRENT ERRORS (from python main.py logs):
1. "PyTorch unavailable: WinError 126 shm.dll not found" -> deepfake model disabled
2. "Scheduled viral check failed: 403 Cloud Firestore API has not been used" -> Firestore not enabled
3. "404 POST storage.googleapis.com - The specified bucket does not exist" -> Storage not created
4. "500 Internal Server Error on POST /scan/" -> upload_to_storage() called synchronously before background task

MY TECH STACK:
- Python 3.12, FastAPI 0.111, Uvicorn, Windows 11
- Firebase Admin SDK 6.5 (Firestore, Realtime Database, Cloud Storage)
- google-generativeai 0.7.2 (Gemini 1.5 Flash)
- HuggingFace transformers 4.41.2 + torch 2.3.0
- React 18 + Vite, axios, react-router-dom, react-hot-toast
- Firebase JS SDK v9+ (modular)

MY FIREBASE PROJECT:
- Project ID: sheildcoreai
- Storage bucket: sheildcoreai.appspot.com
- RTDB URL: https://sheildcoreai-default-rtdb.firebaseio.com

WHAT I HAVE:
- All API keys (Gemini, Firebase)
- Firebase service account JSON downloaded
- All source code written
- Both .env.example files exist

WHAT I NEED TO DO (in order):

STEP 1 - Firebase Console Setup (console.firebase.google.com -> project sheildcoreai):
  a. Authentication -> Sign-in method -> Google -> Enable -> Add localhost to authorized domains
  b. Firestore Database -> Create database -> Test mode -> Region: asia-south1
  c. Storage -> Get Started -> Test mode -> Region: asia-south1
  d. Realtime Database -> Create database -> Test mode

STEP 2 - Set Storage Rules (Firebase Console -> Storage -> Rules):
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} { allow read, write: if true; }
    }
  }

STEP 3 - Set Firestore Rules (Firebase Console -> Firestore -> Rules):
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} { allow read, write: if true; }
    }
  }

STEP 4 - Create backend/.env file:
  GEMINI_API_KEY=<from aistudio.google.com>
  FIREBASE_PROJECT_ID=sheildcoreai
  FIREBASE_CREDENTIALS_JSON=./serviceAccountKey.json
  GOOGLE_CSE_KEY=
  GOOGLE_CSE_CX=
  SENDGRID_API_KEY=
  SENDGRID_FROM_EMAIL=
  DEMO_MODE=true
  PORT=8000

STEP 5 - Create frontend/.env file:
  VITE_API_URL=http://localhost:8000
  VITE_FIREBASE_API_KEY=<from Firebase Console -> Project Settings -> Web App Config>
  VITE_FIREBASE_AUTH_DOMAIN=sheildcoreai.firebaseapp.com
  VITE_FIREBASE_DATABASE_URL=https://sheildcoreai-default-rtdb.firebaseio.com
  VITE_FIREBASE_PROJECT_ID=sheildcoreai
  VITE_FIREBASE_STORAGE_BUCKET=sheildcoreai.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=<from Firebase Console>
  VITE_FIREBASE_APP_ID=<from Firebase Console>

STEP 6 - Fix PyTorch on Windows (run in backend folder):
  pip uninstall torch torchvision -y
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

STEP 7 - Fix the critical crash in routes/scan.py:
  The bug: upload_to_storage() is called on line ~73 BEFORE background_tasks.add_task()
  This crashes the entire /scan/ endpoint if Firebase Storage is slow or down.
  Fix: Move upload_to_storage() call INSIDE _process_scan() function, at the very top,
  wrapped in try/except so a storage failure doesn't kill the whole scan.

STEP 8 - Download deepfake model cache (run once, takes 5-10 min):
  cd sportshield-ai/backend
  python -c "from transformers import pipeline; pipeline('image-classification', model='dima806/deepfake_vs_real_image_detection')"

STEP 9 - Seed Firebase with demo data:
  cd sportshield-ai/backend
  python seed_demo_data.py

STEP 10 - Start everything:
  Terminal 1: cd sportshield-ai/backend && python main.py
  Terminal 2: cd sportshield-ai/frontend && npm install && npm run dev

HOW THE AI/TRAINED MODELS WORK IN MY PROJECT:

1. DEEPFAKE MODEL (HuggingFace - auto-downloads, no training needed):
   - Model: dima806/deepfake_vs_real_image_detection
   - Type: EfficientNet image classifier, trained on FaceForensics++ dataset
   - How it loads: transformers.pipeline('image-classification', model=MODEL_ID)
   - Returns: {is_fake: bool, confidence: float, verdict: str, risk_label: str}
   - To swap with YOUR OWN .pt model: change MODEL_ID to local path, load with torch.load()

2. GEMINI AI (API call - no training needed, just API key):
   - Used for: vision analysis of uploaded images, legal report generation
   - File: backend/services/gemini.py
   - Requires: GEMINI_API_KEY in .env
   - Get key free: aistudio.google.com

3. pHASH REGISTRY (no ML, pure math - works dynamically):
   - Computes perceptual hash of uploaded image
   - Compares against ALL assets in Firestore using Hamming distance
   - Threshold: 10 bits (HAMMING_THRESHOLD in settings.py)
   - No training needed - works on whatever users register

4. OPENCV HAAR CASCADE (bundled with pip install opencv-python-headless):
   - Used in audio_sync.py for face detection
   - Auto-included, zero setup needed

THE SYSTEM IS FULLY DYNAMIC - no pre-downloaded images or datasets needed.
Users register their own assets. Users upload content to scan.
The AI analyzes whatever is uploaded in real time.

KNOWN ISSUE - urllib3 version conflict warning:
  Fix: add to requirements.txt:
  urllib3==1.26.18
  chardet==4.0.0

If I give you a specific file to fix, here is the full context above so you understand
the entire system before making any changes.
```
