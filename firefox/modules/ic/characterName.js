import { UI } from "../base/ui/index.js";
import { Utils } from "../../core/utils/index.js";
import { setAuditFlag } from "../base/audit.js";
import { nickRules } from "../../core/nameRules.js";


export async function checkCharacterName() {
    const nameRow = document.getElementById("name");
    if (!nameRow || nameRow.dataset.nickChecked) return;

    const codeTag = nameRow.querySelector("td code");
    if (!codeTag) return;

    const nick = codeTag.innerText.trim();

    codeTag.classList.add("ucp-mono-font", "ucp-clickable-nick");
    codeTag.title = "Нажми, чтобы скопировать";

    codeTag.onclick = () => {
        navigator.clipboard.writeText(nick).then(() => {
            codeTag.style.animation = "copySuccess 0.4s ease";
            setTimeout(() => codeTag.style.animation = "", 400);
        });
    };

    codeTag.after(UI.createGoogleLink(nick));

    Utils.checkCelebrityWiki(nick).then(link => {
        if (link) {
            setAuditFlag("CHARACTER_NAME_IS_FAMOUS", true);
            codeTag.after(UI.createBadge("CELEB (WIKI)", "ucp-badge-blue", link));
        }
    });

    for (const rule of nickRules) {
            const nick="lan_Connor";
        const res = rule.test(nick);

        if (!res) continue;

        if (rule.flag) {
            setAuditFlag(rule.flag, true);
        }

        const [text, cls] = rule.dynamic
            ? rule.badge(res)
            : rule.badge;

        const badge = UI.createBadge(text, cls);

        codeTag.after(badge);

        if (rule.cellColor) {
            const td = codeTag.closest("td");
            const th = document.querySelector("th[data-nick-checked]")?.closest("tr")?.querySelector("th");

            if (td) {
                td.style.backgroundColor = rule.cellColor;
                td.style.transition = "background-color 0.3s ease";
            }

            if (th) {
                th.style.backgroundColor = rule.cellColor;
            }
        }
    }

    nameRow.dataset.nickChecked = "true";
}