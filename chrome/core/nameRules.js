import { Utils } from "./utils/index.js";


export const nickRules = [
    {
        flag: "CHARACTER_NAME_RU",
        test: Utils.isRussian,
        badge: ["РУССКИЕ БУКВЫ", "ucp-badge-red"],
        cellColor: "rgba(220, 53, 69, 0.2)",
    },
    {
        flag: "CHARACTER_NAME_MIXED_LAYOUT",
        test: Utils.checkMixedLayout,
        badge: ["СМЕШАННАЯ РАСКЛАДКА", "ucp-badge-red"],
        cellColor: "rgba(220, 53, 69, 0.2)",
    },
    {
        flag: "CHARACTER_NAME_L_I_SUSPICION",
        test: Utils.isLIObfuscation,
        badge: ["l/I ПОДОЗРЕНИЕ", "ucp-badge-orange"],
        cellColor: "rgba(253, 126, 20, 0.2)",
    },
    {
        flag: "CHARACTER_NAME_HAS_DIGITS",
        test: Utils.hasDigits,
        badge: ["ЦИФРЫ В НИКЕ", "ucp-badge-red"],
        cellColor: "rgba(220, 53, 69, 0.2)",
    },
    {
        flag: "CHARACTER_NAME_ROMAN_NUMBERS",
        test: Utils.hasRomanNumbers,
        badge: ["РИМСКИЕ ЦИФРЫ", "ucp-badge-purple"],
        cellColor: "rgba(111, 66, 193, 0.15)",
    },
    {
        flag: "CHARACTER_NAME_BAD_CASE",
        test: Utils.isBadCase,
        badge: ["КРИВОЙ РЕГИСТР", "ucp-badge-purple"],
        cellColor: "rgba(111, 66, 193, 0.15)",
    },
    {
        flag: "CHARACTER_NAME_BAD_UNDERSCORE",
        test: Utils.badUnderscore,
        badge: ["ФОРМАТ (_)", "ucp-badge-purple"],
        cellColor: "rgba(111, 66, 193, 0.15)",
    },
    {
        flag: "CHARACTER_NAME_BAD_WORDS",
        test: nick => Utils.checkBadWords(nick).has,
        badge: ["ЗАПРЕЩЕННЫЕ СЛОВА", "ucp-badge-red"],
        cellColor: "rgba(220, 53, 69, 0.2)",
    },
    {
        flag: "CHARACTER_NAME_RANDOM_LETTERS",
        test: Utils.checkRandomLetters,
        badge: ["НАБОР БУКВ", "ucp-badge-purple"],
        cellColor: "rgba(111, 66, 193, 0.15)",
    }
];