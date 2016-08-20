var CACHE_NAME = "html5-qr-code-scanner-cache-v1";

var addToCache = function(request, response) {
    // Clone response stream before caching or returning it
    var responseToCache = response.clone();
    caches.open(CACHE_NAME)
        .then(function(cache) {
            // Add response to cache
            console.log("Adding response to cache: ", responseToCache);
            cache.put(request, responseToCache);
        });
};

var deleteCaches = function() {
    return caches.keys()
        .then(function(cacheNames) {
            return Promise.all(
                cacheNames.forEach(function(cacheName) {
                    if (CACHE_NAME != cacheName) {
                        console.log("Deleting cache: ", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        });    
};

var fetchRequestAndCacheResponse = function(request) {
    return fetch(request)
        .then(function(networkResponse) {
            console.log("Handling response: ", networkResponse);

            addToCache(event.request, networkResponse);

            console.log("Returning response to the browser: ", networkResponse);
            return networkResponse;
        })
        .catch(function(error) {
            console.error("Fetching failed: ", error);
            throw error;
        });    
};

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
    var response = caches
        .match(event.request)
        .then(function(cacheResponse) {
            if (cacheResponse) {
                console.log("Found matching response in cache: ", cacheResponse);
                return cacheResponse;
            }

            console.log("Fetching response from network: ", response);
            return fetchRequestAndCacheResponse(event.request);
        });

    event.respondWith(response);
});

self.addEventListener('activate', function(event) {
    // Perform activation steps
    console.log("Activating ServiceWorker");

    // Here we can clean obsolete caches
    console.log("Deleting obsolete caches");
    event.waitUntil(deleteCaches());
});