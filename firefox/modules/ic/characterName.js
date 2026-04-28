function checkCharacterName() {
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

    codeTag.after(createGoogleLink(nick));

    checkCelebrityWiki(nick).then(isFamous => {
        if (isFamous) {
            setAuditFlag("CHARACTER_NAME_IS_FAMOUS", true);
            codeTag.after(createBadge("CELEB (WIKI)", "ucp-badge-blue"));
        }
    });

    for (const rule of nickRules) {
        const res = rule.test(nick);

        if (!res) continue;

        if (rule.flag) {
            setAuditFlag(rule.flag, true);
        }

        if (rule.dynamic) {
            const [text, cls] = rule.badge(res);
            codeTag.after(createBadge(text, cls));
        } else {
            const [text, cls] = rule.badge;
            codeTag.after(createBadge(text, cls));
        }
    }

    nameRow.dataset.nickChecked = "true";
}