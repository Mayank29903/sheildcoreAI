# ShieldCoreAI - Complete Setup Guide

Everything needed to make `sportshield-ai` work from zero.

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
- Region: `asia-south1`

This also enables the Firestore API.

### 3. Create Storage Bucket

- Storage -> Get Started
- Choose `Start in test mode`
- Region: `asia-south1`

This creates the bucket `sheildcoreai.appspot.com`.

### 4. Enable Realtime Database

- Realtime Database -> Create database
- Choose `Test mode`
- Region: `us-central1`

Expected URL:

```text
https://sheildcoreai-default-rtdb.firebaseio.com
```

### 5. Download Service Account Key

- Project Settings -> Service Accounts
- Click `Generate new private key`
- Download the JSON
- Rename it to `serviceAccountKey.json`
- Put it in `sportshield-ai/backend/`

### 6. Get Web App Config

- Project Settings -> General
- Scroll to `Your apps`
- Open your web app, or create one if needed
- Copy the values from the `Config` view

---

## Part 2 - Create Your Env Files

### `sportshield-ai/backend/.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=sheildcoreai
FIREBASE_CREDENTIALS_JSON=./serviceAccountKey.json
GOOGLE_CSE_KEY=
GOOGLE_CSE_CX=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
DEMO_MODE=true
PORT=8000
```

Get a Gemini API key at:
https://aistudio.google.com

### `sportshield-ai/frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=paste_from_firebase_console
VITE_FIREBASE_AUTH_DOMAIN=sheildcoreai.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://sheildcoreai-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=sheildcoreai
VITE_FIREBASE_STORAGE_BUCKET=sheildcoreai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=paste_from_firebase_console
VITE_FIREBASE_APP_ID=paste_from_firebase_console
```

---

## Part 3 - Firebase Rules For Local Testing

### Storage Rules

Replace Storage Rules with:

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

Replace Firestore Rules with:

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

## Part 4 - Critical Backend Fix

The scan route should not upload to Storage before returning the initial response.

This repo already includes that fix in:

```text
sportshield-ai/backend/routes/scan.py
```

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

## Part 6 - Run The Project

### Terminal 1 - Backend

```bash
cd sportshield-ai/backend
pip install -r requirements.txt
python main.py
```

Expected backend log highlights:

- `Firebase Admin Initialized Successfully`
- either deepfake model loaded, or deepfake skipped with a warning

### Terminal 2 - Seed Demo Data

```bash
cd sportshield-ai/backend
python seed_demo_data.py
```

Expected output:

```text
DEMO DATA SEEDED SUCCESSFULLY
```

### Terminal 3 - Frontend

```bash
cd sportshield-ai/frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Part 7 - Deepfake Model Integration

The project already supports a Hugging Face model in:

```text
sportshield-ai/backend/models/deepfake.py
```

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

## Part 8 - Gemini Integration

Gemini is already wired in:

```text
sportshield-ai/backend/services/gemini.py
```

Once `GEMINI_API_KEY` is set, these features become available:

- image manipulation analysis
- legal report generation
- multilingual report output

For video support and scan-result chat, extend:

```text
sportshield-ai/backend/routes/scan.py
```

---

## Part 9 - Final Checklist

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

Generated for ShieldCoreAI / `sportshield-ai`.
