export const NOTIFY_SOUNDS = [
    { file: "sound1.mp3", name: "Мелодия 1" },
    { file: "sound2.mp3", name: "Мелодия 2" },
    { file: "sound3.mp3", name: "Мелодия 3" },
    { file: "sound4.mp3", name: "Мелодия 4" },
    { file: "sound5.mp3", name: "Мелодия 5" },
    { file: "sound6.mp3", name: "Мелодия 6" },
    { file: "sound7.mp3", name: "Мелодия 7" }
];

export const DEFAULT_SETTINGS = {
    useTemplates: true,
    autoUpdateUcpTab: true,
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

export async function initDefaults(storage) {

    const defaultsToSet = {};

    if (storage.templates === undefined)
        defaultsToSet.templates = DEFAULT_SETTINGS.templates;

    if (storage.useTemplates === undefined)
        defaultsToSet.useTemplates = DEFAULT_SETTINGS.useTemplates;

    if (storage.autoUpdateUcp === undefined)
        defaultsToSet.autoUpdateUcp = DEFAULT_SETTINGS.autoUpdateUcp;

    if (storage.autoUpdateUcpTimeout === undefined)
        defaultsToSet.autoUpdateUcpTimeout = DEFAULT_SETTINGS.autoUpdateUcpTimeout;
	
	if (storage.autoUpdateOnlySound === undefined)
        defaultsToSet.autoUpdateOnlySound = DEFAULT_SETTINGS.autoUpdateOnlySound;
	
	if (storage.AutoUpdateNotifySoundVolume === undefined)
        defaultsToSet.AutoUpdateNotifySoundVolume = DEFAULT_SETTINGS.AutoUpdateNotifySoundVolume;
	
	if (storage.quietHoursEnabled === undefined)
        defaultsToSet.quietHoursEnabled = DEFAULT_SETTINGS.quietHoursEnabled;
	
	if (storage.quietHours === undefined)
        defaultsToSet.quietHours = DEFAULT_SETTINGS.quietHours;
	
	if (storage.quietEnabled === undefined)
        defaultsToSet.quietEnabled = DEFAULT_SETTINGS.quietEnabled;

    if (storage.ppTemplate === undefined)
        defaultsToSet.ppTemplate = DEFAULT_SETTINGS.ppTemplate;

    if (Object.keys(defaultsToSet).length > 0) {
        await browser.storage.sync.set(defaultsToSet);
    }
}