const UCP_URL = "https://admin.gambit-rp.com/ucp";

let autoUpdateUcpInterval = null;

async function updateTimer() {
    const storage = await browser.storage.sync.get([ "autoUpdateUcp", "autoUpdateUcpTimeout", ]);
	const autoUpdateUcp = storage.autoUpdateUcp ?? false;
	const autoUpdateUcpTimeout = storage.autoUpdateUcpTimeout ?? 300;

    if (autoUpdateUcpInterval) {
        clearInterval(autoUpdateUcpInterval);
        autoUpdateUcpInterval = null;
    }

    if (autoUpdateUcp) {
        autoUpdateUcpInterval = setInterval(() => {
            checkUcp();
        }, autoUpdateUcpTimeout * 1000);
    }
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

	if (!response.ok) return console.warn("[UCP] Ошибка запроса, пропуск проверки");

	const html = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const menuItems = [...doc.querySelectorAll("a.dropdown-toggle")];
	const charactersItem = menuItems.find(a => a.textContent.includes("Персонажи"));

	if (!charactersItem) return console.warn("[UCP] Пункт 'Персонажи' не найден");

	const counterSpan = charactersItem.querySelector('span[style*="font-size: 10px"]');
	if (!counterSpan) return console.warn("[UCP] Счетчик в пункте 'Персонажи' не найден");

	const value = parseInt(counterSpan.textContent.trim(), 10);

	if (!value || value === 0) return
	
	if (autoUpdateUcpTab) {
		const tabs = await browser.tabs.query({ url: ["https://admin.gambit-rp.com/ucp", "https://admin.gambit-rp.com/ucp/"] });
		if (tabs.length > 0) {
			for (const tab of tabs) { browser.tabs.reload(tab.id); }
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
	} = await browser.storage.sync.get(["autoUpdateOnlySound", "autoUpdateNotifySound", "AutoUpdateNotifySoundVolume"]);

    if (autoUpdateOnlySound) {
        const audio = new Audio(browser.runtime.getURL(`media/sounds/${autoUpdateNotifySound}`));
		audio.volume = AutoUpdateNotifySoundVolume / 100;
        audio.play().catch(() => console.warn("[UCP] Не удалось воспроизвести звук"));
    } else {
        browser.notifications.create({
            type: "basic",
            iconUrl: "icons/logo.png",
            title: "UCP Helper",
            message: text
        });
    }
}

browser.runtime.onInstalled.addListener(() => {
    updateTimer();
});

browser.runtime.onStartup.addListener(() => {
    updateTimer();
});

browser.storage.onChanged.addListener((changes, area) => {
    updateTimer();
});