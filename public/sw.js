/* Only explicitly public static assets are cached. Never cache a page, auth, RSC, or API response. */
const CACHE = "engthai-public-v1";
const ASSETS = [
  "/offline.html",
  "/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("engthai-public-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin)
    return;
  if (ASSETS.includes(url.pathname) && !url.search) {
    event.respondWith(
      caches
        .open(CACHE)
        .then((cache) => cache.match(event.request))
        .then((cached) => cached || fetch(event.request)),
    );
  } else if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE).then((cache) => cache.match("/offline.html")),
      ),
    );
  }
});
