// public/sw.js
// Service Worker for RINK KSUM Website

const CACHE_NAME = 'rink-static-cache-v1';
const IMAGE_CACHE_NAME = 'rink-image-cache-v1';

// Assets to pre-cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/images/favicon.png',
  '/images/ksum-favicon.svg',
  '/images/ksum-logo.svg',
  '/images/rink-logo.svg',
  '/images/rink-3d-logo.webp',
  '/images/romi-avatar.webp',
  '/images/home-hero-bg.webp',
  '/images/tech-hero-bg.webp',
  '/images/funds/funds_banner.png',
  '/images/funds/randd_grant.png',
  '/images/programs/hero.png',
  '/rink-pc-bg.png',
  '/rink-phone-bg.png',
  '/placeholder.svg',
  '/placeholder-user.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch block on addAll to prevent one missing file from breaking the whole install
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-cache assets loading error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome-extension, internal webpack, or non-http requests
  if (!event.request.url.startsWith('http')) return;
  if (url.pathname.includes('/_next/webpack-hmr') || url.pathname.includes('/api/')) return;

  const isLocalImage = url.pathname.startsWith('/images/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg') || url.pathname.endsWith('.svg');
  const isGoogleImage = url.hostname.includes('googleusercontent.com') || url.hostname.includes('drive.google.com');

  // Handle local and remote images
  if (isLocalImage || isGoogleImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Stale-while-revalidate for images to keep cache updated
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  cache.put(event.request, networkResponse);
                }
              })
              .catch(() => {});
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle local CSS, JS, and web fonts
  const isStaticAsset = 
    url.pathname.includes('/fonts/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf');

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});
