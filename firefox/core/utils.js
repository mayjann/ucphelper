function checkTrashString(str) {
    if (!str) return null;
    const lower = str.toLowerCase();
    for (let word of ALL_BAD_WORDS) {
        if (lower.includes(word)) {
            setAuditFlag("ACCOUNT_CONTAINS_BAD_WORDS", true);
            return `СОДЕРЖИТ "${word.toUpperCase()}"`;
        }
    }
    if (/(?:[bcdfghjklmnpqrstvwxz]{5,})/i.test(str)) {
        setAuditFlag("ACCOUNT_CONTAINS_RANDOM_LETTERS", true);
        return "НАБОР БУКВ";
    }
    return null;
}

function loadDisposableDomains() {
    return fetch("https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf")
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(text => {
            text.split("\n").forEach(d => {
                const domain = d.trim().toLowerCase();
                if (domain) disposableDomains.add(domain);
            });

        })
        .catch(() => {});
}

function parseFullRegDate(str) {
    if (!str) return null;
    const partsFull = str.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (partsFull) {
        return new Date(partsFull[3], partsFull[2]-1, partsFull[1], partsFull[4], partsFull[5], partsFull[6]);
    }
    const parts = str.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return parts ? new Date(parts[3], parts[2]-1, parts[1]) : null;
}

function parseMskToEpoch(dateStr) {
    if (!dateStr) return 0;
    const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!parts) return 0;
    const day = parts[1];
    const month = parts[2];
    const year = parts[3];
    const hour = parts[4] || "00";
    const min = parts[5] || "00";
    const sec = parts[6] || "00";
    const isoString = `${year}-${month}-${day}T${hour}:${min}:${sec}+03:00`;
    return Date.parse(isoString);
}

function getCurrentMoscowEpoch() {
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return utc + (3600000 * 3);
}

function checkMixedLayout(str) {
    const words = str.match(/[a-zA-Zа-яА-ЯёЁ]+/g) || [];
    for (let word of words) {
        const hasLat = /[a-zA-Z]/.test(word);
        const hasCyr = /[а-яА-ЯёЁ]/.test(word);
        if (hasLat && hasCyr) return true;
        
        if (word.length === 1) {
            const contextLat = (str.match(/[a-zA-Z]/g) || []).length;
            const contextCyr = (str.match(/[а-яА-ЯёЁ]/g) || []).length;
            if (contextCyr > contextLat && hasLat) return true;
            if (contextLat > contextCyr && hasCyr) return true;
        }
    }
    return false;
}

async function checkCelebrityWiki(name) {
    const searchName = name.replace('_', ' ');
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchName)}&format=json&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.query && data.query.search && data.query.search.length > 0) {
            const firstResult = data.query.search[0].title;
            if (firstResult.toLowerCase() === searchName.toLowerCase()) return true;
        }
    } catch (e) {}
    return false;
}

function checkInvisibleChars(str) {
    return /[\u200B\u200C\u200D\u2060\uFEFF]/.test(str);
}

function checkQuentaConstructed(text) {
    const parts = [
        "полноценной семье",
        "неполной семье",
        "неблагополучной семье",
        "без родителей",

        "подростковый период проходил спокойно",
        "дорогие подарки",
        "подрабатывал",
        "уличной жизни",

        "престижную, высокооплачиваемую работу",
        "успеха в своей нише",
        "примерным семьянином со средним достатком",
        "преследовали финансовые трудности",

        "на вещества или ввязался",
        "как преступник",
        "государственных структур"
    ];

    const normalized = text.toLowerCase();

    let matches = 0;
    const found = [];

    for (const part of parts) {
        if (normalized.includes(part)) {
            matches++;
            found.push(part);
        }
    }

    return {
        isConstructed: matches >= 2,
        matches,
        found
    };
}