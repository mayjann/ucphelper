import { Utils } from "../../core/utils/index.js";
import { setAuditFlag } from "./audit.js";

export async function checkCreateLimit() {
    let currentRegDate = null;

    const allThs = document.getElementsByTagName("th");

    for (let th of allThs) {
        if (th.innerText.includes("Дата регистрации")) {
            const parentTable = th.closest("table");

            if (parentTable && !parentTable.innerText.includes("Другие аккаунты")) {
                const dateCell = th.nextElementSibling;

                if (dateCell) {
                    currentRegDate = Utils.parseFullRegDate(dateCell.innerText);
                }

                break;
            }
        }
    }

    if (!currentRegDate) return;

    for (let th of allThs) {
        if (!th.innerText.includes("Другие аккаунты")) continue;

        const table = th.closest("table");
        if (!table) continue;

        if (table.getAttribute("data-multi-checked")) continue;

        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            if (row.getAttribute("data-row-processed")) return;

            const thNick = row.querySelector("th");
            const tds = row.querySelectorAll("td");

            const regCell = tds[0];

            const rawNick = thNick
                ?.querySelector("a")
                ?.textContent
                ?.trim();

            const nick = rawNick?.split(" (")[0];

            if (rawNick?.includes("Отклонен")) {
                row.setAttribute("data-row-processed", "true");
                return;
            }

            if (!regCell || !currentRegDate) {
                row.setAttribute("data-row-processed", "true");
                return;
            }

            const otherDate = Utils.parseFullRegDate(regCell.innerText);
            if (!otherDate) {
                row.setAttribute("data-row-processed", "true");
                return;
            }

            const diffMs = Math.abs(currentRegDate - otherDate);
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 24) {
                setAuditFlag("BASE_DAILY_CHARACTER_LIMIT_EXCEEDED", true);

                row.classList.add("ucp-row-batch");

                const warning = document.createElement("span");
                warning.className = "ucp-batch-tag";
                warning.innerText = "СОЗДАНИЕ ПАЧКАМИ < 24ч";

                regCell.appendChild(warning);
            }

            row.setAttribute("data-row-processed", "true");
        });

        table.setAttribute("data-multi-checked", "true");
    }
}