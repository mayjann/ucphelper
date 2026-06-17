import { ALL_BAD_WORDS } from "../config.js";


export function checkBadWords(str) {
    if (!str) {
        return {
            has: false,
            words: []
        };
    }

    const lower = str.toLowerCase();
    const found = [];

    for (const word of ALL_BAD_WORDS) {
        if (lower.includes(word.toLowerCase())) {
            found.push(word);
        }
    }

    return {
        has: found.length > 0,
        words: found
    };
}

export function checkRandomLetters(str) {
    const s = str.toLowerCase();

    const lettersOnly = s.replace(/[^a-zа-яё]/gi, "");

    if (lettersOnly.length < 5) return false;

    if (/[bcdfghjklmnpqrstvwxzбвгджзйклмнпрстфхцчшщ]{5,}/i.test(lettersOnly)) {
        return true;
    }

    const vowels = lettersOnly.match(/[aeiouаеёиоуыэюя]/gi) || [];
    if (lettersOnly.length > 7 && vowels.length <= 1) {
        return true;
    }

    if (/([a-zа-яё])\1{3,}/i.test(lettersOnly)) {
        return true;
    }

    return false;
}

export function checkMixedLayout(str) {
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

export function checkInvisibleChars(str) {
    return /[\u200B\u200C\u200D\u2060\uFEFF]/.test(str);
}

export function isRussian(nick) {
    return /[а-яА-ЯёЁ]/.test(nick);
}

export function isLIObfuscation(nick) {
    return /(^|_)[lI](?=[a-zA-Z]|$)/.test(nick) || /l.*I|I.*l/.test(nick);
}

export function hasDigits(nick) {
    return /\d/.test(nick);
}

export function hasRomanNumbers(nick) {
    return /_([IVXLCDM]+)$/.test(nick);
}

export function isBadCase(nick) {
    const parts = nick.split("_");

    if (parts.length < 2) return true;

    const [first, second] = parts;

    const isCapitalized = (s) =>
        s && s[0] === s[0].toUpperCase();

    return !(isCapitalized(first) && isCapitalized(second));
}

export function badUnderscore(nick) {
    const underscores = (nick.match(/_/g) || []).length;
    return underscores === 0 || underscores > 2;
}