import { initTemplateWatcher } from "./autoTemplates.js";
import { checkCreateLimit } from "./checkCreateLimit.js";
import { checkOtherAccounts } from "./checkPlayerBans.js";

export async function runBaseChecks() {
    await initTemplateWatcher();
    await checkCreateLimit();
    await checkOtherAccounts();
}