EmoCare — Client-side single page app
====================================

What this is
- A single-page web app that detects faces and shows probable expressions entirely in the browser (no server).
- Uses **face-api.js** (TensorFlow.js) for face detection + expression recognition.
- Plays a sound `face_detected.mp3` once when a face appears (toggleable).

Files
- index.html — main page
- styles.css — styling
- script.js — detection logic
- face_detected.mp3 — placeholder sound (replace with your audio file)
- firebase.json — config for Firebase Hosting
- README.md — this file

How to deploy on Firebase Hosting
1. Install Firebase CLI (only on your machine): `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize a new project (if needed): `firebase init` → choose Hosting → use existing project or create new → public directory: `.` → single-page app: yes → overwrite index? no
4. Deploy: `firebase deploy --only hosting`

Important notes
- Browser will ask for camera permission.
- Some browsers block autoplaying audio; clicking Start usually allows audio playback.
- Models are loaded from a public CDN. If you prefer, download the models and serve them locally — update MODEL_URL in script.js.
