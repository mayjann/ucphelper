import { UI } from "./modules/base/ui/index.js";
import { Modules } from "./modules/index.js";
import { startObserver } from "./core/observer.js";
import { initApp } from "./core/init.js";

async function checkers() {
    if (!/^\/ucp\/\d+$/.test(location.pathname)) return;

    UI.showLoader();

    try {
        await Modules.runBase();
        await Modules.runOOC();
        await Modules.runIC();

        UI.renderAuditWidget();
    } finally {
        UI.hideLoader();
    }
}

async function bootstrap() { const ok = await initApp();
    if (!ok) return;
    await checkers();
    startObserver(checkers);
}

bootstrap();