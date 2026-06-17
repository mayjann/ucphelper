export const FORBIDDEN_SKINS = new Set([
		16, 27, 61, 70, 71, 80, 81, 92, 99, 149, 163, 164, 165, 166, 167, 205, 255, 260, 264
]);

export const BASE_BAD_WORDS = [
    "admin", "gambit", "kurwa", "mama", "server", "trahal", "ehal", "sucker",
    "bitch", "pidor", "azov", "mq",
    "админ", "гамбит", "курва", "мама", "сервер", "трахал", "сосал",
    "сука", "пидор", "хуй", "уебан", "хохол", "рецепт", "чурка", "пидр"
];

export const BLACK_SKINS = new Set([
		4, 5, 7, 9, 10, 13, 14, 15, 17, 18, 19, 21, 22, 24, 25, 28, 35, 36, 65, 66,
		67, 76, 79, 83, 84, 102, 103, 104, 105, 106, 107, 134, 136, 139, 142, 143, 144, 156, 168, 176,
		180, 182, 183, 190, 195, 215, 218,  220, 221, 222, 238, 244, 245, 256, 253, 269, 270, 271, 293, 296, 297
]);

export let ALL_BAD_WORDS = [...BASE_BAD_WORDS];

export const disposableDomains = new Set();

let banAlertShown = false;