const CACHE_NAME = 'inclinotifier-cache-v1.0.0-rc1';

// Alla filer som behövs offline
const urlsToCache = [
  './',
  './index.html'
];

// Install event – cache app shell
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing and caching app shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating new service worker...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event – serve cached files if offline
self.addEventListener('fetch', event => {
  $("debug").innerHTML += '[SW fetch]', event.request.url;
  // Hantera bara GET-requests (superviktigt!)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {
            // Valfritt: cacha dynamiskt
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
      })
      .catch(() => {
        // Fallback endast för navigation (HTML)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});


self.addEventListener('push', (event) => {
	// PushData keys structure standar https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
	let pushData = event.data.json();
	if (!pushData || !pushData.title) {
		console.error('Received WebPush with an empty title. Received body: ', pushData);
	}
	self.registration.showNotification(pushData.title, pushData)
		.then(() => {
			// You can save to your analytics fact that push was shown
			// fetch('https://your_backend_server.com/track_show?message_id=' + pushData.data.message_id);
		});
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	if (!event.notification.data) {
		console.error('Click on WebPush with empty data, where url should be. Notification: ', event.notification)
		return;
	}
	if (!event.notification.data.url) {
		console.error('Click on WebPush without url. Notification: ', event.notification)
		return;
	}

	clients.openWindow(event.notification.data.url)
		.then(() => {
			// You can send fetch request to your analytics API fact that push was clicked
			// fetch('https://your_backend_server.com/track_click?message_id=' + pushData.data.message_id);
		});
});
