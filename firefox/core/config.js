const CURRENT_VERSION = "2.2";
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/h1ghwayW/ucphelper/main/version.json";
const UPDATE_URL = "https://mirror.enotixa.ru/info";

const FORBIDDEN_SKINS = new Set([
		16, 27, 61, 70, 71, 80, 81, 92, 99, 149, 163, 164, 165, 166, 167, 205, 255, 260, 264
]);

const BASE_BAD_WORDS = [
    "admin", "gambit", "kurwa", "mama", "server", "trahal", "ehal", "sucker",
    "bitch", "pidor", "azov", "mq",
    "админ", "гамбит", "курва", "мама", "сервер", "трахал", "сосал",
    "сука", "пидор", "хуй", "уебан", "хохол", "рецепт", "чурка", "пидр"
];

const BLACK_SKINS = new Set([
		4, 5, 7, 9, 10, 13, 14, 15, 17, 18, 19, 21, 22, 24, 25, 28, 35, 36, 65, 66,
		67, 76, 79, 83, 84, 102, 103, 104, 105, 106, 107, 134, 136, 139, 142, 143, 144, 156, 168, 176,
		180, 182, 183, 190, 195, 215, 218,  220, 221, 222, 238, 244, 245, 256, 253, 269, 293, 296, 297
]);

let ALL_BAD_WORDS = [...BASE_BAD_WORDS];

let disposableDomains = new Set();

let banAlertShown = false;

const NOTIFY_SOUNDS = [
    { file: "sound1.mp3", name: "Мелодия 1" },
    { file: "sound2.mp3", name: "Мелодия 2" },
    { file: "sound3.mp3", name: "Мелодия 3" },
    { file: "sound4.mp3", name: "Мелодия 4" },
    { file: "sound5.mp3", name: "Мелодия 5" },
    { file: "sound6.mp3", name: "Мелодия 6" },
    { file: "sound7.mp3", name: "Мелодия 7" }
];

const DEFAULT_SETTINGS = {
    useTemplates: true,
    useCustomTemplates: false,
	autoUpdateUcp: false,
	autoUpdateUcpTab: true,
	autoUpdateUcpTimeout: 300,
	autoUpdateOnlySound: false,
	AutoUpdateNotifySound: NOTIFY_SOUNDS[1].file,
	AutoUpdateNotifySoundVolume: 75,
	quietHoursEnabled: false,
	quietHours: { from: "23:00", to: "08:00" },
	quietEnabled: false,
    templates: {
        6: 'Пожалуйста, не используйте имя знаменитостей',
        10: 'Пожалуйста, перепиши квенту: укажи слабые/сильные стороны, страхи, хобби и развлечения и другое',
        11: 'Не используйте сокращенные русские имена, смените их на полные. К примеру: "Миша" - "Михаил"',
        17: 'Запрещено регистрировать больше одного персонажа в сутки',
        18: 'Никнейм нарушает правила сервера или в нем допущена ошибка. Проверьте никнейм',
        19: 'Одобрение через форумную жалобу на мое имя: https://forum.gambit-rp.com/forums/64',
        20: 'Квента соответствует нестандартному персонажу, который требует одобрения на форуме'
    },
    customTemplates: {},
    ppTemplate: `Ссылка на UCP: {{ucpLink}}
ЛК: {{lk}}

Новорег, прошу проверить на 26пп`
};