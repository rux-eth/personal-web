// Self-destroying service worker (PR-009). The pre-refactor site registered a
// workbox worker at this URL; a 404 here would NEVER unregister it (the
// Service Worker spec treats a failed script fetch as a failed update — the
// old worker stays active indefinitely). This replacement unregisters the
// registration and clears its caches on the next update check.
// RETAINED INDEFINITELY (PR-010 research, amending the original delete plan):
// never delete a once-served SW path — you don't know which visitors still
// carry the legacy registration, and a 404 strands them permanently.
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
