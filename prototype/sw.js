'use strict';
const PREFIX='tus-shell:'+self.registration.scope+':';
const CACHE=PREFIX+'v1';
const ASSETS=['./','./index.html','./style.css','./core.js','./app.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));});
