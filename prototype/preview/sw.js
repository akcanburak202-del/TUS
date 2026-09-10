"use strict";

// The portable build replaces CACHE_VERSION with its complete asset hash.
const CACHE_VERSION = "preview-v1";
const CACHE_NAME = "tus-preview-shell::" + self.registration.scope + "::" + CACHE_VERSION;
const SHELL = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./icon.svg",
  "../session-core.js", "../session-store.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.resolve());
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "CHECK_OFFLINE" || !event.ports[0]) return;
  const reply = event.ports[0];
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.all(SHELL.map((item) => {
    return cache.match(new URL(item, self.location.href).href);
  }))).then((matches) => {
    reply.postMessage({ ready: matches.every(Boolean) });
  }).catch(() => reply.postMessage({ ready: false })));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    if (event.request.mode === "navigate") {
      return cache.match(new URL("./index.html", self.location.href).href);
    }
    return cache.match(event.request).then((cached) => cached || fetch(event.request));
  }));
});
