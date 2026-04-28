function checkCreateLimit() {
    let currentRegDate = null;
    
    const allThs = document.getElementsByTagName("th");
    for (let th of allThs) {
        if (th.innerText.includes("Дата регистрации")) {
            const parentTable = th.closest("table");
            if (parentTable && !parentTable.innerText.includes("Другие аккаунты")) {
                const dateCell = th.nextElementSibling;
                if (dateCell) currentRegDate = parseFullRegDate(dateCell.innerText);
                break;
            }
        }
    }

    for (let th of allThs) {
        if (th.innerText.includes("Другие аккаунты")) {
            const table = th.closest("table");
            if (!table || table.getAttribute("data-multi-checked")) continue;

            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                if (row.getAttribute("data-row-processed")) return;

                const cells = row.querySelectorAll("td"); 
                const regCell = cells[0]; 


                if (regCell && currentRegDate) {
                    const otherDate = parseFullRegDate(regCell.innerText);
                    if (otherDate) {
                        const diffMs = Math.abs(currentRegDate - otherDate);
                        const diffHours = diffMs / (1000 * 60 * 60);
                        
                        if (diffHours < 24) {
                            setAuditFlag("BASE_DAILY_CHARACTER_LIMIT_EXCEEDED", true);
                            row.classList.add("ucp-row-batch");
                            const warning = document.createElement("span");
                            warning.className = "ucp-batch-tag";
                            warning.innerText = "СОЗДАНИЕ ПАЧКАМИ < 24ч";
                            regCell.appendChild(warning);
                        }
                    }
                }
                
                row.setAttribute("data-row-processed", "true");
            });
        }
    }
}