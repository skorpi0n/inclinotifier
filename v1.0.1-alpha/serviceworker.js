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

release = window.location.pathname.split("/").slice(-2, -1)[0];
release = "v1.0.1-alpha";	//Change this whenever a update should be loaded

const cacheName = "inclinotifier_" + release;
const appShellFiles = [
	"./index.html",
	"./qrcode_skorpi0n.github.io.png",
	"./README.md",
	"./android_install_app.jpg",
	"./add-to-home-screen-safari.jpg",
	"./v1.0.1-alpha/",
	"./v1.0.1-alpha/index.html",
	"./v1.0.1-alpha/styles.css",
	"./v1.0.1-alpha/frontend.js",
	"./v1.0.1-alpha/lang.js",
	"./v1.0.1-alpha/orientation.js",
	"./v1.0.1-alpha/push.js",
	"./v1.0.1-alpha/manifest.json",
	"./v1.0.1-alpha/serviceworker.js",
	"./v1.0.1-alpha/images/",
	"./v1.0.1-alpha/images/favicon-16x16.png",
	"./v1.0.1-alpha/images/add-to-home-screen-chrome.jpg",
	"./v1.0.1-alpha/images/favicon_120.png",
	"./v1.0.1-alpha/images/apple-touch-icon.png",
	"./v1.0.1-alpha/images/qrcode_skorpi0n.github.io.png",
	"./v1.0.1-alpha/images/caravan-solid.svg",
	"./v1.0.1-alpha/images/add-to-home-screen-safari.jpg",
	"./v1.0.1-alpha/images/favicon-32x32.png",
	"./v1.0.1-alpha/images/splashscreens/",
	"./v1.0.1-alpha/images/splashscreens/ipad_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphonexsmax_splash.png",
	"./v1.0.1-alpha/images/splashscreens/ipadpro2_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphone6_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphoneplus_splash.png",
	"./v1.0.1-alpha/images/splashscreens/ipadpro1_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphone5_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphonex_splash.png",
	"./v1.0.1-alpha/images/splashscreens/ipadpro3_splash.png",
	"./v1.0.1-alpha/images/splashscreens/iphonexr_splash.png",
	"./v1.0.1-alpha/images/icons/",
	"./v1.0.1-alpha/images/icons/favicon-16x16.png",
	"./v1.0.1-alpha/images/icons/safari-pinned-tab.svg",
	"./v1.0.1-alpha/images/icons/favicon.ico",
	"./v1.0.1-alpha/images/icons/apple-touch-icon-120x120.png",
	"./v1.0.1-alpha/images/icons/android-chrome-192x192.png",
	"./v1.0.1-alpha/images/icons/apple-touch-icon.png",
	"./v1.0.1-alpha/images/icons/apple-touch-icon-152x152.png",
	"./v1.0.1-alpha/images/icons/apple-touch-icon-180x180.png",
	"./v1.0.1-alpha/images/icons/apple-touch-icon-76x76.png",
	"./v1.0.1-alpha/images/icons/android-chrome-512x512.png",
	"./v1.0.1-alpha/images/icons/site.webmanifest",
	"./v1.0.1-alpha/images/icons/mstile-150x150.png",
	"./v1.0.1-alpha/images/icons/apple-touch-icon-60x60.png",
	"./v1.0.1-alpha/images/icons/favicon-32x32.png",
];


self.addEventListener("install", (e) => {
	console.log("[Service Worker] Install");
	e.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName);
			console.log("[Service Worker] Caching all: app shell and content");
			$("debug").innerHTML += "[Service Worker] Caching all: app shell and content";
			await cache.addAll(contentToCache);
		})(),
	);
});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			console.log("[Service Worker] Fetching resource: " + e.request.url);
			$("debug").innerHTML += "[Service Worker] Fetching resource: " + e.request.url;
			if (r) {
				return r;
			}
			const response = await fetch(e.request);
			const cache = await caches.open(cacheName);
			console.log("[Service Worker] Caching new resource: " + e.request.url);
			$("debug").innerHTML += "[Service Worker] Caching new resource: " + e.request.url;
			cache.put(e.request, response.clone());
			return response;
		})(),
	);
});

self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key === cacheName) {
						return;
					}
					return caches.delete(key);
				}),
			);
		}),
	);
});


/*
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open("v1")
			.then((cache) =>
				cache.addAll([
					"/",
					"/index.html",
					"/style.css",
					"/app.js",
					"/image-list.js",
					"/star-wars-logo.jpg",
					"/img/img1.jpg",
					"/img/img2.jpg",
					"/img/img3.jpg",
				]),
			),
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// caches.match() always resolves
			// but in case of success response will have value
			if (response !== undefined) {
				return response;
			}
			else {
				return fetch(event.request)
				.then((response) => {
					// response may be used only once
					// we need to save clone to put one copy in cache
					// and serve second one
					let responseClone = response.clone();
			
					caches.open("v1").then((cache) => {
						cache.put(event.request, responseClone);
					});
					return response;
				})
				.catch(() => caches.match("/img/img1.jpg"));
			}
		}),
	);
});
*/