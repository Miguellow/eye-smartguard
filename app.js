let screenTime = 0; // Initialize screen time in seconds
let timerInterval; // Variable to store the timer interval

// Function to start the screen time timer
function startTimer() {
  if (!timerInterval) { // Only start if timer is not already running
    timerInterval = setInterval(() => {
      screenTime++;
      document.getElementById('screenTimeDisplay').textContent = screenTime + " seconds";
      checkScreenTimeLimit(); // Check if limit is reached
    }, 1000); // Increment every second
  }
}

// Function to reset the screen time timer
function resetTimer() {
  clearInterval(timerInterval); // Clear the interval
  timerInterval = null; // Reset the timer interval variable
  screenTime = 0; // Reset screen time to 0
  document.getElementById('screenTimeDisplay').textContent = "0 seconds"; // Update display
}

// Function to check if screen time limit is reached
function checkScreenTimeLimit() {
  const screenTimeLimit = document.getElementById('screenTimeLimit').value;
  if (screenTimeLimit && screenTime > screenTimeLimit * 60) { // Convert minutes to seconds
    playSound('screenTimeAlert'); // Play screen time alert sound
    alert("You've been looking at the screen for too long, take a break!");
    resetTimer(); // Reset timer after alert
  }
}

// Function to play sound
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    console.log(`Playing sound: ${soundId}`); // Log which sound is being played
    sound.currentTime = 0; // Rewind to the start
    sound.play() // Play the sound
      .catch(error => console.error('Error playing sound:', error)); // Catch and log any errors
  } else {
    console.error(`Sound not found: ${soundId}`); // Log error if sound not found
  }
}

// Keyboard event listener to start/reset the timer
document.addEventListener('keydown', (event) => {
  if (event.key === 'T' || event.key === 't') { // Start timer with 'T'
    startTimer();
  } else if (event.key === 'R' || event.key === 'r') { // Reset timer with 'R'
    resetTimer();
  }
});

// Call the function to initialize the fake stats on page load
window.onload = function() {
  updateFakeStats();
  setInterval(() => {
    document.getElementById('blinkReminder').textContent = "Blink now!";
    setTimeout(() => {
      document.getElementById('blinkReminder').textContent = "";
    }, 1000);
    playSound('blinkAlert'); // Play blink alert sound
  }, 10000); // Reminder every 10 seconds
};

// Function to update fake stats
function updateFakeStats() {
  const screenTimeMin = Math.floor(screenTime / 60);
  const screenTimeSec = screenTime % 60;
  document.getElementById('dailyStats').textContent = 
    `Screen Time: ${screenTimeMin} min ${screenTimeSec} sec, Blinks: 0, Posture: Good`;
}
