import { initDefaults } from "./init.js";
import { initBadWords } from "./badWords.js";
import { initTemplates } from "./templates.js";
import { initAutoUpdate } from "./autoUpdate.js";

const mainContainer = document.querySelector("main.container");

async function loadSection(file) {
    const storage = await chrome.storage.sync.get(null);
    const res = await fetch(file);
    const html = await res.text();

    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.innerHTML = `
        <div class="lds-spinner">
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
        </div>
    `;

    mainContainer.innerHTML = "";
    mainContainer.style.display = "flex";
    mainContainer.style.alignItems = "center";
    mainContainer.style.justifyContent = "center";
    mainContainer.appendChild(spinner);

    setTimeout(() => {
        mainContainer.innerHTML = html;
        mainContainer.style.display = "";
        mainContainer.style.alignItems = "";
        mainContainer.style.justifyContent = "";

        if (file.includes("notify-settings")) {
            initAutoUpdate(storage);
        } else if (file.includes("badwords")) {
            initBadWords(storage);
        } else if (file.includes("templates")) {
            initTemplates(storage);
        }

    }, 400);
}

document.addEventListener("DOMContentLoaded", async () => {
    const storage = await chrome.storage.sync.get(null);
    await initDefaults(storage);
    loadSection("options/html/notify-settings.html");
});

export { loadSection };