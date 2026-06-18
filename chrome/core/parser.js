export async function getBanDataFromUrl(url, playerName) {
    const bans = [];

    let currentPage = 1;
    let maxPage = 1;


    async function parsePage(pageUrl, pageNumber) {
        const res = await fetch(pageUrl, {credentials: "include"});

        const html = await res.text();

        const doc = new DOMParser()
            .parseFromString(html, "text/html");

        const pageBans = [];

        const rows = doc.querySelectorAll("table tbody tr");

        rows.forEach(row => {
            const admin = row.children[0]?.textContent.trim();
            const actionText = row.children[1]?.textContent.trim();
            const date = row.children[3]?.textContent.trim();

            if (!actionText) return;

            const isGiveAction =
                actionText.includes("выдал ban") ||
                actionText.includes("выдал accban") ||
                actionText.includes("выдал jail") ||
                actionText.includes("выдал warn");

            if (!isGiveAction) return;

            const playerMatch = actionText.match(
                /игроку\s+([A-Za-z0-9_]+)/i
            );

            if (!playerMatch) return;

            if (playerMatch[1] !== playerName) return;

            const durationMatch = actionText.match(/Срок наказания:\s*([0-9]+)/i);

            const duration = durationMatch ? durationMatch[1] : null;

            if (!duration && !actionText.includes("warn")) {
                return;
            }

            let type = "ban";

            if (actionText.includes("jail")) {
                type = "jail";
            }

            if (actionText.includes("warn")) {
                type = "warn";
            }

            if (duration === "2147483647" || duration === "2145917100") {
                type = "iban";
            }

            if (actionText.includes("accban")) {
                type = "accban";
            }

            const reasonMatch = actionText.match(/Причина:\s*(.+)$/i);

            const reason = reasonMatch ? reasonMatch[1].trim() : null;

            const punishment = {
                type,
                admin,
                duration,
                reason,
                date
            };

            pageBans.push(punishment);
            bans.push(punishment);
        });

        const pages = [
            ...doc.querySelectorAll(
                ".dataTables_paginate a.paginate_button"
            )
        ]
            .map(a => Number(a.textContent.trim()))
            .filter(Number.isInteger);

        const detectedMax = Math.max(
            ...pages,
            1
        );

        if (detectedMax > maxPage) {
            maxPage = detectedMax;
        }
    }



    while (currentPage <= maxPage) {
        const pageUrl = new URL(url);

        if (currentPage > 1) {
            pageUrl.searchParams.set(
                "page",
                currentPage
            );
        }

        await parsePage(
            pageUrl.href,
            currentPage
        );

        currentPage++;
    }

    return bans;
}

export async function getPunishmentData(url) {
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

            } else if (
                text.includes("выдал jail") ||
                text.includes("посадил в jail")
            ) {
                type = "jail";

            } else if (
                text.includes("выдал warn") ||
                text.includes("предупредил")
            ) {
                type = "warn";

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