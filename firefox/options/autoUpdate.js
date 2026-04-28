import { showToast } from "./toast.js";
import { ensureNotificationPermission } from "./notifications.js";
import { DEFAULT_SETTINGS, NOTIFY_SOUNDS } from "./init.js";


export function initAutoUpdate(storage) {
    const autoUpdateUcpToggle = document.getElementById("autoUpdateUcp");
	const autoUpdateUcpTabToggle = document.getElementById("autoUpdateUcpTab");
	const onlySoundToggle = document.getElementById("autoUpdateOnlySound");
    const updateIntervalSelect = document.getElementById("updateInterval");
    const soundSelect = document.getElementById("AutoUpdateNotifySound");
    const playSoundBtn = document.getElementById("playSoundBtn");
	const volumeSlider = document.getElementById("AutoUpdateNotifySoundVolume");
	const quietHoursToggle = document.getElementById("quietHoursEnabled");
	const quietHoursFrom = document.getElementById("quietHoursFrom");
	const quietHoursTo = document.getElementById("quietHoursTo");

    soundSelect.innerHTML = "";
    NOTIFY_SOUNDS.forEach(sound => {
        const option = document.createElement("option");
        option.value = sound.file;
        option.textContent = sound.name;
        soundSelect.appendChild(option);
    });

    autoUpdateUcpToggle.checked = storage.autoUpdateUcp ?? DEFAULT_SETTINGS.autoUpdateUcp;
	quietHoursToggle.checked = storage.quietHoursEnabled ?? DEFAULT_SETTINGS.quietHoursEnabled;
	autoUpdateUcpTabToggle.checked = storage.autoUpdateUcpTab ?? DEFAULT_SETTINGS.autoUpdateUcpTab;
	onlySoundToggle.checked = storage.autoUpdateOnlySound ?? DEFAULT_SETTINGS.autoUpdateOnlySound;
    const timeout = storage.autoUpdateUcpTimeout ?? DEFAULT_SETTINGS.autoUpdateUcpTimeout;
    updateIntervalSelect.value = String(timeout / 60);
	
    soundSelect.value = storage.autoUpdateNotifySound ?? DEFAULT_SETTINGS.AutoUpdateNotifySound;
	const savedVolume = storage.AutoUpdateNotifySoundVolume ?? DEFAULT_SETTINGS.AutoUpdateNotifySoundVolume;
	
	const quietHours = storage.quietHours ?? DEFAULT_SETTINGS.quietHours;
	if (quietHoursFrom) quietHoursFrom.value = quietHours.from;
	if (quietHoursTo) quietHoursTo.value = quietHours.to;
	
	if (volumeSlider) {
		volumeSlider.value = savedVolume;

		const tooltip = document.createElement('div');
		tooltip.className = 'volume-tooltip';
		tooltip.innerHTML = `${savedVolume}%`;
		
		tooltip.style.position = 'absolute';
		tooltip.style.padding = '2px 6px';
		tooltip.style.background = '#4fc3f7';
		tooltip.style.color = '#fff';
		tooltip.style.fontSize = '12px';
		tooltip.style.borderRadius = '4px';
		tooltip.style.whiteSpace = 'nowrap';
		tooltip.style.pointerEvents = 'none';
		tooltip.style.visibility = 'hidden';
		tooltip.style.bottom = '20px';
		tooltip.style.transform = 'translateX(-50%)';
		tooltip.style.textAlign = 'center';
		tooltip.style.minWidth = '43px';
		tooltip.style.width = 'auto';
		tooltip.style.boxSizing = 'border-box';

		volumeSlider.parentElement.style.position = 'relative';
		volumeSlider.parentElement.appendChild(tooltip);

		function updateSlider() {
			const value = Number(volumeSlider.value);
			const min = Number(volumeSlider.min);
			const max = Number(volumeSlider.max);
			const percent = (value - min) / (max - min);

			volumeSlider.style.background = `linear-gradient(to right, #4fc3f7 0%, #4fc3f7 ${percent*100}%, #444 ${percent*100}%, #444 100%)`;
			tooltip.textContent = `${value}%`;

			const sliderRect = volumeSlider.getBoundingClientRect();
			const parentRect = volumeSlider.parentElement.getBoundingClientRect();
			const thumbWidth = 16;
			const sliderLeftOffset = sliderRect.left - parentRect.left;
			const thumbCenter = sliderLeftOffset + (percent * (sliderRect.width - thumbWidth)) + (thumbWidth / 2);
			
			tooltip.style.left = `${thumbCenter}px`;
		}

		volumeSlider.addEventListener('input', updateSlider);
		volumeSlider.addEventListener('mouseenter', () => tooltip.style.visibility = 'visible');
		volumeSlider.addEventListener('mouseleave', () => tooltip.style.visibility = 'hidden');

		window.addEventListener('resize', updateSlider);

		updateSlider();
	}
	
	
	
    function updateControlsState() {
		const autoUpdateUcp = autoUpdateUcpToggle.checked;
		const quietHoursEnabled = quietHoursToggle.checked;
		const autoUpdateOnlySound = onlySoundToggle.checked;

		const quietDisabled = !autoUpdateUcp || !quietHoursEnabled;
		const soundDisabled = !autoUpdateUcp || !autoUpdateOnlySound;

		if (quietHoursFrom) quietHoursFrom.disabled = quietDisabled;
		if (quietHoursTo) quietHoursTo.disabled = quietDisabled;

		const quietHoursLabel = document.querySelector('label[for="quietHoursFrom"]');
		if (quietHoursLabel) quietHoursLabel.classList.toggle("disabled", quietDisabled);

		onlySoundToggle.disabled = !autoUpdateUcp;
		autoUpdateUcpTabToggle.disabled = !autoUpdateUcp;
		updateIntervalSelect.disabled = !autoUpdateUcp;
		quietHoursToggle.disabled = !autoUpdateUcp;

		soundSelect.disabled = soundDisabled;
		volumeSlider.disabled = soundDisabled;

		if (playSoundBtn) playSoundBtn.classList.toggle("disabled", soundDisabled);
		if (volumeSlider) volumeSlider.classList.toggle("disabled", soundDisabled);
		const volumeLabel = document.querySelector('label[for="AutoUpdateNotifySoundVolume"]');
		if (volumeLabel) volumeLabel.classList.toggle("disabled", soundDisabled);
		const soundLabel = document.querySelector('label[for="AutoUpdateNotifySound"]');
		if (soundLabel) soundLabel.classList.toggle("disabled", soundDisabled);
		const intervalLabel = document.querySelector('label[for="updateInterval"]');
		if (intervalLabel) intervalLabel.classList.toggle("disabled", !autoUpdateUcp);

		document.querySelectorAll('.toggles input[type="checkbox"]').forEach(cb => {
			if (cb.id === "autoUpdateUcp") return;
			const text = cb.closest('label').querySelector('.toggle-text');
			const isDisabled = !autoUpdateUcp;
			cb.classList.toggle("checkbox-disabled", isDisabled);
			if (text) text.classList.toggle("checkbox-label-disabled", isDisabled);
		});
	}

    updateControlsState();

    autoUpdateUcpToggle.addEventListener("change", async () => {
        if (autoUpdateUcpToggle.checked && !onlySoundToggle.checked) {
            const allowed = await ensureNotificationPermission();
            if (!allowed) {
                autoUpdateUcpToggle.checked = false;
                showToast("Разрешите уведомления", "error");
            }
        }
        updateControlsState();
    });
	
	quietHoursToggle.addEventListener("change", async () => {
        if (!quietHoursToggle.checked && autoUpdateUcpToggle.checked) {
            const allowed = await ensureNotificationPermission();
            if (!allowed) {
                quietHoursToggle.checked = true;
                showToast("Разрешите уведомления", "error");
            }
        }
        updateControlsState();
    });

    onlySoundToggle.addEventListener("change", async () => {
        if (!onlySoundToggle.checked && autoUpdateUcpToggle.checked) {
            const allowed = await ensureNotificationPermission();
            if (!allowed) {
                onlySoundToggle.checked = true;
                showToast("Разрешите уведомления", "error");
            }
        }
        updateControlsState();
    });

    playSoundBtn.addEventListener("click", () => {
        const file = soundSelect.value || NOTIFY_SOUNDS[0].file;
        const audio = new Audio(browser.runtime.getURL(`media/sounds/${file}`));
        if (volumeSlider) audio.volume = volumeSlider.value / 100;
        audio.play().catch(() => showToast("Не удалось воспроизвести звук", "error"));
    });

    document.getElementById("saveGeneralBtn").addEventListener("click", async () => {
        await browser.storage.sync.set({
            autoUpdateUcp: autoUpdateUcpToggle.checked,
			autoUpdateUcpTab: autoUpdateUcpTabToggle.checked,
			autoUpdateOnlySound: onlySoundToggle.checked,
            autoUpdateUcpTimeout: Number(updateIntervalSelect.value) * 60,
            autoUpdateNotifySound: soundSelect.value,
			AutoUpdateNotifySoundVolume: Number(volumeSlider.value),
			quietHoursEnabled: quietHoursToggle.checked,
			quietHours: { from: quietHoursFrom.value, to: quietHoursTo.value }
        });
        showToast("Настройки сохранены");
    });
}