import { checkCharacterName } from "./characterName.js";
import { checkCharacterNation } from "./characterNation.js";
import { watchSkinImages } from "./characterSkin.js";
import { processQuenta } from "./characterQuenta.js";


export async function runICChecks() {
    await checkCharacterName();
    await checkCharacterNation();
    await watchSkinImages();
    await processQuenta();
}