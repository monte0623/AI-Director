/* ==========================================
   AI Director V10
   Build001-A
   router.js
========================================== */

const Router = (() => {

    let currentPage = "dashboardPage";

    /* ==========================
       Initialize
    ========================== */

    function init() {

        show(currentPage);

    }

    /* ==========================
       Show Page
    ========================== */

    function show(pageId) {

        document
            .querySelectorAll(".page")
            .forEach(page => {

                page.classList.remove("active");

            });

        const page = document.getElementById(pageId);

        if (page) {

            page.classList.add("active");

            currentPage = pageId;

        }

    }

    /* ==========================
       Current Page
    ========================== */

    function current() {

        return currentPage;

    }

    /* ==========================
       Dialog
    ========================== */

    function openDialog(dialogId) {

        const dialog = document.getElementById(dialogId);

        if (!dialog) return;

        dialog.classList.remove("hidden");

    }

    function closeDialog(dialogId) {

        const dialog = document.getElementById(dialogId);

        if (!dialog) return;

        dialog.classList.add("hidden");

    }

    /* ==========================
       Toggle Dialog
    ========================== */

    function toggleDialog(dialogId) {

        const dialog = document.getElementById(dialogId);

        if (!dialog) return;

        dialog.classList.toggle("hidden");

    }

    /* ==========================
       Loading
    ========================== */

    function loading(enable = true) {

        document.body.style.cursor =
            enable ? "wait" : "default";

    }

    /* ==========================
       Message
    ========================== */

    function message(text) {

        alert(text);

    }

    /* ==========================
       Confirm
    ========================== */

    function confirmBox(text) {

        return window.confirm(text);

    }

    /* ==========================
       Public API
    ========================== */

    return {

        init,

        show,

        current,

        openDialog,

        closeDialog,

        toggleDialog,

        loading,

        message,

        confirmBox

    };

})();
