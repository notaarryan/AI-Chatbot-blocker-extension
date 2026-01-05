const startBlockingButton = document.getElementById("startBlockingButton");
const minutesInput = document.getElementById("minutesInput");
const timerDisplay = document.getElementById("timerDisplay");
const modeRadios = document.querySelectorAll('input[name="mode"]');
const timerControls = document.querySelector(".timer-controls");

let countdownInterval = null;

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function updateUI(state) {
  if (state.runBackground) {
    startBlockingButton.innerText = "Stop blocking AI";

    if (state.endTime) {
      timerDisplay.style.display = "block";
      const remaining = state.endTime - Date.now();
      timerDisplay.innerText =
        remaining > 0
          ? `Time remaining: ${formatTime(remaining)}`
          : "Blocking finished";
    } else {
      timerDisplay.style.display = "none";
    }
  } else {
    startBlockingButton.innerText = "Start blocking AI";
    timerDisplay.style.display = "none";
  }
}

function startCountdown(endTime) {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    chrome.storage.local.get(
      { runBackground: false, endTime: null },
      (state) => {
        updateUI(state);
        if (!state.endTime || Date.now() >= state.endTime) {
          chrome.storage.local.set({ runBackground: false, endTime: null });
          clearInterval(countdownInterval);
        }
      }
    );
  }, 1000);
}

chrome.storage.local.get({ runBackground: false, endTime: null }, (state) => {
  updateUI(state);
  if (state.runBackground && state.endTime) {
    startCountdown(state.endTime);
  }
});

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (getSelectedMode() === "timer") {
      timerControls.classList.add("active");
    } else {
      timerControls.classList.remove("active");
    }
  });
});

startBlockingButton.addEventListener("click", () => {
  chrome.storage.local.get({ runBackground: false, endTime: null }, (state) => {
    if (state.runBackground) {
      chrome.storage.local.set({ runBackground: false, endTime: null });
      clearInterval(countdownInterval);
      updateUI({ runBackground: false });
    } else {
      let endTime = null;

      if (getSelectedMode() === "timer") {
        const minutes = parseInt(minutesInput.value, 10);
        if (!minutes || minutes <= 0) {
          alert("Please enter a valid number of minutes.");
          return;
        }
        endTime = Date.now() + minutes * 60 * 1000;
      }

      chrome.storage.local.set({
        runBackground: true,
        endTime,
      });

      if (endTime) {
        startCountdown(endTime);
      }
      updateUI({ runBackground: true, endTime });

      if (endTime) {
        window.open(chrome.runtime.getURL("index.html?timer=true"), "_blank");
      }
    }
  });
});
