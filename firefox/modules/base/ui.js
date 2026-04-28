let tooltipElem = null;

function createBadge(text, colorClass) {
    const badge = document.createElement("span");
    badge.className = `ucp-nick-badge ${colorClass}`;
    badge.innerText = text;
    return badge;
}

function showBanPopup(reasonText) {
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

function renderPpTemplate(template, ucpLink, lk) {
	return template
		.replaceAll("{{ucpLink}}", ucpLink || "")
		.replaceAll("{{lk}}", lk || "");
}

function createNewRequestButton(ucpLink, lk, regDate, isNew, displayDate) {
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
            }
        };
    }

    return btn;
}

function linkifyReason(text) {
    if (!text) return "—";

    return text.replace(
        /([a-zа-яё]{2,10})\s*(\d{6})/gi,
        (match, letters, digits) => {
            const url = `https://forum.gambit-rp.com/threads/${digits}/`;

            return `<a href="${url}" target="_blank" style="color:#4dabf7;text-decoration:underline">${letters}${digits}</a>`;
        }
    );
}


function createModalBadge({text, bgClass, mode, data, player, history}) {
    const badge = document.createElement("span");
    badge.className = `ucp-table-badge ${bgClass}`;
    badge.innerText = text;

    badge.style.cursor = "pointer";

    badge.addEventListener("click", (e) => {
        e.stopPropagation();

        if (mode === "ban") {
            showBanModal(data, history || []);
            return;
        }

        if (mode === "history") {
            showBanHistoryModal(player, history || []);
            return;
        }
    });

    return badge;
}


let activeModal = null;

function openModal(innerHTML, width = 500) {
    if (activeModal) activeModal.remove();

    const overlay = document.createElement("div");
    overlay.className = "ucp-modal-overlay";

    overlay.innerHTML = `
        <div class="ucp-modal-content" style="width:${width}px;max-width:95%">
            ${innerHTML}
        </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    // закрытие по клику вне окна
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    return overlay;
}

function closeModal() {
    if (activeModal) {
        activeModal.remove();
        activeModal = null;
    }
}

// закрытие по ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

function showBanModal(data, banHistory = []) {
    let durationStr = "0 дн.";
    if (data.duration >= 9999) durationStr = "Навсегда";
    else if (data.duration > 0) durationStr = `${data.duration} дн.`;

    const historyButton = banHistory.length
        ? `<button class="ucp-modal-btn-ghost" id="openHistory">
                История блокировок
        </button>`
        : "";

    const modal = openModal(`
        <div class="ucp-modal-title">${data.player || "?"}</div>

        <div class="ucp-modal-text">
            <div><b>Админ:</b> ${data.admin || "?"}</div>
            <div><b>Дата:</b> ${data.dateStr || "—"}</div>
            <div><b>Срок:</b> <span style="color:#fd7e14">${durationStr}</span></div>
            <div style="margin-top:10px;"><b>Причина:</b> ${linkifyReason(data.reason)}</div>

            ${historyButton}
        </div>

        <button class="ucp-modal-btn" id="closeModalBtn">Закрыть</button>
    `);

    modal.querySelector("#closeModalBtn").onclick = closeModal;

    if (banHistory.length) {
        modal.querySelector("#openHistory").onclick = () => {
            showBanHistoryModal(data.player, banHistory);
        };
    }
}

function formatDuration(duration) {
    const d = Number(duration);

    if (!d || d <= 0) return "0 дн.";
    if (d >= 9999) return "Навсегда";

    return `${d} дн.`;
}

function showBanHistoryModal(player, history = []) {
    const rows = history.length
        ? history.map(h => `
            <tr class="ucp-history-row">
                <td>${h.admin || "?"}</td>
                <td>${formatDuration(h.duration  || "")}</td>
                <td>${linkifyReason(h.reason || "")}</td>
                <td>${h.dateStr || h.date || "—"}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="5" style="text-align:center;padding:10px">История блокировок отсутсвует</td></tr>`;

    const modal = openModal(`
        <div class="ucp-modal-title">ИСТОРИЯ БЛОКИРОВОК ${player}</div>

        <div style="max-height:400px;overflow:auto">

            <table class="ucp-history-table">
                <thead>
                    <tr>
                        <th>Администратор</th>
                        <th>Срок</th>
                        <th>Причина</th>
                        <th>Дата</th>
                    </tr>
                </thead>

                <tbody>
                    ${rows}
                </tbody>
            </table>

        </div>

        <button class="ucp-modal-btn" id="closeModalBtn">Закрыть</button>
    `, 900);

    modal.querySelector("#closeModalBtn").onclick = closeModal;
}

function applyRowState(row, state) {
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

function createGoogleLink(name) {
    const a = document.createElement('a');
    a.href = `https://www.google.com/search?q=${name.replace('_', '+')}`;
    a.target = "_blank";
    a.className = "ucp-google-btn";
    a.innerText = "G";
    a.title = "Google Check";
    return a;
}

