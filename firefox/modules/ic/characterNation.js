function checkCharacterNation() {
    const nationRow = document.getElementById("nation");
    if (nationRow && !nationRow.getAttribute("data-nation-checked")) {
        const td = nationRow.querySelector("td");
        const th = nationRow.querySelector("th");
        if (td) {
            const text = td.innerText.trim();
            let badgesToAppend = [];
            let cellColor = null;
            const trashReason = checkTrashString(text);
            
            let newHtml = td.innerHTML;

            if (trashReason) {
                setAuditFlag("CHARACTER_NATION_TRASH", true);
                badgesToAppend.push(createBadge("ЗАПРЕЩЕННЫЕ СЛОВА", "ucp-badge-red"));
                cellColor = "rgba(220, 53, 69, 0.2)";
            }
            
            if (checkMixedLayout(text)) {
                setAuditFlag("CHARACTER_NATION_MIXED_LAYOUT", true);
                newHtml = highlightMixedWords(newHtml, text);
                badgesToAppend.push(createBadge("СМЕШАННАЯ РАСКЛАДКА", "ucp-badge-purple"));
            }
            
            if (/[a-zA-Z]/.test(text)) {
                setAuditFlag("CHARACTER_NATION_LATIN", true);
                badgesToAppend.push(createBadge("ЛАТИНИЦА", "ucp-badge-red"));
                if (!cellColor) cellColor = "rgba(220, 53, 69, 0.2)";
            }

            if (text.length > 4 && text === text.toUpperCase() && /[А-ЯA-Z]/.test(text)) {
                setAuditFlag("CHARACTER_NATION_CAPS_LOCK", true);
                badgesToAppend.push(createBadge("CAPS LOCK", "ucp-badge-orange"));
                if (!cellColor) cellColor = "rgba(253, 126, 20, 0.2)";
            }
            if (text.length < 3 || text.length > 30) {
                setAuditFlag("CHARACTER_NATION_INVALID_LENGTH", true);
                badgesToAppend.push(createBadge("НЕКОРРЕКТНАЯ ДЛИНА", "ucp-badge-purple"));
                if (!cellColor) cellColor = "rgba(111, 66, 193, 0.2)";
            }
            
            td.innerHTML = newHtml;
            badgesToAppend.forEach(b => td.appendChild(b));

            if (cellColor) {
                td.style.backgroundColor = cellColor;
                td.style.transition = "background-color 0.3s ease";
                if (th) th.style.backgroundColor = cellColor;
            }
        }
        nationRow.setAttribute("data-nation-checked", "true");
    }
}