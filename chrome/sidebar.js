import { loadSection } from "./options/options.js";

const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('mainWrapper');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainWrapper.classList.toggle('shifted');
});

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 992) {
        sidebar.classList.add('collapsed');
        mainWrapper.classList.add('shifted');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-nav a");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            const section = link.textContent.trim().toLowerCase();

            switch (section) {
                case "уведомления":
                    loadSection("options/html/notify-settings.html");
                    break;

                case "запрещённые слова":
                    loadSection("options/html/badwords.html");
                    break;

                case "шаблоны":
                    loadSection("options/html/templates.html");
                    break;
            }
        });
    });
});