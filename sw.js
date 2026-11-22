// Trilha (trilha-mamore): funciona sem internet. A página guardada é a versão CIFRADA (só abre com a senha).
const CACHE = "trilha-mamore-20261122180508";
const ARQS = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("trilha-mamore-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const pagina = r.mode === "navigate" || r.url.endsWith("index.html");
  if (pagina) {
    // página: tenta a versão nova na rede; sem internet, usa a guardada
    e.respondWith(fetch(r).then(resp => { const copia = resp.clone(); caches.open(CACHE).then(c => c.put("index.html", copia)); return resp; }).catch(() => caches.match("index.html")));
  } else {
    e.respondWith(caches.match(r).then(m => m || fetch(r)));
  }
});
