document.addEventListener("DOMContentLoaded", async () => {
    const quietToggle = document.getElementById("quietEnabled");
    const storage = await browser.storage.sync.get("quietEnabled");
    quietToggle.checked = storage.quietEnabled ?? false;

    quietToggle.addEventListener("change", async () => {
        await browser.storage.sync.set({ quietEnabled: quietToggle.checked });
    });
});