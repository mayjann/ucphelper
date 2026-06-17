export function makeLcClickable() {
    const tables = document.querySelectorAll(
        "table.table.table-bordered"
    );

    tables.forEach(table => {
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(row => {
            const th = row.querySelector("th");
            const td = row.querySelector("td");

            if (!th || !td) return;

            const title = th.textContent.trim();


            // Вариант 1: ЛК в комментарии
            if (title === "Комментарий") {
                const text = td.innerHTML;

                const match = text.match(
                    /ЛК:\s*([A-Za-zА-Яа-яЁё0-9_]+)/i
                );

                if (!match) return;

                const lcName = match[1];

                td.innerHTML = text.replace(
                    lcName,
                    `
                    <span 
                        class="ucp-copy-lc"
                        title="Нажмите, чтобы скопировать"
                    >
                        ${lcName}
                    </span>
                    `
                );

                const button = td.querySelector(".ucp-copy-lc");

                button?.addEventListener("click", async () => {
                    await navigator.clipboard.writeText(lcName);
                });
            }


            // Вариант 2: Никнейм игрока
            if (title === "Никнейм игрока") {
                const nickname = td.textContent.trim();

                if (!nickname) return;

                td.innerHTML = `
                    <span 
                        class="ucp-copy-lc"
                        title="Нажмите, чтобы скопировать"
                    >
                        ${nickname}
                    </span>
                `;

                const button = td.querySelector(".ucp-copy-lc");

                button?.addEventListener("click", async () => {
                    await navigator.clipboard.writeText(nickname);
                });
            }
        });
    });
}