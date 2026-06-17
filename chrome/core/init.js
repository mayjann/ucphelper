import { injectStyles } from "./styles.js";
import { Utils } from "./utils/index.js";


export async function initApp() {
    await injectStyles();
    await Utils.loadDisposableDomains();
    await Utils.loadUserBadWords();
    return true;
}