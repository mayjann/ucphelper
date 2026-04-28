function processQuenta() {
    const quentaBlock = document.querySelector('.quenta');
    if (!quentaBlock || quentaBlock.getAttribute('data-processed')) return;

    const layers = quentaBlock.querySelectorAll('.layer.w-100');
    if (layers.length < 2) return;

    const headerTitle = layers[0].querySelector('h6');
    const contentDiv = layers[1];
    let htmlContent = contentDiv.innerHTML;
    const textContent = contentDiv.innerText;

    if (checkMixedLayout(textContent)) {
        setAuditFlag("CHARACTER_QUENTA_MIXED_LAYOUT", true);
        headerTitle.appendChild(createBadge("СМЕШАННАЯ РАСКЛАДКА", "ucp-badge-purple"));
        htmlContent = highlightMixedWords(htmlContent, textContent);
    }

    if (checkInvisibleChars(textContent)) {
        setAuditFlag("CHARACTER_QUENTA_HIDDEN_WORDS", true);
        headerTitle.appendChild(createBadge("СКРЫТЫЕ СИМВОЛЫ", "ucp-badge-red"));
    }

    const badWords = ALL_BAD_WORDS || [];
    let hasBadWords = badWords.some(word => textContent.toLowerCase().includes(word.toLowerCase()));

    if (hasBadWords) {
        if (headerTitle) {
            setAuditFlag("CHARACTER_QUENTA_BAD_WORDS", true);
            headerTitle.appendChild(createBadge("ЗАПРЕЩЕННЫЕ СЛОВА", "ucp-badge-red"));
        }   
        htmlContent = highlightBadWords(htmlContent, badWords);
    }

    const quentaCheck = checkQuentaConstructed(textContent);

    if (quentaCheck.isConstructed) {
        setAuditFlag("CHARACTER_QUENTA_CONSTRUCTOR", true);
        headerTitle.appendChild(
            createBadge("КОНСТРУКТОР КВЕНТЫ", "ucp-badge-green")
        );
    }
    
    contentDiv.innerHTML = htmlContent;
    quentaBlock.setAttribute('data-processed', 'true');
}