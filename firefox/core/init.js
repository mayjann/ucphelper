async function initApp() {
    await injectStyles();
    await loadDisposableDomains();
    await loadUserBadWords();

    return true;
}