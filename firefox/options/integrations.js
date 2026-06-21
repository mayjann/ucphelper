import { showToast } from "./toast.js";


export function initIntegrations(storage) {
    const useGNew = document.getElementById("useGNew");
    const gNewSettings = document.getElementById("gNewSettings");
    const gNewApiKey = document.getElementById("gNewApiKey");
    const saveBtn = document.getElementById("saveIntegrationsBtn");

    if (!useGNew || !saveBtn) return;

    useGNew.checked = storage.useGNew ?? false;
    gNewApiKey.value = storage.gNewApiKey ?? "";

    function updateVisibility() {
        gNewSettings.style.display = useGNew.checked
            ? "block"
            : "none";
    }

    updateVisibility();

    useGNew.addEventListener("change", () => {
        updateVisibility();
    });

    saveBtn.addEventListener("click", async () => {
        await browser.storage.sync.set({
            useGNew: useGNew.checked,
            gNewApiKey: gNewApiKey.value.trim()
        });

        showToast("Шаблоны сохранены", "success");
    });

}