export function checkQuentaConstructed(text) {
    const parts = [
        "полноценной семье",
        "неполной семье",
        "неблагополучной семье",
        "без родителей",

        "подростковый период проходил спокойно",
        "дорогие подарки",
        "подрабатывал",
        "уличной жизни",

        "престижную, высокооплачиваемую работу",
        "успеха в своей нише",
        "примерным семьянином со средним достатком",
        "преследовали финансовые трудности",

        "на вещества или ввязался",
        "как преступник",
        "государственных структур"
    ];

    const normalized = text.toLowerCase();

    let matches = 0;
    const found = [];

    for (const part of parts) {
        if (normalized.includes(part)) {
            matches++;
            if (matches > 2) return true;
        }
    }

    return false;
}