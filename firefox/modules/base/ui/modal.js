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

function formatDuration(duration, type = null) {
    const d = Number(duration);

    if (!d || d <= 0) {
        return "—";
    }

    if (type === "jail") {
        return `${d} мин.`;
    }

    if (d >= 9999) {
        return "Навсегда";
    }

    return `${d} дн.`;
}

function showBanHistoryModal(player, history = []) {
    const filters = [
        "all",
        "jail",
        "warn",
        "ban",
        "iban",
        "accban"
    ];

    let activeFilter = localStorage.getItem("ucp-ban-history-filter") || "all";

    const getFilteredHistory = () => {
        return activeFilter === "all"
            ? history
            : history.filter(h => h.type === activeFilter);
    };

    const renderRows = () => {
        const filtered = getFilteredHistory();

        return filtered.length
            ? filtered.map(h => `
                <tr class="ucp-history-row">
                    <td>${h.type || "?"}</td>
                    <td>${h.admin || "?"}</td>
                    <td>${formatDuration(h.duration || "", h.type)}</td>
                    <td>${linkifyReason(h.reason || "")}</td>
                    <td>${h.dateStr || h.date || "—"}</td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="5" style="text-align:center;padding:10px">
                        История блокировок отсутствует
                    </td>
                </tr>
            `;
    };

    const renderFilters = () => {
        return filters.map(type => `
            <button 
                class="ucp-history-filter ${activeFilter === type ? "active" : ""}"
                data-filter="${type}">
                ${type === "all" ? "Все" : type}
            </button>
        `).join("");
    };


    const modal = openModal(`
        <div class="ucp-modal-title">
            <h1>${player}</h1>
            <h2>ИСТОРИЯ БЛОКИРОВОК</h2>
        </div>

        <div class="ucp-history-filters">
            <div>
                ${renderFilters()}
            </div>

            <a id="historyCount">
                Всего: ${getFilteredHistory().length}
            </a>
        </div>


        <div style="max-height:400px;overflow:auto">
            <table class="ucp-history-table">
                <thead>
                    <tr>
                        <th>Тип</th>
                        <th>Администратор</th>
                        <th>Срок</th>
                        <th>Причина</th>
                        <th>Дата</th>
                    </tr>
                </thead>

                <tbody id="historyBody">
                    ${renderRows()}
                </tbody>
            </table>
        </div>

        <button class="ucp-modal-btn" id="closeModalBtn">
            Закрыть
        </button>
    `, 900);


    const updateFilterState = () => {
        modal.querySelectorAll(".ucp-history-filter")
            .forEach(btn => {
                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === activeFilter
                );
            });


        const filtered = getFilteredHistory();

        modal.querySelector("#historyBody").innerHTML = renderRows();

        modal.querySelector("#historyCount").textContent =
            `Всего: ${filtered.length}`;
    };


    modal.querySelectorAll(".ucp-history-filter")
        .forEach(btn => {
            btn.onclick = () => {
                activeFilter = btn.dataset.filter;

                localStorage.setItem(
                    "ucp-ban-history-filter",
                    activeFilter
                );

                updateFilterState();
            };
        });


    modal.querySelector("#closeModalBtn").onclick = closeModal;
}