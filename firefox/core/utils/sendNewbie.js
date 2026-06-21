export async function sendNewbie(apiKey, nickname, forum = "", oocContact = "") {
    const res = await fetch("https://g-new.ru/api/external/newbie", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nickname,
            forum,
            ooc_contact: oocContact
        })
    });

    const data = await res.json();

    return {
        status: res.status,
        ok: res.ok,
        data
    };
}