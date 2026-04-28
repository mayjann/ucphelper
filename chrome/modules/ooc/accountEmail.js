function checkAccountEmail() {
    const ths = document.getElementsByTagName("th");

    for (let th of ths) {
        if (th.getAttribute("data-email-checked")) continue;
        if (!th.innerText.includes("Почта")) continue;

        const td = th.nextElementSibling;
        if (!td) continue;

        const text = td.innerText.trim();
        let hasError = false;
        let cellColor = null;

        if (text.includes("+")) {
            setAuditFlag("ACCOUNT_GMAIL_ALIAS", true);
            td.appendChild(createBadge("GMAIL ALIAS", "ucp-badge-red"));
            cellColor = "rgba(220, 53, 69, 0.2)";
            hasError = true;
        }

        const domain = text.split("@")[1];
        if (domain && disposableDomains.has(domain.toLowerCase())) {
            setAuditFlag("ACCOUNT_TEMP_EMAIL", true);
            td.appendChild(createBadge("ВРЕМЕННАЯ ПОЧТА", "ucp-badge-red"));
            if (!hasError) {
                cellColor = "rgba(220, 53, 69, 0.2)";
                hasError = true;
            }
        }

        const parts = text.split("@");
        if (parts.length > 0 && parts[0].length > 25) {
            setAuditFlag("ACCOUNT_LONG_LOCAL_PART", true);
            td.appendChild(createBadge("ПОДОЗРИТЕЛЬНАЯ ДЛИНА", "ucp-badge-brown"));
            if (!hasError) {
                cellColor = "rgba(121, 85, 72, 0.2)";
                hasError = true;
            }
        }

        if (hasError && cellColor) {
            td.style.backgroundColor = cellColor;
            td.style.transition = "background-color 0.3s ease";

            if (th.previousElementSibling) {
                th.previousElementSibling.style.backgroundColor = cellColor;
            }
        }

        th.setAttribute("data-email-checked", "true");
    }
}