import { checkAccountEmail } from "./accountEmail.js";
import { checkAccountIPBan } from "./accountIPBan.js";
import { checkAccountNickname } from "./accountNickname.js";
import { getFirstPlayerRegDate } from "./accountRookie.js";


export async function runOOCChecks() {
    await checkAccountEmail();
    await checkAccountIPBan();
    await checkAccountNickname();
    await getFirstPlayerRegDate();
}