const nickRules = [
    {
        flag: "CHARACTER_NAME_RU",
        test: nick => /[а-яА-ЯёЁ]/.test(nick),
        badge: ["РУССКИЕ БУКВЫ", "ucp-badge-red"]
    },
    {
        flag: "CHARACTER_NAME_MIXED_LAYOUT",
        test: checkMixedLayout,
        badge: ["СМЕШАННАЯ РАСКЛАДКА (FAKE)", "ucp-badge-red"]
    },
    {
        flag: "CHARACTER_NAME_L_I_SUSPICION",
        test: nick => /[a-z]I/.test(nick) || /^l/.test(nick) || (nick.includes('l') && nick.includes('I')),
        badge: ["l/I ПОДОЗРЕНИЕ", "ucp-badge-orange"]
    },
    {
        flag: "CHARACTER_NAME_HAS_DIGITS",
        test: nick => /\d/.test(nick),
        badge: ["ЦИФРЫ В НИКЕ", "ucp-badge-red"]
    },
    {
        flag: "CHARACTER_NAME_ROMAN_NUMBERS",
        test: nick => /_([IVXLCDM]+)$/.test(nick),
        badge: ["РИМСКИЕ ЦИФРЫ", "ucp-badge-purple"]
    },
    {
        flag: "CHARACTER_NAME_BAD_CASE",
        test: nick => {
            const regDouble = /^[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+$/;
            const regTriple = /^[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+$/;
            return !(regDouble.test(nick) || regTriple.test(nick));
        },
        badge: ["КРИВОЙ РЕГИСТР", "ucp-badge-purple"]
    },
    {
        flag: "CHARACTER_NAME_BAD_UNDERSCORE",
        test: nick => {
            const underscores = (nick.match(/_/g) || []).length;
            const regTriple = /^[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+_[A-Z][a-zA-Z]+$/;
            return underscores === 0 || (underscores > 1 && !regTriple.test(nick));
        },
        badge: ["ФОРМАТ (_)", "ucp-badge-purple"]
    },
    {
        flag: "CHARACTER_NAME_TRASH_STRING",
        test: checkTrashString,
        badge: result => [result, "ucp-badge-brown"],
        dynamic: true
    }
];