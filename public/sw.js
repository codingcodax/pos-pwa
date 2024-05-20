self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-cache").then((cache) => {
      return cache.addAll(["/"]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open("offline-cache").then((cache) => cache.match("/")),
      ),
    );
  }
});
