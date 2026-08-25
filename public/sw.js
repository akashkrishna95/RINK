// public/sw.js
// Self-destroying service worker to clear caching issues

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach(client => {
        if (client.url) client.navigate(client.url);
      });
    });
});
