const cacheName = 'editor-cache-v1';
const cachedFiles = ['/', 'editor.js', 'style.css', 'manifest.json', 'icon.png'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(cachedFiles);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
