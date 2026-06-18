import { BASE_BAD_WORDS, ALL_BAD_WORDS } from "../config.js";

export async function loadUserBadWords() {
    try {
        const result = await chrome.storage.sync.get("userBadWords");
        const userWords = Array.isArray(result.userBadWords) ? result.userBadWords : [];

        ALL_BAD_WORDS.length = 0;
        ALL_BAD_WORDS.push(...BASE_BAD_WORDS, ...userWords);

    } catch (e) {
        console.error("Не удалось загрузить пользовательские слова:", e);
    }
}