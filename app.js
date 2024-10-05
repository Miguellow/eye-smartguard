let screenTime = 0;
let timerInterval = null;
let screenTimeLimit = 0;
let postureAlertInterval = null;
let alertSoundInterval = null; // To hold the interval for repeated sound

// Initialize gyroscope graph
const gyroscopeCanvas = document.getElementById('gyroscopeGraph');
const gyroscopeCtx = gyroscopeCanvas.getContext('2d');
let ballPositionX = gyroscopeCanvas.width / 2;
let ballPositionY = gyroscopeCanvas.height / 2;
let ballRadius = 10;

// Key bindings
document.addEventListener('keydown', function(event) {
    if (event.key === 'T' || event.key === 't') {
        startTimer();
    }
    if (event.key === 'R' || event.key === 'r') {
        resetTimer();
    }
    if (event.key === 'B' || event.key === 'b') {
        triggerBadPostureAlert();
    }
    if (event.key === 'G' || event.key === 'g') {
        setPostureGood();
    }
    if (event.key === 'H' || event.key === 'h') {
        triggerRandomPostureAlert();
    }
});

function startTimer() {
    if (timerInterval) return;
    const screenTimeLimitInput = document.getElementById('screenTimeLimit');
    screenTimeLimit = parseInt(screenTimeLimitInput.value) * 60 || 0;
    timerInterval = setInterval(updateScreenTime, 1000);
}

function updateScreenTime() {
    screenTime++;
    const minutes = Math.floor(screenTime / 60);
    const seconds = screenTime % 60;
    document.getElementById('screenTimeDisplay').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    if (screenTimeLimit > 0) {
        const progress = (screenTime / screenTimeLimit) * 100;
        document.getElementById('screenTimeProgress').value = progress;

        if (screenTime >= screenTimeLimit) {
            playRepeatedSound('screenTimeAlert'); // Start playing the sound repeatedly
            clearInterval(timerInterval); // Stop the timer
        }
    }
}

function playRepeatedSound(soundId) {
    playSound(soundId); // Play sound once immediately
    // Clear any existing interval for repeated sounds
    clearInterval(alertSoundInterval);
    // Set an interval to play the sound every 2 seconds (or whatever duration you prefer)
    alertSoundInterval = setInterval(() => {
        playSound(soundId);
    }, 7500); // Adjust the timing as needed
}

function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(alertSoundInterval); // Stop repeated alert sound
    timerInterval = null;
    screenTime = 0;
    document.getElementById('screenTimeDisplay').innerText = '0:00';
    document.getElementById('screenTimeProgress').value = 0;
    setPostureGood(); // Reset posture to good when timer is reset
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Error playing sound:', error));
    }
}

function triggerBadPostureAlert() {
    playSound('postureAlert');
    document.getElementById('postureStatus').innerText = "Posture: Bad";
    clearInterval(postureAlertInterval); // Stop any existing random alerts
}

function setPostureGood() {
    document.getElementById('postureStatus').innerText = "Posture: Good";
    clearInterval(postureAlertInterval); // Stop any existing random alerts
}

function triggerRandomPostureAlert() {
    clearInterval(postureAlertInterval); // Clear existing intervals
    postureAlertInterval = setInterval(() => {
        playSound('postureAlert');
        document.getElementById('postureStatus').innerText = "Posture: Bad";
    }, 3000);
}

// Keep updating the gyroscope graph
function drawGyroscopeGraph() {
    gyroscopeCtx.clearRect(0, 0, gyroscopeCanvas.width, gyroscopeCanvas.height);

    // Draw the blue ball
    gyroscopeCtx.beginPath();
    gyroscopeCtx.arc(ballPositionX, ballPositionY, ballRadius, 0, 2 * Math.PI, false);
    gyroscopeCtx.fillStyle = 'blue';
    gyroscopeCtx.fill();
    gyroscopeCtx.lineWidth = 2;
    gyroscopeCtx.strokeStyle = '#003300';
    gyroscopeCtx.stroke();

    // Randomize ball movement (to simulate head movement)
    ballPositionX += (Math.random() - 0.5) * 10;
    ballPositionY += (Math.random() - 0.5) * 10;

    // Keep the ball inside the canvas
    if (ballPositionX + ballRadius > gyroscopeCanvas.width || ballPositionX - ballRadius < 0) {
        ballPositionX = gyroscopeCanvas.width / 2;
    }
    if (ballPositionY + ballRadius > gyroscopeCanvas.height || ballPositionY - ballRadius < 0) {
        ballPositionY = gyroscopeCanvas.height / 2;
    }
}

setInterval(drawGyroscopeGraph, 1000);
