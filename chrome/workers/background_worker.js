const REPO = "mayjann/ucphelper";

async function setupOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument?.();
  if (exists) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play notification sound"
  });

  await creatingOffscreen;
  creatingOffscreen = null;
}

function compareVersions(v1, v2) {
  const a = v1.replace("v", "").split(".").map(Number);
  const b = v2.replace("v", "").split(".").map(Number);

  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const numA = a[i] || 0;
    const numB = b[i] || 0;

    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }

  return 0;
}

async function checkExtensionUpdate() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/releases/latest`
  );

  if (!res.ok) {
    return;
  }

  const data = await res.json();

  const latestVersion = data.tag_name;
  const currentVersion = chrome.runtime.getManifest().version;

  const isNew = compareVersions(latestVersion, currentVersion) > 0;

  await chrome.storage.local.set({
    ucp_update_available: isNew,
    ucp_latest_version: latestVersion
  });
}

const UCP_URL = "https://admin.gambit-rp.com/ucp";

let creatingOffscreen;

async function setupOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument?.();

  if (exists) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play notification sound"
  });

  await creatingOffscreen;
  creatingOffscreen = null;
}

async function updateTimer() {
  const {autoUpdateUcp = false, autoUpdateUcpTimeout = 300} = await chrome.storage.sync.get([ "autoUpdateUcp", "autoUpdateUcpTimeout" ]);

  await chrome.alarms.clear("ucpCheck");

  if (autoUpdateUcp) {
    chrome.alarms.create("ucpCheck", {
      periodInMinutes: autoUpdateUcpTimeout / 60
    });
  }
}

async function checkUcp() {
  const storage = await chrome.storage.sync.get([ "autoUpdateUcpTab", "quietHoursEnabled", "quietHours", "quietEnabled" ]);
  const autoUpdateUcpTab = storage.autoUpdateUcpTab ?? true;
  const quietHoursEnabled = storage.quietHoursEnabled ?? false;
  const quietEnabled = storage.quietEnabled ?? false;
  const quietHours = storage.quietHours ?? { from: "23:00", to: "05:00" };

  let inQuietHours = false;

  if (quietHoursEnabled) {
    const now = new Date();

    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const nowMin = now.getHours() * 60 + now.getMinutes();
    const fromMin = toMinutes(quietHours.from);
    const toMin = toMinutes(quietHours.to);

    if (fromMin <= toMin) {
      inQuietHours = nowMin >= fromMin && nowMin <= toMin;
    } else {
      inQuietHours = nowMin >= fromMin || nowMin <= toMin;
    }
  }

  const response = await fetch(UCP_URL, { credentials: "include" });

  if (!response.ok) {
    return;
  }

  const html = await response.text();

  const match = html.match(/Персонажи[\s\S]*?font-size:\s*10px[^>]*>(\d+)</i);

  if (!match) {
    return;
  }

  const value = parseInt(match[1], 10);

  if (!value) {
    return;
  }

  if (autoUpdateUcpTab) {
    const tabs = await chrome.tabs.query({
      url: [
        "https://admin.gambit-rp.com/ucp",
        "https://admin.gambit-rp.com/ucp/"
      ]
    });

    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  }

  if (!inQuietHours && !quietEnabled) {
    sendNotification(`Непроверенных UCP: ${value}`);
  }
}

async function sendNotification(text) {

  const {
    autoUpdateOnlySound = false,
    autoUpdateNotifySound = "sound1.mp3",
    AutoUpdateNotifySoundVolume = 75
  } = await chrome.storage.sync.get([
    "autoUpdateOnlySound",
    "autoUpdateNotifySound",
    "AutoUpdateNotifySoundVolume"
  ]);

  if (autoUpdateOnlySound) {
    await setupOffscreenDocument();

    chrome.runtime.sendMessage({
      type: "PLAY_SOUND",
      url: chrome.runtime.getURL(`media/sounds/${autoUpdateNotifySound}`),
      volume: AutoUpdateNotifySoundVolume / 100
    });

    return;
  }

  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/128.png"),
    title: "UCP Helper",
    message: text
  });
}

function initVersionCheck() {
  chrome.alarms.create("versionCheck", {
    periodInMinutes: 60
  });

  checkExtensionUpdate();
}

chrome.runtime.onInstalled.addListener(() => {
  updateTimer();
  initVersionCheck();
});

chrome.runtime.onStartup.addListener(() => {
  updateTimer();
  initVersionCheck();
});

chrome.storage.onChanged.addListener(() => {
  updateTimer();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "versionCheck") {
    checkExtensionUpdate();
  }
  
  if (alarm.name === "ucpCheck") {
    checkUcp();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url || !tab.url.startsWith(UCP_URL)) return;
  if (info.status !== "complete") return;

  const {
    ucp_update_available,
    ucp_latest_version
  } = await chrome.storage.local.get([
    "ucp_update_available",
    "ucp_latest_version"
  ]);

  if (!ucp_update_available) return;

  chrome.scripting.executeScript({
    target: { tabId },
    func: (version) => {

      if (document.getElementById("ucp-update-modal")) return;

      const overlay = document.createElement("div");
      overlay.id = "ucp-update-modal";
      overlay.className = "ucp-modal-overlay";

      overlay.innerHTML = `
        <div class="ucp-modal-content">
          <div class="ucp-modal-title">UCP Helper</div>
          <div class="ucp-modal-subtitle">Доступно обновление</div>

          <div class="ucp-modal-text">
            Доступна новая версия расширения <b>${version}</b><br><br>

            <a 
              href="https://github.com/mayjann/ucphelper/releases/latest"
              target="_blank"
              style="color:#4dabf7;text-decoration:underline"
            >
              Перейти на страницу релиза
            </a>
          </div>

          <button class="ucp-modal-btn" id="ucpUpdateCloseBtn">
            Закрыть
          </button>
        </div>
      `;

      document.body.appendChild(overlay);

      document.getElementById("ucpUpdateCloseBtn").onclick = () => {
        overlay.remove();
      };

    },
    args: [ucp_latest_version]
  });
});