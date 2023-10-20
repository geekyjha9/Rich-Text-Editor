// Cache all static resources.
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-pwa')
        .then(function(cache) {
          cache.addAll([
            '/',
            '/index.html',
            '/style.css',
            '/editor.js'
          ]);
        })
    );
  });
  
  // Serve cached resources offline.
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        })
    );
  });
  