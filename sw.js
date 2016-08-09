self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Installing ServiceWorker");
});

self.addEventListener('fetch', function(event) {
    // Handle HTTP requests coming from the page
    console.log("Fetching " + event.request);
    event.respondWith(fetch(event.request));
});

self.addEventListener('activate', function(event) {
    // Perform activation steps
    console.log("Activating ServiceWorker");

    // Here we can clean obsolete caches
});