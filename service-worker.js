const CACHE_NAME = 'space-astro-pwa-v1';
const GITHUB_PREFIX = '/space-astrophysics';

const urlsToCache = [
  `${GITHUB_PREFIX}/`,
  `${GITHUB_PREFIX}/index.html`,
  `${GITHUB_PREFIX}/manifest.json`,
  `${GITHUB_PREFIX}/icon-192.png`,
  `${GITHUB_PREFIX}/icon-512.png`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Пропускаем запросы к API
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});