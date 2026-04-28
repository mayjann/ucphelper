function checkAccountIPBan() {
    const bTags = document.getElementsByTagName("b");

    for (let b of bTags) {
        const text = b.innerText;

        const match = text.match(/IP\s+"([^"]+)"\s+BANNED BY\s+(\S+)\s+REASON:\s*(.+)/i);
        if (!match) continue;
        setAuditFlag("ACCOUNT_IP_BAN", true);

        const ip = match[1];
        const admin = match[2].toLowerCase();
        const reason = match[3];

        const newText = `IP "${ip}" Заблокирован администратором ${admin}. Причина: ${reason}`;

        showBanPopup(newText);

        if (!b.getAttribute("data-processed")) {
            b.innerText = newText;
            b.className = "ucp-alert-ban";
            b.setAttribute("data-processed", "true");
        }
    }
}