import * as StringChecks from "./stringChecks.js";
import * as QuentaChecks from "./quenta.js";
import * as DateChecks from "./date.js";
import * as WikiChecks from "./wiki.js";
import * as DomainChecks from "./domains.js";
import * as BadWords from "./badWords.js";
import * as sendNewbie from "./sendNewbie.js";
import * as sendRequest from "./sendRequest.js";


export class Utils {
    static checkBadWords = StringChecks.checkBadWords;
    static checkRandomLetters = StringChecks.checkRandomLetters;
    static checkMixedLayout = StringChecks.checkMixedLayout;
    static checkInvisibleChars = StringChecks.checkInvisibleChars;
    static isRussian = StringChecks.isRussian;
    static isLIObfuscation = StringChecks.isLIObfuscation;
    static hasDigits = StringChecks.hasDigits;
    static hasRomanNumbers = StringChecks.hasRomanNumbers;
    static isBadCase = StringChecks.isBadCase;
    static badUnderscore = StringChecks.badUnderscore;
    static checkQuentaConstructed = QuentaChecks.checkQuentaConstructed;
    static parseFullRegDate = DateChecks.parseFullRegDate;
    static checkCelebrityWiki = WikiChecks.checkCelebrityWiki;
    static loadDisposableDomains = DomainChecks.loadDisposableDomains;
    static loadUserBadWords = BadWords.loadUserBadWords;
    static sendNewbie = sendNewbie.sendNewbie;
    static sendRequest = sendRequest.sendRequest;
}
