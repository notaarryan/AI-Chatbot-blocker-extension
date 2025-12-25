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

let blockInitialized = false;
let timerInterval = null;

function blockSite() {
  if (blockInitialized) return;
  blockInitialized = true;

  const currentHostname = window.location.hostname;
  if (!blockedSites.some((site) => currentHostname.includes(site))) return;

  try {
    window.stop();
  } catch (e) {}

  document.documentElement.innerHTML = "";
  document.documentElement.style.background = "#0b0f14";

  const overlay = document.createElement("div");
  overlay.id = "ai-blocked-overlay";
  overlay.innerHTML = `
    <div class="cover">
      <h1 id="title">AI Blocked</h1>
      <p class="blocked-text">Stay focused. This site is temporarily blocked.</p>
      <p id="blockedTimer" style="display:none;"></p>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-Regular.ttf"
      )}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-Medium.ttf"
      )}") format("truetype");
      font-weight: 500;
      font-style: normal;
    }

    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-SemiBold.ttf"
      )}") format("truetype");
      font-weight: 600;
      font-style: normal;
    }

    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-Bold.ttf"
      )}") format("truetype");
      font-weight: 700;
      font-style: normal;
    }

    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-ExtraBold.ttf"
      )}") format("truetype");
      font-weight: 800;
      font-style: normal;
    }

    @font-face {
      font-family: "Orbitron";
      src: url("${chrome.runtime.getURL(
        "fonts/Orbitron-Black.ttf"
      )}") format("truetype");
      font-weight: 900;
      font-style: normal;
    }

    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: 'Orbitron', 'Courier New', monospace;
      font-size: 16px;
    }

    #ai-blocked-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top, #0f2027, #0b0f14 60%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2147483647;
      color: #e6edf3;
    }

    .cover {
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 56px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      background: rgba(15, 23, 32, 0.85);
      max-width: 420px;
      width: 100%;
      text-align: center;
    }

    #title {
      font-size: 2.2rem;
      margin-bottom: 18px;
      color: #f0f6fc;
    }

    .blocked-text {
      font-size: 1.05rem;
      opacity: 0.85;
      margin-bottom: 18px;
    }

    #blockedTimer {
      font-size: 1.1rem;
      font-weight: 500;
      color: #60a5fa;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  chrome.storage.local.get({ endTime: null }, (data) => {
    if (!data.endTime) return;

    const timerEl = document.getElementById("blockedTimer");
    timerEl.style.display = "block";

    timerInterval = setInterval(() => {
      const remaining = data.endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timerInterval);
        location.reload();
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      timerEl.textContent = `Time remaining: ${m}:${s
        .toString()
        .padStart(2, "0")}`;
    }, 1000);
  });
}

chrome.storage.local.get({ runBackground: false, endTime: null }, (data) => {
  if (data.runBackground && (!data.endTime || Date.now() < data.endTime)) {
    blockSite();
  }
});
