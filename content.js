const blockedSites = [
  "chatgpt.com",
  "gemini.google.com",
  "claude.ai",
  "chat.deepseek.com",
  "perplexity.ai",
  "copilot.microsoft.com",
  "you.com",
  "grok.com",
];

navigation.addEventListener("navigate", (e) => {
  chrome.storage.local.get({ runBackground: false }, (data) => {
    if (data.runBackground) {
      blockSite();
    }
  });
});

document.addEventListener("keydown", (e) => {
  chrome.storage.local.get({ runBackground: false }, (data) => {
    if (data.runBackground) {
      blockSite();
    }
  });
});

function blockSite() {
  const currentHostname = window.location.hostname;
  if (blockedSites.some((site) => currentHostname.includes(site))) {
    try {
      window.stop();
    } catch (e) {}

    document.documentElement.innerHTML = "";
    document.documentElement.style.visibility = "hidden";
    document.documentElement.style.background = "black";

    const overlay = document.createElement("div");
    overlay.style.fontFamily = "sans-serif";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "2147483647";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "24px";
    overlay.innerText = "This site is blocked. Get back to work!";
    overlay.style.visibility = "visible";

    document.documentElement.appendChild(overlay);
  }
}

chrome.storage.local.get({ runBackground: false }, (data) => {
  if (data.runBackground) {
    blockSite();
  }
});
