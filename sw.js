const staticAssets = [
    './',
    './app.js',
];

self.addEventListener('install', async (event) => {
   const cache = await caches.open('app-static');
   cache.addAll(staticAssets);
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if(url.origin === location.origin){
        event.respondWith(cacheFirst(request));
    }else{
        event.respondWith(networkFirst(request));
    }
});

async function networkFirst(req) {
    const cache = await caches.open('app-static');

    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    }catch (err){
        return await caches.match(req);
    }

}

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}