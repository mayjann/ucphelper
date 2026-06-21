export async function sendRequest({ type = 9999, countItem = 1, comment = "" }) {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("countitem[]", countItem);
    formData.append("comment", comment);

    try {
        const res = await fetch("https://admin.gambit-rp.com/requests/new", {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
        });

        const data = await res.json().catch(() => null);

        return res.ok && data?.url === "/requests";
    } catch {
        return false;
    }
}