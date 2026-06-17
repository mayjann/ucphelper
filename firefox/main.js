import { UI } from "./modules/base/ui/index.js";
import { Modules } from "./modules/index.js";
import { startObserver } from "./core/observer.js";
import { initApp } from "./core/init.js";

async function checkers() {
    const isUcpPage = /^\/ucp\/\d+$/.test(location.pathname);
    const isRequestPage = location.pathname.startsWith("/requests");

    if (!isUcpPage && !isRequestPage) return;

    const needLoader = isUcpPage;

    try {
        if (needLoader) {
            UI.showLoader();
        }

        if (isUcpPage) {
            await Modules.runBase();
            await Modules.runOOC();
            await Modules.runIC();

            UI.renderAuditWidget();
        }

        if (isRequestPage) {
            UI.makeLcClickable();
        }

    } finally {
        if (needLoader) {
            UI.hideLoader();
        }
    }
}

async function bootstrap() { const ok = await initApp();
    if (!ok) return;
    await checkers();
    startObserver(checkers);
}

bootstrap();