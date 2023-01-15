// Define сache names.
workbox.core.setCacheNameDetails({ prefix: 'dcms-cache' })

// Precaching
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

// all the api request which matches the following pattern will cache
workbox.routing.registerRoute(
  /http:\/\/dcms\.local\/api/,
  new workbox.strategies.CacheFirst(),
)
