const V = "td-202611221327";
const CORE = ["./", "index.html", "data/course.json", "data/emoji.json", "manifest.webmanifest", "icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("td-") && k !== V && k !== "td-audio").map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes("/audio/")) {
    e.respondWith(caches.open("td-audio").then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  // 画面とデータ：ネットが使えれば新しいものを、だめなら保存したものを
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(res => { if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(e.request, copy)); } return res; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
