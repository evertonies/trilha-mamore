// Trilha (trilha-mamore): funciona sem internet. A página guardada é a versão CIFRADA (só abre com a senha).
const CACHE = "trilha-mamore-20261122183652";
const ARQS = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("trilha-mamore-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const pagina = r.mode === "navigate" || r.url.endsWith("index.html");
  if (pagina) {
    // página: sempre pergunta ao servidor se há versão nova (ignora a cópia de 10 min do navegador); sem internet, usa a guardada
    e.respondWith(fetch(r.url, { cache: "no-cache", credentials: "same-origin" }).then(resp => { if (!resp.ok) throw new Error("http " + resp.status); const copia = resp.clone(); caches.open(CACHE).then(c => c.put("index.html", copia)); return resp; }).catch(() => caches.match("index.html")));
  } else {
    e.respondWith(caches.match(r).then(m => m || fetch(r)));
  }
});
