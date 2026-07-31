const CACHE_NAME = 'bake-n-flake-v1';
const IMAGE_CACHE_NAME = 'bake-n-flake-images-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== IMAGE_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. API Gallery - Network First with Timeout & Cache Fallback
  if (url.pathname.startsWith('/api/gallery') || url.hostname.includes('docs.google.com')) {
    event.respondWith(
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const response = await fetch(event.request, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, response.clone());
            return response;
          }
        } catch (err) {
          // Network failed or timed out
        }
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        return new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })()
    );
    return;
  }

  // 2. Images & GIFs - Stale-While-Revalidate with Image Cache
  const isImage = 
    url.hostname.includes('ibb.co') || 
    url.hostname.includes('weserv.nl') || 
    url.hostname.includes('googleusercontent.com') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)($|\?)/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse);
            }
          }).catch(() => {});
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#fce7f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ec4899" font-family="sans-serif" font-size="18">Bake n' Flake</text></svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      })()
    );
    return;
  }

  // 3. HTML / Navigation / Core JS Assets - Network First with Cache Fallback
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 4. Other Static Assets - Cache First, Fallback to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok && event.request.url.startsWith('http')) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      });
    })
  );
});
