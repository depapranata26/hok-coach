const CACHE='hok-coach-v2';
const CORE=['./','./index.html','./engine.js','./manifest.json','./data/heroes.json','./data/items.json','./data/arcana.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(e.request.method==='GET'&&res.ok){caches.open(CACHE).then(c=>c.put(e.request,res.clone()));}return res;}).catch(()=>caches.match('./index.html'))));});
