const phases = [
    "Plank vorne",
    "Plank seitlich",
    "Plank rückwärts",
    "Plank seitlich (andere Seite)"
];

const reminderTimes = [20, 10, 5]; // Sekunden vor Ende, standardmäßig
let currentPhase = 0;
let timeLeft = 0;
let interval;
let prepTime = 3;
let phaseDuration = 30;
let inPrep = true;
let isPaused = false;

function playSound(id, volume = 1.0, times = 1, delay = 200) {
    if (!document.getElementById("sound_" + id)?.checked) return;

    const sound = document.getElementById(id);
    sound.volume = volume;
    let i = 0;
    const interval = setInterval(() => {
        sound.currentTime = 0;
        sound.play();
        i++;
        if (i >= times) clearInterval(interval);
    }, delay);
}

function startWorkout() {
    prepTime = parseInt(document.getElementById("prepTime").value) || 3;
    phaseDuration = parseInt(document.getElementById("phaseDuration").value) || 30;
    localStorage.setItem("prepTime", prepTime);
    localStorage.setItem("phaseDuration", phaseDuration);

    document.querySelector("button").disabled = true;
    document.getElementById("pauseButton").disabled = false;
    timeLeft = prepTime;
    currentPhase = 0;
    inPrep = true;
    isPaused = false;
    document.getElementById("phase").textContent = "Vorbereitung";
    document.getElementById("timer").textContent = timeLeft;

    interval = setInterval(updateTimer, 1000);
}

function pauseWorkout() {
    isPaused = !isPaused;
    document.getElementById("pauseButton").textContent = isPaused ? "Fortsetzen" : "Pausieren";
}

function updateTimer() {
    if (isPaused) return;

    if (inPrep) {
        playSound("tickPrep", 0.2);
    } else {
    if (reminderTimes.includes(timeLeft)) {
        const times = reminderTimes.indexOf(timeLeft) + 1;
        playSound("reminder", 0.5, times);
    } else if (timeLeft <= 3 && timeLeft > 0) {
        playSound("tickPrep", 0.2);
    } else {
        playSound("tickWork", 0.05);
    }
    }

    document.getElementById("timer").textContent = timeLeft;
    timeLeft--;

    if (timeLeft < 0) {
    playSound("final", 0.2);
    if (inPrep) {
        inPrep = false;
        timeLeft = phaseDuration - 1;
        document.getElementById("phase").textContent = phases[currentPhase];
    } else {
        currentPhase++;
        if (currentPhase >= phases.length) {
        clearInterval(interval);
        document.getElementById("phase").textContent = "Fertig! Gut gemacht!";
        document.getElementById("timer").textContent = "0";
        document.querySelector("button").disabled = false;
        return;
        }
        timeLeft = phaseDuration - 1;
        document.getElementById("phase").textContent = phases[currentPhase];
    }
    }
}

window.onload = () => {
    const storedPrep = localStorage.getItem("prepTime");
    const storedPhase = localStorage.getItem("phaseDuration");
    if (storedPrep) document.getElementById("prepTime").value = storedPrep;
    if (storedPhase) document.getElementById("phaseDuration").value = storedPhase;
};