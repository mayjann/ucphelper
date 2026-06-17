let loader = null;

export function showLoader(text = "Подождите, пока UCP Helper завершит аудит...") {
    if (loader) return;

    loader = document.createElement("div");
    loader.className = "ucp-loader";
    loader.innerHTML = `
        <div class="ucp-loader-backdrop">
            <div class="ucp-loader-content">
                <div class="ucp-loader-spinner"></div>
                <div class="ucp-loader-text">${text}</div>
            </div>
        </div>
    `;

    document.body.appendChild(loader);
}

export function hideLoader() {
    loader?.remove();
    loader = null;
}