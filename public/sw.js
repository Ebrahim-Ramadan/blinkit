self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // Do nothing - let all requests go through normally
})
