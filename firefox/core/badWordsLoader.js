async function loadUserBadWords() {
    try {
        const result = await browser.storage.sync.get("userBadWords");
        const userWords = Array.isArray(result.userBadWords) ? result.userBadWords : [];
        
        ALL_BAD_WORDS = [...BASE_BAD_WORDS, ...userWords];
    } catch (e) {
        console.error("Не удалось загрузить пользовательские слова:", e);
    }
}
