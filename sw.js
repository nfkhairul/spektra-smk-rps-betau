const CACHE_NAME = 'smk-rps-betau-v1';
const ASSETS = [
  '/dashboardpelajar-smk-rps-betau/',
  '/dashboardpelajar-smk-rps-betau/index.html',
  '/dashboardpelajar-smk-rps-betau/manifest.json',
  '/dashboardpelajar-smk-rps-betau/icon-192.png',
  '/dashboardpelajar-smk-rps-betau/icon-512.png',
];

// Install — cache semua aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — buang cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — guna cache dulu, fallback ke network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/dashboardpelajar-smk-rps-betau/index.html'))
  );
});
