importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js"
);

self.addEventListener("install", () => {
  // Prevent storing all videos we've ever used for ever
  // Finer-grained caching might be better (or even just keep them
  // in memory here and avoid caches completely...)
  console.log("Deleting existing cache");
  caches.delete("video");
});

self.addEventListener("message", (msg) => {
  if (msg.data && msg.data.blob && msg.data.source) {
    caches.open("video").then((cache) => {
      cache.put(new Request(msg.data.source), new Response(msg.data.blob));
      // Post a message back to the page, so it knows the data
      // is now in the cache at the requested URL
      clients
        .get(msg.source.id)
        .then((client) => client.postMessage({ source: msg.data.source }));
      console.log("Storing video for source", msg.data.source);
    });
  }
});

workbox.setConfig({ debug: true });
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp("__video__"),
  new workbox.strategies.CacheOnly({
    cacheName: "video",
    plugins: [
  
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
  })
);
