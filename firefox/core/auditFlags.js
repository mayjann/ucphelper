const AUDIT_FLAGS = {
    ACCOUNT_GMAIL_ALIAS: {
        severity: "warning",
        desc: "Используется Gmail alias"
    },
    ACCOUNT_TEMP_EMAIL: {
        severity: "critical",
        desc: "Используется временная почта"
    },
    ACCOUNT_LONG_LOCAL_PART: {
        severity: "warning",
        desc: "Слишком длинный E-Mail"
    },
    ACCOUNT_IP_BAN: {
        severity: "critical",
        desc: "Имеется блокировка IP адреса"
    },
    ACCOUNT_CONTAINS_BAD_WORDS: {
        severity: "critical",
        desc: "E-Mail содержит запрещённые слова"
    },
    ACCOUNT_CONTAINS_RANDOM_LETTERS: {
        severity: "warning",
        desc: "E-Mail выглядит как случайный набор символов"
    },
    ACCOUNT_ROOKIE: {
        severity: "warning",
        desc: "Аккаунт недавно зарегистрирован (Необходима проверка на мультиаккаунт)"
    },

    CHARACTER_NAME_RU: {
        severity: "warning",
        desc: "В имени персонажа используются русские буквы"
    },
    CHARACTER_NAME_MIXED_LAYOUT: {
        severity: "warning",
        desc: "В имени персонажа используется смешанная раскладка"
    },
    CHARACTER_NAME_L_I_SUSPICION: {
        severity: "warning",
        desc: "Подозрение на L/I замену в имени персонажа"
    },
    CHARACTER_NAME_HAS_DIGITS: {
        severity: "warning",
        desc: "В имени персонажа используются цифры"
    },
    CHARACTER_NAME_ROMAN_NUMBERS: {
        severity: "warning",
        desc: "В имени персонажа используются римские цифры"
    },
    CHARACTER_NAME_BAD_CASE: {
        severity: "warning",
        desc: "Некорректный регистр имени персонажа"
    },
    CHARACTER_NAME_BAD_UNDERSCORE: {
        severity: "warning",
        desc: "В имени персонажа неправильное использование подчёркиваний"
    },
    CHARACTER_NAME_TRASH_STRING: {
        severity: "warning",
        desc: "Имя персонажа содержит мусорные символы"
    },
    CHARACTER_NAME_IS_FAMOUS: {
        severity: "warning",
        desc: "Имя персонажа совпадает с известной личностью (нужна проверка)"
    },

    CHARACTER_NATION_TRASH: {
        severity: "warning",
        desc: "Некорректное значение национальности"
    },
    CHARACTER_NATION_MIXED_LAYOUT: {
        severity: "warning",
        desc: "Смешанная раскладка в национальности"
    },
    CHARACTER_NATION_LATIN: {
        severity: "warning",
        desc: "Используется латиница в национальности"
    },
    CHARACTER_NATION_CAPS_LOCK: {
        severity: "warning",
        desc: "Используется CAPS-LOCK в национальности"
    },
    CHARACTER_NATION_INVALID_LENGTH: {
        severity: "warning",
        desc: "Некорректная длина национальности"
    },

    CHARACTER_QUENTA_MIXED_LAYOUT: {
        severity: "warning",
        desc: "В квенте используется смешанная раскладка"
    },
    CHARACTER_QUENTA_HIDDEN_WORDS: {
        severity: "warning",
        desc: "В квенте используются скрытые/замаскированные слова"
    },
    CHARACTER_QUENTA_BAD_WORDS: {
        severity: "critical",
        desc: "В квенте используются запрещённые слова"
    },
    CHARACTER_QUENTA_CONSTRUCTOR: {
        severity: "special",
        desc: "Используется конструктор квенты",
        color: "#2ecc71"
    },

    CHARACTER_SKIN_FORBIDDEN: {
        severity: "warning",
        desc: "Выбран запрещённый скин"
    },
    CHARACTER_SKIN_COLOR_MISMATCH: {
        severity: "warning",
        desc: "Имеется несоответствие цвета кожи и скина"
    },

    BASE_DAILY_CHARACTER_LIMIT_EXCEEDED: {
        severity: "warning",
        desc: "Создается второй и более персонаж за сутки"
    },
    BASE_ACCOUNT_HAS_ACTIVE_ACCBAN: {
        severity: "critical",
        desc: "На аккаунте имеется активный accban"
    },
    BASE_ACCOUNT_IS_GRIEFER: {
        severity: "critical",
        desc: "Аккаунт подозревается в вредительстве (DM/Soft)"
    },
    BASE_ACCOUNT_RECENT_BAN_STREAK: {
        severity: "critical",
        desc: "На аккаунте имеется две и более временных блокировок за последние семь дней"
    }
};