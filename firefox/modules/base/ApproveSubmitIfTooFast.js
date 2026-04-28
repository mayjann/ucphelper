function hideApproveSubmitIfTooFast () {
    const approveRadio = document.querySelector('input#yes[name="status"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    const approveLabel = document.querySelector('label[for="yes"]');

    if (!approveRadio || !submitBtn || !approveLabel) return;

    const pageOpenedAt = Date.now();
    const MIN_TIME = 30 * 1000;

    const textSpan = approveLabel.querySelector(".peer.peer-greed");
    if (!textSpan) return;

    const timerEl = document.createElement("span");
    timerEl.style.marginLeft = "8px";
    timerEl.style.color = "#ff6b6b";
    timerEl.style.fontSize = "12px";
    timerEl.style.whiteSpace = "nowrap";

    textSpan.appendChild(timerEl);

    function update() {
        const elapsed = Date.now() - pageOpenedAt;
        const remaining = MIN_TIME - elapsed;
        const approveSelected = approveRadio.checked;

        if (approveSelected) {
            if (remaining > 0) {
                submitBtn.style.display = "none";

                const sec = Math.ceil(remaining / 1000);

                timerEl.textContent = `Одобрить можно через ${sec}с`;

                requestAnimationFrame(update);
            } else {
                submitBtn.style.display = "";
                timerEl.textContent = "";
            }
        } else {
            submitBtn.style.display = "";
            timerEl.textContent = "";
        }
    }

    approveRadio.addEventListener("change", update);

    const otherRadio = document.querySelector('input#no[name="status"]');
    if (otherRadio) {
        otherRadio.addEventListener("change", update);
    }

    update();
}