document.addEventListener("DOMContentLoaded", async () => {
    const quietToggle = document.getElementById("quietEnabled");
    const storage = await chrome.storage.sync.get("quietEnabled");
    quietToggle.checked = storage.quietEnabled ?? false;

    quietToggle.addEventListener("change", async () => {
        await chrome.storage.sync.set({ quietEnabled: quietToggle.checked });
    });
});