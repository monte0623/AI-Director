const CACHE_NAME =
'ai-director-v10b-r1';

const urlsToCache = [

'./',

'./index.html',

'./css/main.css',

'./js/state.js',

'./js/db.js',

'./js/project.js',

'./js/workspace.js',

'./js/app.js'

];

self.addEventListener(

'install',

event=>{

event.waitUntil(

caches.open(
CACHE_NAME
)

.then(cache=>{

return cache.addAll(
urlsToCache
);

})

);

}

);

self.addEventListener(

'fetch',

event=>{

event.respondWith(

caches.match(
event.request
)

.then(response=>{

return response ||
fetch(
event.request
);

})

);

}

);