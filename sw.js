/* ==========================================
   AI Director V10
   Build001-A
   Service Worker
========================================== */

const CACHE_NAME = "ai-director-v10-build001a";

const CACHE_FILES = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/main.css",
    "./css/layout.css",
    "./css/project.css",

    "./js/app.js",
    "./js/router.js",
    "./js/storage.js",
    "./js/project/project.js"

];

/* ==========================
   Install
========================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(CACHE_FILES);

            })

    );

    self.skipWaiting();

});

/* ==========================
   Activate
========================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});

/* ==========================
   Fetch
========================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {

        return;

    }

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        const responseClone =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            });

                        return networkResponse;

                    })

                    .catch(() => {

                        return caches.match("./index.html");

                    });

            })

    );

});
