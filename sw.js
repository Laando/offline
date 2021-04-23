// var cacheName = 'LaanDo';
const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';
var filesToCache = [
  '/',
  '/offline/index.html',
  '/offline/css/style.css',
  '/offline/js/main.js'
];

/* Start the service worker and cache all of the app's content */
// self.addEventListener('install', function(e) {
//   e.waitUntil(
//     caches.open(staticCacheName).then(function(cache) {
//       return cache.addAll(filesToCache);
//     })
//   );
// });

/* Serve cached content when offline */
// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log(staticCacheName);
      console.log('Khoi tao thanh cong');
      cache.addAll(filesToCache);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('Xay dung');
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  // console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      console.log('fetch event', evt);
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          if(filesToCache.includes(evt.request.url))
            cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    })
  );
});