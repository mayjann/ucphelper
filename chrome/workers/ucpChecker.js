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


  // ===== УВЕДОМЛЕНИЕ =====

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

chrome.runtime.onInstalled.addListener(() => {
  updateTimer();
});

chrome.runtime.onStartup.addListener(() => {
  updateTimer();
});

chrome.storage.onChanged.addListener(() => {
  updateTimer();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "ucpCheck") {
    checkUcp();
  }
});