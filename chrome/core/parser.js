async function getBanDataFromUrl(url, playerName) {
    const res = await fetch(url, { credentials: "include" });
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const rows = doc.querySelectorAll("table tbody tr");
    const bans = [];

    rows.forEach(row => {
        const admin = row.children[0]?.textContent.trim();
        const actionText = row.children[1]?.textContent.trim();
        const date = row.children[3]?.textContent.trim();

        if (!actionText) return;

        const isGiveAction = actionText.includes("выдал ban");

        if (!isGiveAction) return;

        const playerMatch = actionText.match(/игроку\s+([A-Za-z0-9_]+)/i);
        if (!playerMatch) return;

        const targetPlayer = playerMatch[1];

        if (targetPlayer !== playerName) return;

        const durationMatch = actionText.match(/Срок наказания:\s*([0-9]+)/i);
        const duration = durationMatch ? durationMatch[1] : null;
        
        if (!duration) return;

        let type = "ban";

        if (duration === "2147483647" || duration === "2145917100") {
            type = "iban";
        }

        if (actionText.includes("accban")) {
            type = "accban";
        }

        const reasonMatch = actionText.match(/Причина:\s*(.+)$/i);
        const reason = reasonMatch ? reasonMatch[1].trim() : null;

        bans.push({
            type,
            admin,
            duration,
            reason,
            date
        });
    });

    return bans;
}

async function getPunishmentData(url) {
    const res = await fetch(url, { credentials: "include" });
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const result = [];

    const hasActiveBan = !!doc.querySelector("#ban.issetpunishment");

    if (hasActiveBan) {
        const rows = doc.querySelectorAll("table tbody tr");

        rows.forEach(row => {
            const text = row.children[0]?.textContent.trim();
            if (!text) return;

            let type = null;

            if (text.includes("забанил ЛК")) {
                type = "accban";
            } else if (text.includes("забанил на 2147483647")) {
                type = "iban";
            } else if (text.includes("забанил на 2145917100")) {
                type = "iban";
            } else if (text.includes("забанил на")) {
                type = "ban";
            }

            if (!type) return;

            const adminMatch = text.match(/Администратор\s+(.+?)\s+(забанил|выдал)/i);
            const admin = adminMatch ? adminMatch[1].trim() : null;

            const durationMatch = text.match(/на\s+(\d+)/i);
            const duration = durationMatch ? durationMatch[1] : null;

            let reason = null;
            const reasonMatch = text.match(/Причина:\s*(.+)/i);
            if (reasonMatch) {
                reason = reasonMatch[1]
                    .replace(/\(\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}\)/, '')
                    .trim();
            }

            const dateMatch = text.match(/\((\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2})\)/);
            const date = dateMatch ? dateMatch[1] : null;

            result.push({
                type,
                admin,
                duration,
                reason,
                date,
            });
        });
    }

    return result;
}