var CACHE_NAME = "html5-qr-code-scanner-cache-v1";

self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Installing ServiceWorker");

    // event.waitUntil waits till the passed promise is resolved
    // The URLs retrieval happens asynchronously so we have to wait until
    // all of them have been retrieved and results stored in cache.
    // Else ServiceWorker will be considered installed before cache is populated.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log("Opened cache ", CACHE_NAME);

                // Retrieve a passed array of URLs, and save responses in cache
                return cache.addAll([
                    "/",
                    "index.html",
                    "jsqrcode.js",
                    "https://fonts.googleapis.com/css?family=Roboto:100,400"
                ]);
            })
    );
});

self.addEventListener('fetch', function(event) {
    // Handle HTTP requests coming from the page
    console.log("Fetching " + event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    console.log("Found matching response in cache: ", response);
                    return response;
                }

                return fetch(event.request)
                    .then(function(response) {
                        console.log("Fetching response from network: ", response);
                        return response;
                    })
                    .catch(function(error) {
                        console.error("Fetching failed: ", error);
                        throw error;
                    });
            })
    );
});

self.addEventListener('activate', function(event) {
    // Perform activation steps
    console.log("Activating ServiceWorker");

    // Here we can clean obsolete caches
});