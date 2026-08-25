// public/sw.js
// Service Worker for RINK KSUM Website (Images Cache Only)

const IMAGE_CACHE_NAME = 'rink-image-cache-v1';

// Only pre-cache static logo/banner images immediately on install
const PRECACHE_IMAGES = [
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
    caches.open(IMAGE_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_IMAGES).catch((err) => {
        console.warn('[Service Worker] Pre-cache images loading error:', err);
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
          // Delete all caches except the image cache to clear out old HTML/JS/CSS assets
          if (cacheName !== IMAGE_CACHE_NAME) {
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

  // Skip chrome-extension, internal webpack, API, or non-http requests
  if (!event.request.url.startsWith('http')) return;
  if (url.pathname.includes('/_next/') || url.pathname.includes('/api/')) return;

  const isLocalImage = url.pathname.startsWith('/images/') || 
                       url.pathname.endsWith('.png') || 
                       url.pathname.endsWith('.webp') || 
                       url.pathname.endsWith('.jpg') || 
                       url.pathname.endsWith('.jpeg') || 
                       url.pathname.endsWith('.svg');
                       
  const isGoogleImage = url.hostname.includes('googleusercontent.com') || 
                        url.hostname.includes('drive.google.com');

  // Handle local and remote images using a Stale-While-Revalidate caching strategy
  if (isLocalImage || isGoogleImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Fetch updated image from network and update cache in the background
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  cache.put(event.request, networkResponse);
                }
              })
              .catch(() => {});
            return cachedResponse;
          }

          // Not in cache, fetch from network and cache it
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
  // All other assets (HTML, JS, CSS, fonts) fall back to native browser network request dynamically
});
