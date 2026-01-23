// Empty Service Worker to resolve 404 errors from dependencies or browsers
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    // No-op
});
