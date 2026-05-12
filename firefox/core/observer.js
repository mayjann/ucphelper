export function startObserver(checkers) {
    let lastRun = 0;
    const COOLDOWN = 60 * 1000;

    const isIgnored = (node) =>
        node?.closest?.("#audit-widget") ||
        node?.closest?.("#audit-panel") ||
        node?.closest?.(".ucp-name-flex") ||
        node?.closest?.(".ucp-modal-overlay") ||
        node?.matches?.(".ucp-name-flex") ||
        node?.matches?.(".ucp-modal-overlay") ||
        node?.querySelector?.(".ucp-name-flex") ||
        node?.querySelector?.(".ucp-modal-overlay");

    const observer = new MutationObserver((mutations) => {
        const now = Date.now();

        if (now - lastRun < COOLDOWN) return;

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {

                if (!(node instanceof HTMLElement)) continue;

                if (isIgnored(node)) continue;

                lastRun = now;

                checkers();
                return;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}