function renderAuditWidget() {
    document.getElementById("audit-widget")?.remove();

    const widget = document.createElement("div");
    widget.id = "audit-widget";

    Object.assign(widget.style, {
        position: "fixed",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#2ecc71",
        bottom: "20px",
        right: "20px",
        zIndex: 999999,
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "12px",
        userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });

    document.body.appendChild(widget);

    const panel = createAuditPanel();

    updateAuditWidget(widget);
    enableDrag(widget);
    bindAuditHover(widget, panel);
}

const ICONS = {
    success: `<svg viewBox="0 0 512 512" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="#104d2a" transform="translate(42.666667,42.666667)"><path d="M213.333333,0C95.5,0 0,95.5 0,213.333333C0,331.15 95.5,426.666667 213.333333,426.666667C331.15,426.666667 426.666667,331.15 426.666667,213.333333C426.666667,95.5 331.15,0 213.333333,0ZM213.333333,384C119.2,384 42.6667,307.44 42.6667,213.333333C42.6667,119.2 119.2,42.6667 213.333333,42.6667C307.44,42.6667 384,119.2 384,213.333333C384,307.44 307.44,384 213.333333,384ZM293.669333,137.114453L323.835947,167.281067L192,299.66912L112.916693,220.585813L143.083307,190.4192L192,239.335893L293.669333,137.114453Z"/></g></svg>`,

    warning: `<svg width="40" height="40" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g fill="#563808" transform="translate(42.666667,42.666667)"><path d="M213.333333,3.55271368e-14C330.943502,3.55271368e-14 426.666667,95.7231591 426.666667,213.333333c0,117.610169-95.723165,213.333334-213.333334,213.333334-117.610169,0-213.333333-95.723165-213.333333-213.333334C0,95.7231591 95.7231591,3.55271368e-14 213.333333,3.55271368e-14Zm0,42.6666667c-94.458743,0-170.6666663,76.2079233-170.6666663,170.6666663 0,94.458743 76.2079233,170.666667 170.6666663,170.666667 94.458743,0 170.666667-76.207924 170.666667-170.666667 0-94.458743-76.207924-170.6666663-170.666667-170.6666663Zm0,229.376001c15.238096,0 26.666667,11.264 26.666667,26.624 0,15.36-11.428571,26.624-26.666667,26.624-15.584415,0-26.666666-11.264-26.666666-26.965334 0-15.018667 11.428571-26.282666 26.666666-26.282666Zm21.333334-186.709334v149.333334H192V85.3333333h42.666667Z"/></g></svg>`,

    alarm: `<svg width="40" height="40" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g fill="#5e1f18" transform="translate(42.666667,42.666667)"><path d="M213.333333,3.55271368e-14C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333c0,117.802667-95.530667,213.333334-213.333334,213.333334-117.8026663,0-213.333333-95.530667-213.333333-213.333334C0,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14Zm0,42.6666667c-94.101333,0-170.6666663,76.5653333-170.6666663,170.6666663 0,94.101334 76.5653333,170.666667 170.6666663,170.666667 94.101334,0 170.666667-76.565333 170.666667-170.666667 0-94.101333-76.565333-170.6666663-170.666667-170.6666663Zm48.917334,91.584001 30.165333,30.165334-48.917333,48.917333 48.917333,48.917334-30.165333,30.165333-48.917334-48.917333-48.917333,48.917333-30.165334-30.165333 48.917334-48.917334-48.917334-48.917333 30.165334-30.165334 48.917333,48.917334 48.917334-48.917334Z"/></g></svg>`
};

