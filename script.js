let runBackground = false;

const startBlockingButton = document.getElementById("startBlockingButton");

chrome.storage.local.get({ runBackground: false }, (data) => {
  runBackground = data.runBackground;
  startBlockingButton.innerText = runBackground
    ? "Stop blocking ai"
    : "Start blocking ai";
});

startBlockingButton.addEventListener("click", () => {
  runBackground = !runBackground;

  chrome.storage.local.set({ runBackground });

  if (runBackground) {
    alert("started blocking ai");
    startBlockingButton.innerText = "Stop blocking ai";
  } else {
    alert("stopped blocking ai");
    startBlockingButton.innerText = "Start blocking ai";
  }
});
