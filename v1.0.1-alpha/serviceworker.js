self.addEventListener('push', (event) => {
	// PushData keys structure standar https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
	let pushData = event.data.json();
	if (!pushData || !pushData.title) {
		console.error('Received WebPush with an empty title. Received body: ', pushData);
	}
/*
	self.registration.showNotification(pushData.title, pushData)
		.then(() => {
			// You can save to your analytics fact that push was shown
			// fetch('https://your_backend_server.com/track_show?message_id=' + pushData.data.message_id);
		});
*/
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

release = "v1.0.1-alpha";	//Change this whenever a update should be loaded

const cacheName = "inclinotifier_" + release;
const contentToCache = [
//	"./index.html",
//	"./qrcode_skorpi0n.github.io.png",
//	"./README.md",
//	"./android_install_app.jpg",
//	"./add-to-home-screen-safari.jpg",
//	"./",
	"./index.html",
	"./styles.css",
	"./frontend.js",
	"./lang.js",
	"./orientation.js",
	"./push.js",
	"./manifest.json",
//	"./serviceworker.js",
	"./images/",
	"./images/favicon-16x16.png",
	"./images/add-to-home-screen-chrome.jpg",
	"./images/favicon_120.png",
	"./images/apple-touch-icon.png",
	"./images/qrcode_skorpi0n.github.io.png",
	"./images/caravan-solid.svg",
	"./images/add-to-home-screen-safari.jpg",
	"./images/favicon-32x32.png",
	"./images/splashscreens/",
	"./images/splashscreens/ipad_splash.png",
	"./images/splashscreens/iphonexsmax_splash.png",
	"./images/splashscreens/ipadpro2_splash.png",
	"./images/splashscreens/iphone6_splash.png",
	"./images/splashscreens/iphoneplus_splash.png",
	"./images/splashscreens/ipadpro1_splash.png",
	"./images/splashscreens/iphone5_splash.png",
	"./images/splashscreens/iphonex_splash.png",
	"./images/splashscreens/ipadpro3_splash.png",
	"./images/splashscreens/iphonexr_splash.png",
	"./images/icons/",
	"./images/icons/favicon-16x16.png",
	"./images/icons/safari-pinned-tab.svg",
	"./images/icons/favicon.ico",
	"./images/icons/apple-touch-icon-120x120.png",
	"./images/icons/android-chrome-192x192.png",
	"./images/icons/apple-touch-icon.png",
	"./images/icons/apple-touch-icon-152x152.png",
	"./images/icons/apple-touch-icon-180x180.png",
	"./images/icons/apple-touch-icon-76x76.png",
	"./images/icons/android-chrome-512x512.png",
	"./images/icons/site.webmanifest",
	"./images/icons/mstile-150x150.png",
	"./images/icons/apple-touch-icon-60x60.png",
	"./images/icons/favicon-32x32.png"
];

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
*/

self.addEventListener("install", (e) => {
	console.log("[Service Worker] Install");

	e.waitUntil(

		(async () => {
			const cache = await caches.open(cacheName);
			console.log("[Service Worker] Caching all: app shell and content");
			await cache.addAll(contentToCache);
		})(),

	);

});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		(async () => {
			const r = await caches.match(e.request);
			console.log("[Service Worker] Fetching resource: " + e.request.url);
			if (r) {
				return r;
			}
			const response = await fetch(e.request);
			const cache = await caches.open(cacheName);
			console.log("[Service Worker] Caching new resource: " + e.request.url);
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
