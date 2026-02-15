// Service Worker for push notifications
declare const self: ServiceWorkerGlobalScope;

// Cache name
const CACHE_NAME = 'qamar-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline');
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Qamar Reminder';
  const options: NotificationOptions = {
    body: data.body || 'Time to reflect on your day',
    icon: '/qamar-icon.png',
    badge: '/qamar-badge.png',
    tag: 'reflection-reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: '📝 Reflect Now' },
      { action: 'close', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if window already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return (client as WindowClient).focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow('/?focus=reflection');
        }
      })
    );
  }
});

// Background sync for reflections
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-reflections') {
    event.waitUntil(
      // Fetch pending reflections and upload them
      fetch('/api/sync-reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch((err) => {
        console.log('Sync failed, will retry:', err);
        throw err;
      })
    );
  }
});

console.log('Service Worker loaded');
