
const auditResult = Object.fromEntries(
    Object.keys(AUDIT_FLAGS).map(k => [k, false])
);

const SEVERITY = {
    critical: new Set(Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "critical")
        .map(([k]) => k)),

    warning: new Set(Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "warning")
        .map(([k]) => k))
};

const DESCRIPTIONS = Object.fromEntries(
    Object.entries(AUDIT_FLAGS).map(([k, v]) => [k, v.desc])
);

const SPECIAL = Object.fromEntries(
    Object.entries(AUDIT_FLAGS)
        .filter(([, v]) => v.severity === "special")
        .map(([k, v]) => [k, { text: v.desc, color: v.color }])
);

function setAuditFlag(key, value = true) {
    if (!(key in auditResult)) return;
    auditResult[key] = value;
    refreshAuditWidget();
}

function getAuditEntries() {
    return Object.entries(auditResult).filter(([, v]) => v);
}

function getAuditSeverity(entries) {
    let critical = 0;
    let warning = 0;

    for (const [k] of entries) {
        if (SEVERITY.critical.has(k)) critical++;
        else if (SEVERITY.warning.has(k)) warning++;
    }

    return { critical, warning };
}

