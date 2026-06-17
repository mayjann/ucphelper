import { showToast } from "./toast.js";
import { DEFAULT_SETTINGS } from "./init.js"

export function initTemplates(storage) {
    const toggle = document.getElementById("useTemplates");
    toggle.checked = storage.useTemplates ?? DEFAULT_SETTINGS.useTemplates;
    const templates = storage.templates || DEFAULT_SETTINGS.templates;

    Object.entries(templates).forEach(([key, value]) => {
        const el = document.getElementById(`template_${key}`);
        if (el) el.value = value;
    });

    document.getElementById("saveTemplatesBtn").addEventListener("click", async () => {
		const newTemplates = {};

		Object.keys(DEFAULT_SETTINGS.templates).forEach(key => {
			const el = document.getElementById(`template_${key}`);
			if (el) newTemplates[key] = el.value.trim();
		});

		await browser.storage.sync.set({
			templates: newTemplates,
			useTemplates: toggle.checked
		});

		showToast("Шаблоны сохранены");
	});
}