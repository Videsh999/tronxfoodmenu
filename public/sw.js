// Tronx Customer Service Worker (Safe Shell & Offline Fallback)
const CACHE_NAME = 'tronx-customer-v1';
const PRECACHE_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Tronx SW] Pre-cache non-fatal error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1. Never intercept non-GET requests (checkout, orders, auth)
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // 2. Never cache or intercept Supabase, Razorpay, Cloudinary, or non-HTTP calls
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('razorpay') ||
    url.hostname.includes('cloudinary') ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // 3. For SPA page navigations: Network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/') || new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tronx — Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#FFF5EC;color:#241416;font-family:sans-serif;text-align:center;padding:50px 20px;"><h1 style="font-size:28px;color:#602E31;letter-spacing:2px;">TRONX</h1><p style="color:#7E6568;">You appear to be offline. Reconnect to browse the live culinary collection or check your order status.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // 4. For static assets (scripts, styles, images): Stale-while-revalidate or Network-first
  event.respondWith(
    caches.match(req).then((cached) => {
      const networked = fetch(req).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, cloned));
        }
        return response;
      }).catch(() => cached);

      return cached || networked;
    })
  );
});
