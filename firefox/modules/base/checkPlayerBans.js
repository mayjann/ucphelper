function applyBadges(result) {
    const tables = document.querySelectorAll("table");

    for (const table of tables) {
        const th = table.querySelector("thead th[colspan]");
        if (!th || !th.textContent.includes("Другие аккаунты")) continue;

        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            if (row.dataset.badgeProcessed) return;
            row.dataset.badgeProcessed = "true";

            const nameCell = row.querySelector("th");
            const link = nameCell?.querySelector('a[href^="/players/"]');
            if (!link) return;

            const name = link.textContent.split(" ")[0];
            const data = result[name];
            if (!data) return;

            const logs = data.logs || [];

            const activeBan = (data.punishment || []).find(p =>
                ["accban", "iban", "ban"].includes((p.type || "").toLowerCase())
            );

            const content = Array.from(nameCell.childNodes);
            nameCell.innerHTML = "";

            const wrapper = document.createElement("div");
            wrapper.className = "ucp-name-flex";

            content.forEach(node => wrapper.appendChild(node));

            if (activeBan) {
                const type = (activeBan.type || "").toLowerCase();

                const badgeMap = {
                    accban: { text: "ACCBAN", class: "ucp-tb-accban" },
                    iban:   { text: "PERMANENT", class: "ucp-tb-perm" },
                    ban:    { text: "BAN", class: "ucp-tb-temp" }
                };

                const cfg = badgeMap[type] || {
                    text: "BAN",
                    class: "ucp-tb-temp"
                };

                const bestLog = {
                    player: name,
                    admin: activeBan.admin || "?",
                    dateStr: activeBan.date || "?",
                    duration: activeBan.duration || "?",
                    reason: activeBan.reason || "Perm"
                };

                const badge = createModalBadge({
                    text: cfg.text,
                    bgClass: cfg.class,
                    mode: "ban",
                    data: bestLog,
                    history: logs
                });

                wrapper.appendChild(badge);
                applyRowState(row, "ban");
            }

            else if (logs.length) {
                const badge = createModalBadge({
                    text: "ИСТОРИЯ БЛОКИРОВОК",
                    bgClass: "ucp-tb-history",
                    mode: "history",
                    player: name,
                    history: logs
                });

                wrapper.appendChild(badge);
                applyRowState(row, "clean");
            }

            nameCell.appendChild(wrapper);
        });

        break;
    }
}

function getOtherAccountIds() {
    const tables = document.querySelectorAll("table");

    const result = [];

    for (const table of tables) {
        const th = table.querySelector("thead th[colspan]");

        if (!th) {
            continue;
        }

        if (!th.textContent.includes("Другие аккаунты")) {
            continue;
        }

        const links = table.querySelectorAll('a[href^="/players/"]');

        links.forEach(link => {
            const href = link.getAttribute("href");
            const idMatch = href.match(/\/players\/(\d+)/);

            if (!idMatch) {
                return;
            }

            const id = idMatch[1];
            const name = link.textContent.split(" ")[0];

            result.push({ [name]: id });
        });

        break;
    }

    return result;
}


async function checkOtherAccounts() {
    const accounts = getOtherAccountIds();
    const result = {};

    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    for (const acc of accounts) {
        const name = Object.keys(acc)[0];
        const id = acc[name];

        const url7510 = `https://admin.gambit-rp.com/logs/old/7510?player=${encodeURIComponent(name)}`;
        const urlPunishment = `https://admin.gambit-rp.com/players/${id}/punishment`;

        const [logs7510, punishment] = await Promise.all([
            getBanDataFromUrl(url7510, name),
            getPunishmentData(urlPunishment)
        ]);

        let hasActiveACCBan = false;
        let isGriefer = false;
        let recentBanCount = 0;

        const bans = punishment || [];

        for (const b of bans) {
            const type = (b.type || "").toLowerCase();

            if (type === "accban") {
                hasActiveACCBan = true;
            }

            if (isGrieferReason(b.reason || "")) {
                isGriefer = true;
            }

            const date = new Date(b.date);
            if (!isNaN(date)) {
                if (now - date.getTime() <= SEVEN_DAYS) {
                    recentBanCount++;
                }
            }
        }

        if (hasActiveACCBan) {
            setAuditFlag("BASE_ACCOUNT_HAS_ACTIVE_ACCBAN", true);
        }

        if (isGriefer) {
            setAuditFlag("BASE_ACCOUNT_IS_GRIEFER", true);
        }

        if (recentBanCount >= 2) {
            setAuditFlag("BASE_ACCOUNT_RECENT_BAN_STREAK", true);
        }

        result[name] = {
            logs: logs7510,
            punishment: punishment
        };
    }

    applyBadges(result);
}

const GRIEFER_PATTERNS = [
    /dm/i,
    /death\s*match/i,
    /43\s*pp|43pp/i,
    /cheat/i,
    /cheater/i,
    /soft/i,
    /14\s*pp|14pp/i
];

function isGrieferReason(reason = "") {
    return GRIEFER_PATTERNS.some(r => r.test(reason));
}