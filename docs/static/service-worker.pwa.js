// static/service-worker.pwa.js - App Shell + runtime cache
const CACHE_NAME = 'toeic-app-shell-v1';
const APP_SHELL = ['/', '/quiz/part5', '/quiz/part6', '/static/main.js', '/static/main6.js', '/static/idb.js', '/static/pack_loader.rel.js', '/static/manifest.json'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))); self.clients.claim(); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (APP_SHELL.includes(url.pathname)) {
    e.respondWith(caches.match(e.request).then(r=>r || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
