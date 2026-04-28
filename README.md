# ShieldCoreAI - Complete Setup & Demo Guide

Everything needed to make `sportshield-ai` work from zero for the Google Solution Challenge 2026.

---

## Part 1 - Firebase Console Setup

Go to: https://console.firebase.google.com

Select your project: `sheildcoreai`

### 1. Enable Google Authentication
- Authentication -> Sign-in method -> Google -> Enable -> Save
- Authentication -> Settings -> Authorized domains -> Add `localhost`

### 2. Create Firestore Database
- Firestore Database -> Create database
- Choose `Start in test mode`
- Region: `asia-southeast1` (or your preferred region)
This enables the Firestore API.

### 3. Create Storage Bucket
- Storage -> Get Started
- Choose `Start in test mode`
- Check your bucket URL in the Firebase Console (e.g., `sheildcoreai.firebasestorage.app`)

### 4. Enable Realtime Database
- Realtime Database -> Create database
- Choose `Test mode`
- Region: `asia-southeast1`
- Expected URL format: `https://sheildcoreai-default-rtdb.asia-southeast1.firebasedatabase.app`

### 5. Download Service Account Key
- Project Settings -> Service Accounts -> Generate new private key
- Download the JSON and rename it to `serviceAccountKey.json`
- Put it in `sportshield-ai/backend/`

### 6. Get Web App Config
- Project Settings -> General -> Your apps
- Copy the values from the `Config` view for the frontend `.env`.

---

## Part 2 - Create Your Env Files

### `sportshield-ai/backend/.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=sheildcoreai
FIREBASE_CREDENTIALS_JSON=./serviceAccountKey.json
FIREBASE_DATABASE_URL=https://sheildcoreai-default-rtdb.asia-southeast1.firebasedatabase.app
FIREBASE_STORAGE_BUCKET=sheildcoreai.firebasestorage.app
GOOGLE_CSE_KEY=
GOOGLE_CSE_CX=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
DEMO_MODE=true
PORT=8000
```
*(Get Gemini API key from https://aistudio.google.com)*

### `sportshield-ai/frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=paste_from_firebase_console
VITE_FIREBASE_AUTH_DOMAIN=sheildcoreai.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://sheildcoreai-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=sheildcoreai
VITE_FIREBASE_STORAGE_BUCKET=sheildcoreai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=paste_from_firebase_console
VITE_FIREBASE_APP_ID=paste_from_firebase_console
```

---

## Part 3 - Firebase Rules For Local Testing

### Storage Rules
```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore Rules
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
These rules are only appropriate for local testing and demos.

---

## Part 4 - Critical Backend Fix (Historical)

The scan route should not upload to Storage before returning the initial response.
This repo already includes that fix in: `sportshield-ai/backend/routes/scan.py`

Behavior now:
- the API returns `scan_id` immediately
- file upload happens inside the background scan task
- scan processing continues even if Storage upload fails

---

## Part 5 - Fix PyTorch On Windows

If Torch is broken on Windows, reinstall the CPU wheels:

```bash
cd sportshield-ai/backend
pip uninstall torch torchvision -y
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

If Torch still fails, the backend will continue running and deepfake detection will stay disabled until the dependency issue is resolved.

---

## Part 6 - Run The Project & Demo Preparation

### Terminal 1 - Backend

```bash
cd sportshield-ai/backend
pip install -r requirements.txt
python main.py
```
*(Note: Windows users might see Uvicorn hot-reload issues. `reload=False` has been set in `main.py` to prevent crashes. Stop and start the server manually after file changes.)*

Expected backend log highlights:
- `Firebase Admin Initialized Successfully`
- either deepfake model loaded, or deepfake skipped with a warning

### Terminal 2 - Seed Demo Data

To fully prepare the Judge Demo Gallery, you must seed the database and cache the demo files:

```bash
cd sportshield-ai/backend
# 1. Download offline images for the demo gallery
python download_demo_dataset.py

# 2. Seed database with authentic organizations, global violations, and demo scans
python seed_demo_data.py
```

### Terminal 3 - Frontend

```bash
cd sportshield-ai/frontend
npm install
npm run dev
```

Open your browser to: `http://localhost:5173`

---

## Part 7 - The 5-Minute Judge Demo Flow

We highly recommend using the newly created **Demo Gallery** (`/demo`) for the live presentation to ensure a seamless, error-free demonstration.

1. **Dashboard** → Show active tracking, 247 global scans, and $5,400 protected rights value.
2. **Demo Gallery (/demo)** → Click `SCAN THIS` on the **Authentic Olympic Sprint** to show a 7-step verified pipeline (watermark + registry match).
3. **Demo Gallery (/demo)** → Click `SCAN THIS` on the **Synthetic Deepfake** to show 94% threat detection and EXIF stripping analysis.
4. **Demo Gallery (/demo)** → Click `SCAN THIS` on the **Dual Threat** to show deepfake + IP theft detection simultaneously.
5. **Violations Feed** → Show global threat map, click on any violation, and generate an automated legal DMCA takedown notice via Gemini.

---

## Part 8 - Deepfake Model Integration

The project already supports a Hugging Face model in:
`sportshield-ai/backend/models/deepfake.py`

Current default:
```python
MODEL_ID = 'dima806/deepfake_vs_real_image_detection'
```

### Option A - Use Your Hugging Face Model
Change:
```python
MODEL_ID = 'your-username/your-model-name'
```

### Option B - Use Your Local PyTorch `.pt` Or `.pth` Model
Replace `models/deepfake.py` with a local-model implementation and point `MODEL_PATH` to your file in `backend/models/`.

### Option C - Use Your Keras `.h5` Model
Load the model with TensorFlow in `models/deepfake.py` and adapt preprocessing/inference to your trained architecture.

---

## Part 9 - Gemini Integration

Gemini is already wired in: `sportshield-ai/backend/services/gemini.py` and `sportshield-ai/backend/services/dmca.py` utilizing the `gemini-1.5-flash` model. 

Once `GEMINI_API_KEY` is set, these features become available:
- image manipulation analysis
- legal report generation
- multilingual report output

---

## Part 10 - Final Checklist

- [ ] `sportshield-ai/backend/.env` exists
- [ ] `sportshield-ai/frontend/.env` exists
- [ ] `sportshield-ai/backend/serviceAccountKey.json` exists
- [ ] Firestore is enabled
- [ ] Storage is enabled
- [ ] Realtime Database is enabled
- [ ] Google Auth is enabled
- [ ] `localhost` is in Firebase authorized domains
- [ ] Firestore rules allow local testing
- [ ] Storage rules allow local testing
- [ ] `python main.py` starts successfully
- [ ] `python seed_demo_data.py` succeeds
- [ ] `python download_demo_dataset.py` succeeds
- [ ] `npm run dev` starts successfully
- [ ] Google sign-in works, or local preview is used until Firebase Auth is configured

---

## Quick Reference

| Key | Where to get it | What breaks without it |
| --- | --- | --- |
| `GEMINI_API_KEY` | Google AI Studio | Gemini analysis and legal reports |
| `FIREBASE_PROJECT_ID` | Firebase Project Settings | Backend Firebase integrations |
| `FIREBASE_CREDENTIALS_JSON` | Service account JSON path | Backend Firebase Admin init |
| `VITE_FIREBASE_API_KEY` | Firebase web app config | Frontend Firebase access |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config | Google sign-in |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database | Live feed and dashboard stats |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase web app config | Frontend storage references |

---

Generated for ShieldCoreAI / `sportshield-ai`. Best of luck at the Solution Challenge!
