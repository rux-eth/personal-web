// Self-destroying service worker (PR-009). The pre-refactor site registered a
// workbox worker at this URL; a 404 here would NEVER unregister it (the
// Service Worker spec treats a failed script fetch as a failed update — the
// old worker stays active indefinitely). This replacement unregisters the
// registration and clears its caches on the next update check. The file
// itself is deleted in PR-010 after a deprecation window.
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', async () => {
  const keys = await caches.keys()
  await Promise.all(keys.map(key => caches.delete(key)))
  await self.registration.unregister()
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(client => client.navigate(client.url))
})
