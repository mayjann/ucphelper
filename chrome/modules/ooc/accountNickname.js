function checkAccountNickname() {
    const ths = document.getElementsByTagName("th");

    for (let th of ths) {
        if (th.getAttribute("data-nick-checked")) continue;

        if (!th.innerText.includes("Ник личного кабинета")) continue;

        const td = th.nextElementSibling;
        if (!td) continue;

        const text = td.innerText.trim();

        const reason = checkTrashString(text);
        if (reason) {
            td.appendChild(createBadge(reason, "ucp-badge-brown"));
            td.style.backgroundColor = "rgba(121, 85, 72, 0.2)";
        }

        th.setAttribute("data-nick-checked", "true");
    }
}