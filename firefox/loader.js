(async () => {
    await import(chrome.runtime.getURL("main.js"));
})();