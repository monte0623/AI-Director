/* ==========================================
   AI Director V10
   Build001-A
   app.js
========================================== */

"use strict";

const App = (() => {

    function init() {

        console.log("================================");
        console.log(" AI Director V10");
        console.log(" Build001-A");
        console.log("================================");

        Router.init();

        ProjectWorkspace.init();

        registerServiceWorker();

    }

    /* ==========================
       Service Worker
    ========================== */

    function registerServiceWorker() {

        if (!("serviceWorker" in navigator)) {

            return;

        }

        window.addEventListener("load", async () => {

            try {

                await navigator.serviceWorker.register("sw.js");

                console.log("Service Worker Registered");

            } catch (error) {

                console.error(error);

            }

        });

    }

    return {

        init

    };

})();

/* ==========================
   Application Start
========================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        App.init();

    }

);
