const REPO = "mayjann/ucphelper";

let creatingOffscreen;

async function setupOffscreenDocument() {
  const exists = await browser.offscreen.hasDocument?.();
  if (exists) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = browser.offscreen.createDocument({
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

const UCP_URL = "https://admin.gambit-rp.com/ucp";

let autoUpdateUcpInterval = null;

async function updateTimer() {
  const storage = await browser.storage.sync.get(["autoUpdateUcp", "autoUpdateUcpTimeout"]);
  const autoUpdateUcp = storage.autoUpdateUcp ?? false;
  const autoUpdateUcpTimeout = storage.autoUpdateUcpTimeout ?? 5;

  await browser.alarms.clear("ucpCheck");

  if (!autoUpdateUcp) { return; }

  browser.alarms.create("ucpCheck", { periodInMinutes: autoUpdateUcpTimeout });
}

async function checkUcp() {
	const storage = await browser.storage.sync.get([ "autoUpdateUcpTab", "quietHoursEnabled", "quietHours", "quietEnabled" ]);

	const autoUpdateUcpTab = storage.autoUpdateUcpTab ?? true;
	const quietHoursEnabled = storage.quietHoursEnabled ?? false;
	const quietHours = storage.quietHours ?? { from: "23:00", to: "05:00" };
	const { from, to } = quietHours;
	const quietEnabled = storage.quietEnabled ?? false;

	let inQuietHours = false
		
	if (quietHoursEnabled) {
		const now = new Date();
		const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
		
		const toMinutes = timeStr => {
			const [h, m] = timeStr.split(":").map(Number);
			return h * 60 + m;
		};

		const fromMinutes = toMinutes(quietHours.from);
		const toMinutesVal = toMinutes(quietHours.to);
		const nowMinutes = toMinutes(currentTime);
		
		if (fromMinutes <= toMinutesVal) {
			inQuietHours = nowMinutes >= fromMinutes && nowMinutes <= toMinutesVal;
		} else {
			inQuietHours = nowMinutes >= fromMinutes || nowMinutes <= toMinutesVal;
		}
	}

	const response = await fetch(UCP_URL, { credentials: "include" });

	if (!response.ok) { return; }

	const html = await response.text();
	const match = html.match(/Персонажи[\s\S]*?<span[^>]*style=["'][^"']*font-size:\s*10px[^"']*["'][^>]*>(\d+)<\/span>/);

  if (!match) return;

  const value = parseInt(match[1], 10);

  if (!value || value === 0) return;
	
	if (autoUpdateUcpTab) {
		const tabs = await browser.tabs.query({ url: ["https://admin.gambit-rp.com/ucp", "https://admin.gambit-rp.com/ucp/"] });
		for (const tab of tabs) { browser.tabs.reload(tab.id); }
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
	} = await browser.storage.sync.get(["autoUpdateOnlySound", "autoUpdateNotifySound", "AutoUpdateNotifySoundVolume"]);

  if (autoUpdateOnlySound) {
    const audio = new Audio(browser.runtime.getURL(`media/sounds/${autoUpdateNotifySound}`));
    audio.volume = AutoUpdateNotifySoundVolume / 100;
    audio.play().catch(() => {});
  } else {
    browser.notifications.create({
      type: "basic",
      iconUrl: "icons/logo.png",
      title: "UCP Helper",
      message: text
    });
  }
}

browser.runtime.onInstalled.addListener(async () => {
  await updateTimer();
});

browser.runtime.onStartup.addListener(async () => {
  await updateTimer();
  const alarm = await browser.alarms.get("ucpCheck");
});

browser.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "sync") return;

  if (changes.autoUpdateUcp || changes.autoUpdateUcpTimeout) {
    await updateTimer();
  }
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case "versionCheck":
      await checkExtensionUpdate();
      break;

    case "ucpCheck":
      await checkUcp();
      break;
  }
});

browser.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url?.startsWith(UCP_URL)) return;
  if (info.status !== "complete") return;

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);

  if (!res.ok) return;

  const data = await res.json();

  const latestVersion = data.tag_name;
  const currentVersion = chrome.runtime.getManifest().version;

  const isNew = compareVersions(latestVersion, currentVersion) > 0;

  if (!isNew) return;

  browser.scripting.executeScript({
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
    args: [latestVersion]
  });
});