import { Utils } from "../../core/utils/index.js";
import { UI } from "../base/ui/index.js";


export async function checkAccountNickname() {
    const ths = document.getElementsByTagName("th");

    for (let th of ths) {
        if (th.getAttribute("data-nick-checked")) continue;

        if (!th.innerText.includes("Ник личного кабинета")) continue;

        const td = th.nextElementSibling;
        if (!td) continue;

        const text = td.innerText.trim();

        if (Utils.checkBadWords(text).has) {
            td.appendChild(UI.createBadge("ЗАПРЕЩЕННЫЕ СЛОВА", "ucp-badge-brown"));
            td.style.backgroundColor = "rgba(121, 85, 72, 0.2)";
            th.setAttribute("data-nick-checked", "true");
            continue;
        }

        if (Utils.checkRandomLetters(text)) {
            td.appendChild(UI.createBadge("НАБОР БУКВ", "ucp-badge-purple"));
            td.style.backgroundColor = "rgba(111, 66, 193, 0.15)";
        }
    }
}