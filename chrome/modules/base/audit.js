import { AUDIT_FLAGS } from "../../core/auditFlags.js";
import { UI } from "./ui/index.js";


const auditResult = Object.fromEntries(
    Object.keys(AUDIT_FLAGS).map(k => [k, false])
);

export const SEVERITY = {
    critical: new Set(Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "critical")
        .map(([k]) => k)),

    warning: new Set(Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "warning")
        .map(([k]) => k))
};

export const DESCRIPTIONS = Object.fromEntries(
    Object.entries(AUDIT_FLAGS).map(([k, v]) => [k, v.desc])
);

export const SPECIAL = Object.fromEntries(
    Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "special")
        .map(([k, v]) => [k, { text: v.desc, color: v.color }])
);

export function setAuditFlag(key, value = true) {
    if (!(key in auditResult)) return;
    auditResult[key] = value;
    UI.refreshAuditWidget();
}

export function getAuditEntries() {
    return Object.entries(auditResult).filter(([, v]) => v);
}

export function getAuditSeverity(entries) {
    let critical = 0;
    let warning = 0;

    for (const [k] of entries) {
        if (SEVERITY.critical.has(k)) critical++;
        else if (SEVERITY.warning.has(k)) warning++;
    }

    return { critical, warning };
}

