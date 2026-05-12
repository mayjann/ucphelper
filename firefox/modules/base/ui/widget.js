import { getAuditEntries, getAuditSeverity, SEVERITY, SPECIAL, DESCRIPTIONS } from "../audit.js";
import { ICONS } from "./constants.js";


export function renderAuditWidget() {
    document.getElementById("audit-widget")?.remove();

    const widget = document.createElement("div");
    widget.id = "audit-widget";

    Object.assign(widget.style, {
        position: "fixed",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#2ecc71",
        bottom: "20px",
        right: "20px",
        zIndex: 999999,
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "12px",
        userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
    });

    document.body.appendChild(widget);

    const panel = createAuditPanel();

    updateAuditWidget(widget);
    enableDrag(widget);
    bindAuditHover(widget, panel);
}

function updateAuditWidget(widget) {
    const entries = getAuditEntries();
    const { critical, warning } = getAuditSeverity(entries);

    let type = "success";

    if (critical > 0) type = "alarm";
    else if (warning > 0) type = "warning";

    widget.style.background =
        type === "alarm" ? "#e74c3c" :
        type === "warning" ? "#f39c12" :
        "#2ecc71";

    widget.innerHTML = ICONS[type];
}

export function refreshAuditWidget() {
    const widget = document.getElementById("audit-widget");
    if (widget) updateAuditWidget(widget);
}

let isDraggingWidget = false;

window.mouseX = 0;
window.mouseY = 0;

document.addEventListener("mousemove", (e) => {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
});

function enableDrag(el) {
    let offsetX = 0;
    let offsetY = 0;

    el.addEventListener("mousedown", (e) => {
        isDraggingWidget = true;
        document.getElementById("audit-panel")?.style.setProperty("display", "none");

        el.style.cursor = "grabbing";

        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDraggingWidget) return;

        el.style.position = "fixed";
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";

        document.getElementById("audit-panel")?.style.setProperty("display", "none");
    });

    document.addEventListener("mouseup", () => {
        isDraggingWidget = false;
        el.style.cursor = "grab";

        const panel = document.getElementById("audit-panel");

        if (panel && isWidgetHovered(el)) {
            updateAuditPanel(panel);
            positionAuditPanel(el, panel);
            panel.style.display = "block";
        }
    });
}

function createAuditPanel() {
    const panel = document.createElement("div");
    panel.id = "audit-panel";

    Object.assign(panel.style, {
        position: "fixed",
        width: "280px",
        maxHeight: "300px",
        overflowY: "auto",
        background: "#111",
        color: "#fff",
        fontSize: "12px",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "none",
        zIndex: 999999
    });

    document.body.appendChild(panel);
    return panel;
}

function positionAuditPanel(widget, panel) {
    const rect = widget.getBoundingClientRect();
    const panelWidth = 280;

    const spaceRight = window.innerWidth - rect.right;

    requestAnimationFrame(() => {
        const panelHeight = panel.offsetHeight;

        const top = rect.top + rect.height / 2 - panelHeight / 2;
        panel.style.top = `${top}px`;

        if (spaceRight > panelWidth + 20) {
            panel.style.left = `${rect.right + 10}px`;
            panel.style.right = "auto";
        } else {
            panel.style.left = "auto";
            panel.style.right = `${window.innerWidth - rect.left + 10}px`;
        }
    });
}

function updateAuditPanel(panel) {
    panel.innerHTML = "";

    const entries = getAuditEntries();

    if (!entries.length) {
        panel.innerHTML = `<div style="color:#2ecc71;font-weight:bold;text-align:center;padding:10px 0">
            Все проверки пройдены
        </div>`;
        return;
    }

    for (const [key] of entries) {
        const div = document.createElement("div");
        div.style.marginBottom = "6px";

        if (SPECIAL[key]) {
            div.style.color = SPECIAL[key].color;
            div.textContent = SPECIAL[key].text;
        } else {
            div.style.color = SEVERITY.critical.has(key)
                ? "#ff5c5c"
                : "#f1c40f";

            div.textContent = DESCRIPTIONS[key] || key;
        }

        panel.appendChild(div);
    }
}

function bindAuditHover(widget, panel) {
    const show = () => {
        if (isDraggingWidget) return;
        updateAuditPanel(panel);
        positionAuditPanel(widget, panel);
        panel.style.display = "block";
    };

    const hide = () => {
        panel.style.display = "none";
    };

    widget.addEventListener("mouseenter", show);
    widget.addEventListener("mouseleave", hide);

    panel.addEventListener("mouseenter", show);
    panel.addEventListener("mouseleave", hide);
}

function isWidgetHovered(widget) {
    const r = widget.getBoundingClientRect();
    return (
        window.mouseX >= r.left &&
        window.mouseX <= r.right &&
        window.mouseY >= r.top &&
        window.mouseY <= r.bottom
    );
}