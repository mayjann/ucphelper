import { runBaseChecks } from "./base/index.js";
import { runICChecks } from "./ic/index.js";
import { runOOCChecks } from "./ooc/index.js";


export class Modules {
    static runBase() { return runBaseChecks(); }
    static runIC() { return runICChecks(); }
    static runOOC() { return runOOCChecks(); }
}