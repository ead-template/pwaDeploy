// Defina alguns recursos para armazenar em cache
const CACHE_NAME = 'ead-cache'
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/main.js',
  // Adicione outros recursos que você quer armazenar em cache
]

// Evento para instalar o service worker e armazenar os recursos no cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Evento para buscar os recursos, tentando primeiro a rede e, em seguida, o cache
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Se a resposta for bem-sucedida, clonamos e armazenamos no cache
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(function () {
        // Se falhar a busca na rede, tentamos buscar no cache
        return caches.match(event.request).then(function (response) {
          if (response) {
            return response
          }
          // Se não estiver no cache, você pode retornar um fallback ou um erro
          // Por exemplo: return caches.match('/fallback.html');
        })
      }),
  )
})
