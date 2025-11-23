const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const info = document.getElementById('info');
const soundToggle = document.getElementById('soundToggle');

let stream = null;
let detecting = false;
let faceDetectedFlag = false;
const SOUND_FILE = 'https://cdn.jsdelivr.net/gh/pixel-houser/client-face-expression-detection/face_detected.mp3';
const audio = new Audio(SOUND_FILE);

// Load models from the face-api.js CDN
async function loadModels() {
    info.textContent = 'Status: Loading models... (may take a few seconds)';
    const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        info.textContent = 'Status: Models loaded';
        return true;
    } catch (err) {
        console.error("Error loading models:", err);
        info.textContent = `Status: Error loading models. ${err.message}`;
        return false;
    }
}

// Main detection loop function
async function runDetection() {
    if (!detecting) {
        return;
    }

    const ctx = overlay.getContext('2d');
    const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5
    });
    const results = await faceapi.detectAllFaces(video, options).withFaceExpressions();

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const resizedResults = faceapi.resizeResults(results, {
        width: overlay.width,
        height: overlay.height
    });

    if (resizedResults.length > 0) {
        if (!faceDetectedFlag && soundToggle.checked) {
            faceDetectedFlag = true;
            audio.play().catch(e => console.error("Error playing sound:", e));
        }
    } else {
        faceDetectedFlag = false;
    }

    resizedResults.forEach(res => {
        const { x, y, width, height } = res.detection.box;
        const expressions = res.expressions;
        const topExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];
        const label = `${topExpression[0]} (${(topExpression[1] * 100).toFixed(0)}%)`;

        // Draw the bounding box
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw the label background
        ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
        ctx.fillRect(x, y - 24, ctx.measureText(label).width + 12, 20);

        // Draw the label text
        ctx.fillStyle = '#bde6fb';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText(label, x + 6, y - 8);
    });

    requestAnimationFrame(runDetection);
}

async function startCamera() {
    if (stream) return;

    const modelsLoaded = await loadModels();
    if (!modelsLoaded) return;

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });
        video.srcObject = stream;

        video.addEventListener('playing', () => {
            // This is the key part to ensure alignment.
            // Set the canvas dimensions to match the video's intrinsic dimensions.
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
            
            // Set the overlay's CSS to match the video element's displayed size.
            // This ensures the canvas is the same size as the video being displayed.
            overlay.style.width = video.offsetWidth + 'px';
            overlay.style.height = video.offsetHeight + 'px';

            detecting = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            info.textContent = 'Status: Detecting...';
            runDetection();
        }, { once: true }); // Using { once: true } ensures this listener only runs once
    } catch (err) {
        console.error("Error starting camera:", err);
        info.textContent = `Status: Error accessing camera. ${err.message}`;
    }
}

function stopCamera() {
    detecting = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    info.textContent = 'Status: Stopped';

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
        video.srcObject = null;
    }

    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    faceDetectedFlag = false;
}

startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);

window.addEventListener('resize', () => {
    if (detecting) {
        overlay.width = video.videoWidth;
        overlay.height = video.videoHeight;
    }
});