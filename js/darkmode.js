/* =========================================================
   ENGI HUB | Global Dark Mode
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       Find button
       ===================================================== */

    const darkModeBtn =
        document.getElementById("darkModeBtn");


    /* =====================================================
       Apply saved theme
       ===================================================== */

    function applySavedTheme() {

        const savedMode =
            localStorage.getItem("darkMode");

        if (savedMode === "enabled") {

            document.body.classList.add("dark-mode");

        } else {

            document.body.classList.remove("dark-mode");

        }

        updateButton();

    }


    /* =====================================================
       Update button icon
       ===================================================== */

    function updateButton() {

        if (!darkModeBtn) {
            return;
        }

        const isDark =
            document.body.classList.contains("dark-mode");

        darkModeBtn.textContent =
            isDark ? "☀️" : "🌙";

        darkModeBtn.setAttribute(
            "aria-label",
            isDark
                ? "เปลี่ยนเป็นโหมดสว่าง"
                : "เปลี่ยนเป็นโหมดมืด"
        );

        darkModeBtn.setAttribute(
            "title",
            isDark
                ? "เปลี่ยนเป็นโหมดสว่าง"
                : "เปลี่ยนเป็นโหมดมืด"
        );

    }


    /* =====================================================
       Toggle theme
       ===================================================== */

    function toggleDarkMode() {

        const isDark =
            document.body.classList.toggle("dark-mode");


        if (isDark) {

            localStorage.setItem(
                "darkMode",
                "enabled"
            );

        } else {

            localStorage.setItem(
                "darkMode",
                "disabled"
            );

        }


        updateButton();

    }


    /* =====================================================
       Initialize
       ===================================================== */

    applySavedTheme();


    if (darkModeBtn) {

        darkModeBtn.addEventListener(
            "click",
            toggleDarkMode
        );

    }


})();