function updateAuditWidget(widget) {
    const entries = getAuditEntries();
    const { critical, warning } = getAuditSeverity(entries);

    let type = "success";

    if (critical > 0) type = "alarm";
    else if (warning > 0) type = "warning";

    widget.style.background =
        type === "alarm" ? "#e74c3c" :
        type === "warning" ? "#f39c12" :
        "#2ecc71";

    widget.innerHTML = ICONS[type];
}

function refreshAuditWidget() {
    const widget = document.getElementById("audit-widget");
    if (widget) updateAuditWidget(widget);
}

let isDraggingWidget = false;

window.mouseX = 0;
window.mouseY = 0;

document.addEventListener("mousemove", (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});

function enableDrag(el) {
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("mousedown", (e) => {
        isDraggingWidget = true;
        document.getElementById("audit-panel")?.style.setProperty("display", "none");

        el.style.cursor = "grabbing";

        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDraggingWidget) return;

        el.style.position = "fixed";
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";

        document.getElementById("audit-panel")?.style.setProperty("display", "none");
    });

    document.addEventListener("mouseup", () => {
        isDraggingWidget = false;
        el.style.cursor = "grab";

        const panel = document.getElementById("audit-panel");

        if (panel && isWidgetHovered(el)) {
            updateAuditPanel(panel);
            positionAuditPanel(el, panel);
            panel.style.display = "block";
        }
    });
}

function createAuditPanel() {
    const panel = document.createElement("div");
    panel.id = "audit-panel";

    Object.assign(panel.style, {
        position: "fixed",
        width: "280px",
        maxHeight: "300px",
        overflowY: "auto",
        background: "#111",
        color: "#fff",
        fontSize: "12px",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "none",
        zIndex: 999999
    });

    document.body.appendChild(panel);
    return panel;
}

function positionAuditPanel(widget, panel) {
    const rect = widget.getBoundingClientRect();
    const panelWidth = 280;

    const spaceRight = window.innerWidth - rect.right;

    requestAnimationFrame(() => {
        const panelHeight = panel.offsetHeight;

        const top = rect.top + rect.height / 2 - panelHeight / 2;
        panel.style.top = `${top}px`;

        if (spaceRight > panelWidth + 20) {
            panel.style.left = `${rect.right + 10}px`;
            panel.style.right = "auto";
        } else {
            panel.style.left = "auto";
            panel.style.right = `${window.innerWidth - rect.left + 10}px`;
        }
    });
}

function updateAuditPanel(panel) {
    panel.innerHTML = "";

    const entries = getAuditEntries();

    if (!entries.length) {
        panel.innerHTML = `<div style="color:#2ecc71;font-weight:bold;text-align:center;padding:10px 0">
            Все проверки пройдены
        </div>`;
        return;
    }

    for (const [key] of entries) {
        const div = document.createElement("div");
        div.style.marginBottom = "6px";

        if (SPECIAL[key]) {
            div.style.color = SPECIAL[key].color;
            div.textContent = SPECIAL[key].text;
        } else {
            div.style.color = SEVERITY.critical.has(key)
                ? "#ff5c5c"
                : "#f1c40f";

            div.textContent = DESCRIPTIONS[key] || key;
        }

        panel.appendChild(div);
    }
}

function bindAuditHover(widget, panel) {
    const show = () => {
        if (isDraggingWidget) return;
        updateAuditPanel(panel);
        positionAuditPanel(widget, panel);
        panel.style.display = "block";
    };

    const hide = () => {
        panel.style.display = "none";
    };

    widget.addEventListener("mouseenter", show);
    widget.addEventListener("mouseleave", hide);

    panel.addEventListener("mouseenter", show);
    panel.addEventListener("mouseleave", hide);
}

function isWidgetHovered(widget) {
    const r = widget.getBoundingClientRect();
    return (
        window.mouseX >= r.left &&
        window.mouseX <= r.right &&
        window.mouseY >= r.top &&
        window.mouseY <= r.bottom
    );
}