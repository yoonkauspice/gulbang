const V = 'gulbang-v0.6';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  'base.webp','top-tunic.webp','bot-skirt.webp','bot-long.webp','bot-pants.webp','cape.webp','hat-cloche.webp','hat-beret.webp','hat-crown.webp','acc-pearls.webp','acc-gloves.webp','acc-bag.webp','acc-parasol.webp','bg-cloud.webp','bg-pink.webp','bg-garden.webp','bg-paper.webp','plate-sailor.webp','plate-rose.webp','plate-mustard.webp','plate-coral.webp','plate-flapper.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 캐시를 먼저 보여 주고, 뒤에서 새 파일을 받아 다음 실행 때 반영한다.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(V).then(async c => {
      const hit = await c.match(e.request);
      const net = fetch(e.request)
        .then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
