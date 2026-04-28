async function validateSkin(img, isUcpPage = true) {
    if (!img || !img.src.includes("/skins/")) return;

    const match = img.src.match(/skins\/(\d+)\.(png|jpg|jpeg)/i);
    if (!match || !match[1]) return;

    const skinId = parseInt(match[1], 10);

    const isSkinAllowed = !FORBIDDEN_SKINS.has(skinId);

    let skinColor = null;

	const colorRow = document.querySelector("tr#color");
	if (colorRow) {
		const valueTd = colorRow.querySelector("td");
		if (valueTd) skinColor = valueTd.textContent.trim();
	}

    let isColorOk = null;
    if (skinColor) {
        const isDarkSelection = /чернокожий|темнокожий/i.test(skinColor);
        const isLightSelection = /светлокожий|белокожий/i.test(skinColor);
        const isBlack = BLACK_SKINS.has(skinId);

        if (isDarkSelection) isColorOk = isBlack;
        else if (isLightSelection) isColorOk = !isBlack;
    }

    const forbidden = !isSkinAllowed || (isColorOk === false);

	img.classList.remove("ucp-skin-forbidden", "ucp-skin-allowed");
	
    if (!isSkinAllowed) {
        setAuditFlag("CHARACTER_SKIN_FORBIDDEN", true);
    }

    if (isColorOk === false) {
        setAuditFlag("CHARACTER_SKIN_COLOR_MISMATCH", true);
    }

    if (forbidden) {
        img.classList.add("ucp-skin-forbidden");
    } else if (isUcpPage) {
        img.classList.add("ucp-skin-allowed");
    }

    const skinText = isSkinAllowed ? `Скин ID ${skinId} разрешен` : `Скин ID ${skinId} запрещен`;
	const colorText = isColorOk ? "Цвет кожи соответствует" : "Цвет кожи не соответствует";

    img.title = `${skinText}\n${colorText}`;
}

function watchSkinImages() {
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (!mutation.addedNodes) continue;
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'IMG' && node.src.includes("/skins/")) {
                    validateSkin(node);
                }

                node.querySelectorAll && node.querySelectorAll('img').forEach(img => {
                    if (img.src.includes("/skins/")) validateSkin(img);
                });
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('img[src*="/skins/"]').forEach(img => {
        validateSkin(img);
    });
}