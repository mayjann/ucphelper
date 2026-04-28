let firstPlayerProcessed = false;

async function getFirstPlayerRegDate() {
    if (firstPlayerProcessed) return;
    firstPlayerProcessed = true;

    try {
        let playerId = null;
        let regDate = "Новорег";
        let isNew = true;
        let displayDate = "Новорег";
        let lkValue = null;
        let oocTable = null;
        
        const tables = document.querySelectorAll('table.table.table-bordered');

        const targetTable = Array.from(tables).find(table => {
            const header = table.querySelector('th[colspan="3"]');
            return header?.textContent.includes('Другие аккаунты');
        });

        if (targetTable) {
            const firstLink = targetTable.querySelector('tbody tr:first-child th a[href^="/players/"]');
            const href = firstLink?.getAttribute('href');

            playerId = href?.match(/\/players\/(\d+)/)?.[1];
        }

        if (playerId) {
            const response = await fetch(`https://admin.gambit-rp.com/players/${playerId}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const accountBlock = Array.from(doc.querySelectorAll('div.layer.w-100.mB-10 h6.lh-1'))
                .find(h6 => h6.textContent.trim() === "Информация о личном кабинете");

            if (accountBlock) {
                const layer = accountBlock.parentElement.nextElementSibling;

                if (layer) {
                    const pList = layer.querySelectorAll('p');

                    for (const p of pList) {
                        const match = p.textContent.match(/Дата регистрации:\s*(.+)/);

                        if (match) {
                            regDate = match[1];
                            displayDate = `Дата регистрации ЛК: ${regDate}`;

                            const dateMatch = regDate.match(/(\d{2})\.(\d{2})\.(\d{4})/);

                            if (dateMatch) {
                                const [_, day, month, year] = dateMatch;
                                const reg = new Date(`${year}-${month}-${day}`);
                                const now = new Date();

                                isNew = Math.floor((now - reg) / 86400000) <= 30;
                            } else {
                                isNew = true;
                            }

                            break;
                        }
                    }
                }
            }
        } else {
            setAuditFlag("ACCOUNT_ROOKIE", true);
        }

        for (const table of tables) {
            if (!oocTable && table.querySelector('thead th[colspan="2"]')?.textContent.includes('OOC информация')) {
                oocTable = table;
            }

            if (!lkValue) {
                for (const row of table.querySelectorAll('tbody tr')) {
                    const th = row.querySelector('th');
                    const td = row.querySelector('td');

                    if (th?.textContent.trim() === 'Ник личного кабинета(ID)') {
                        lkValue = td?.textContent.trim();
                        break;
                    }
                }
            }
        }

        if (!oocTable || !lkValue) {
            return { playerId, lkValue, regDate, isNew };
        }

        for (const row of oocTable.querySelectorAll('tbody tr')) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (
                th?.textContent.trim() === 'Дата регистрации' &&
                td &&
                !td.querySelector('.ucp-request-btn')
            ) {
                td.appendChild(
                    createNewRequestButton(
                        window.location.href,
                        lkValue,
                        regDate,
                        isNew,
                        displayDate
                    )
                );
                break;
            }
        }

        return { playerId, lkValue, regDate, isNew };

    } catch (error) {
        return {
            playerId: null,
            lkValue: null,
            regDate: "Новорег",
            isNew: true
        };
    }
}