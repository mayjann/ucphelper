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


export function createModalBadge({text, bgClass, mode, data, player, history}) {
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