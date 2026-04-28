async function initTemplateWatcher() {
    if (!window.location.href.includes("/ucp")) return;

    const select = document.querySelector('#inputState');
    const reasonInput = document.querySelector('input[name="reason"]');

    if (!select || !reasonInput) return;

    if (select.getAttribute("data-template-bound")) return;
    select.setAttribute("data-template-bound", "true");

    select.addEventListener("change", async () => {
        const reasonId = select.value;
        if (!reasonId) return;

        const storage = await chrome.storage.sync.get([
            "useTemplates",
            "templates"
        ]);

        const useTemplates = storage.useTemplates ?? DEFAULT_SETTINGS.useTemplates;
        const templates = storage.templates ?? DEFAULT_SETTINGS.templates;

        if (!useTemplates) return;

        const template = templates[reasonId];
        if (!template) return;

        reasonInput.value = template;
        reasonInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
}