import { DEFAULT_SETTINGS } from "../../../core/config.js"
import { sendNewbie } from "../../../core/utils/sendNewbie.js";
import { showToast } from "./toast.js";

let tooltipElem = null;

export function createBadge(text, colorClass, link = null) {
    const badge = document.createElement("span");
    badge.className = `ucp-nick-badge ${colorClass}`;
    badge.innerText = text;

    if (link) {
        badge.style.cursor = "pointer";
        badge.addEventListener("click", () => {
            window.open(link, "_blank");
        });
    }

    return badge;
}

export function showBanPopup(reasonText) {
    if (banAlertShown) return;
    const overlay = document.createElement('div');
    overlay.className = 'ucp-modal-overlay';
    overlay.innerHTML = `
        <div class="ucp-modal-content">
            <div class="ucp-warning-icon">!</div>
            <div class="ucp-modal-title">Обнаружен обход</div>
            <div class="ucp-modal-text">
                Внимание! IP адрес совпадает с заблокированным.<br>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; color: #ff6b6b; font-size: 13px; margin-top:10px;">${reasonText}</div>
            </div>
            <button class="ucp-modal-btn" id="ucpCloseBtn">Закрыть</button>
        </div>`;
    document.body.appendChild(overlay);
    document.getElementById('ucpCloseBtn').onclick = () => { overlay.remove(); };
    banAlertShown = true;
}

async function createSendNewbieRequest(characterName) {
    const storage = await chrome.storage.sync.get(["useGNew", "gNewApiKey"]);

    if (!storage.useGNew) return;

    if (!storage.gNewApiKey) {
        showToast("G-NEW: API ключ не указан", "error");
        return;
    }

    const KEY = storage.gNewApiKey;
    const result = await sendNewbie(KEY, characterName);

    if (result.status === 201) {
        showToast(`G-NEW: ${result.data.message ?? "Новичок успешно добавлен"}`, "success");
    } else {
        showToast(`G-NEW: ${result.data.error ?? "Неизвестная ошибка"}`, "error");
    }
}

export function createNewRequestButton(ucpLink, lk, regDate, isNew, displayDate, characterName) {
    const btn = document.createElement('button');

    btn.className = "ucp-request-btn";
    btn.innerText = displayDate;
    btn.style.marginLeft = "12px";
    btn.style.position = "relative";
    
    btn.style.backgroundColor = isNew ? "#dc3545" : "#198754";
    btn.style.border = isNew ? "1px solid #b02a37" : "1px solid #146c43";
    
    if (!isNew) {
        btn.style.cursor = "default";
        btn.style.pointerEvents = "none";
    }
    
    if (displayDate.length > 15) {
        btn.style.minWidth = "140px";
    } else if (regDate === "Новорег") {
        btn.style.minWidth = "70px";
    }

    if (isNew) {
        btn.onclick = async () => {
            try {
                createSendNewbieRequest(characterName);
                const storage = await chrome.storage.sync.get(["ppTemplate"]);
                const tpl = storage.ppTemplate ?? DEFAULT_SETTINGS.ppTemplate;
                await navigator.clipboard.writeText(renderPpTemplate(tpl, ucpLink, lk));

                const popup = document.createElement('div');
                popup.className = "ucp-copy-popup";
                popup.innerText = "Текст запроса скопирован";
                popup.style.minWidth = "160px";
                popup.style.fontSize = "9px";
                popup.style.padding = "4px 6px";
                
                btn.appendChild(popup);
                requestAnimationFrame(() => popup.style.opacity = "1");
                setTimeout(() => {
                    popup.style.opacity = "0";
                    setTimeout(() => popup.remove(), 300);
                }, 1500);
            } catch (err) {
                alert("Не удалось скопировать текст!");
                console.log(err)
            }
        };
    }

    return btn;
}

export function applyRowState(row, state) {
    row.classList.remove("ucp-row-pk", "ucp-row-batch", "ucp-clean-row", "ucp-row-banned");

    if (state === "ban") {
        row.classList.add("ucp-row-banned");
    }

    if (state === "pk") {
        row.classList.add("ucp-row-pk");
    }

    if (state === "clean") {
        row.classList.add("ucp-clean-row");
    }
}

export function createGoogleLink(name) {
    const a = document.createElement('a');
    a.href = `https://www.google.com/search?q=${name.replace('_', '+')}`;
    a.target = "_blank";
    a.className = "ucp-google-btn";
    a.innerText = "G";
    a.title = "Google Check";
    return a;
}

function renderPpTemplate(template, ucpLink, lk) {
	return template
		.replaceAll("{{ucpLink}}", ucpLink || "")
		.replaceAll("{{lk}}", lk || "");
}