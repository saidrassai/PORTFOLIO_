// Enhanced Service Worker with advanced caching strategies
const CACHE_VERSION = '1.3.0'
const STATIC_CACHE_NAME = `portfolio-static-v${CACHE_VERSION}`
const DYNAMIC_CACHE_NAME = `portfolio-dynamic-v${CACHE_VERSION}`
const IMAGE_CACHE_NAME = `portfolio-images-v${CACHE_VERSION}`
const FONT_CACHE_NAME = `portfolio-fonts-v${CACHE_VERSION}`

// Cache durations (in milliseconds)
const CACHE_DURATIONS = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 7 * 24 * 60 * 60 * 1000,  // 7 days
  images: 14 * 24 * 60 * 60 * 1000,  // 14 days
  fonts: 365 * 24 * 60 * 60 * 1000   // 1 year
}

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
  '/models-optimized/connector.glb'
]

// Resource patterns for different caching strategies
const CACHE_PATTERNS = {
  static: /\.(js|css|html)$/,
  images: /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
  fonts: /\.(woff|woff2|ttf|eot)$/,
  models: /\.(glb|gltf|obj|fbx)$/
}

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Precaching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
        // Preload critical fonts - updated approach to avoid 404s
      caches.open(FONT_CACHE_NAME).then((cache) => {
        console.log('🔤 Font cache ready (fonts will be cached on demand)')
        // Don't preload specific font URLs since they can change
        // Instead, let them be cached when requested
      })
    ]).then(() => {
      console.log('✅ Service Worker installation complete')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        const deletePromises = cacheNames
          .filter(cacheName => 
            cacheName.startsWith('portfolio-') && 
            !cacheName.includes(CACHE_VERSION)
          )
          .map(cacheName => {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
        
        return Promise.all(deletePromises)
      }),
      
      // Take control of all open tabs immediately
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated and controlling all tabs')    })
  )
})

// Advanced fetch event with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // Skip data URLs and blob URLs (used by Vite dev server)
  if (url.protocol === 'data:' || url.protocol === 'blob:') {
    return
  }
  
  // Skip Vite dev server HMR and module requests in development
  if (url.pathname.includes('/@') || url.pathname.includes('/.vite/') || url.pathname.includes('/__vite')) {
    return
  }
  
  // Skip service worker requests (prevent self-interception)
  if (url.pathname.includes('sw.js')) {
    return
  }

  // Determine caching strategy based on resource type
  if (CACHE_PATTERNS.static.test(url.pathname)) {
    // Cache First strategy for static assets (JS, CSS, HTML)
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else if (CACHE_PATTERNS.images.test(url.pathname)) {
    // Cache First strategy for images with longer TTL
    event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME))
  } else if (CACHE_PATTERNS.fonts.test(url.pathname) || url.hostname.includes('fonts.gstatic.com')) {
    // Cache First strategy for fonts with very long TTL
    event.respondWith(cacheFirst(request, FONT_CACHE_NAME))
  } else if (CACHE_PATTERNS.models.test(url.pathname)) {
    // Cache First strategy for 3D models
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  } else if (url.pathname.includes('/tech-icons-optimized/')) {
    // Cache First for optimized tech icons
    event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME))
  } else {
    // Network First strategy for everything else
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME))
  }
})

// Cache First strategy implementation
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Check if cache is still fresh
      const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0)
      const now = new Date()
      const maxAge = getCacheMaxAge(cacheName)
      
      if (now - cacheDate < maxAge) {
        console.log('📦 Serving from cache:', request.url)
        return cachedResponse
      }
    }
      // Fetch from network and update cache
    console.log('🌐 Fetching from network:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone()
      
      // Add cache timestamp and ensure correct MIME types
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-date', new Date().toISOString())
      
      // Enforce correct MIME types based on file extension
      const url = new URL(request.url)
      const pathname = url.pathname.toLowerCase()
      
      if (pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8')
      } else if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8')
      } else if (pathname.endsWith('.woff2')) {
        headers.set('Content-Type', 'font/woff2')
      } else if (pathname.endsWith('.woff')) {
        headers.set('Content-Type', 'font/woff')
      }
      
      const responseWithHeaders = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, responseWithHeaders)
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache First failed:', error)
    
    // Try to serve stale cache as fallback
    const cache = await caches.open(cacheName)
    const staleResponse = await cache.match(request)
    
    if (staleResponse) {
      console.log('⚠️ Serving stale cache:', request.url)
      return staleResponse
    }
    
    throw error
  }
}

// Network First strategy implementation
async function networkFirst(request, cacheName) {
  try {
    console.log('🌐 Network First for:', request.url)
    const networkResponse = await fetch(request)
      if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      const responseToCache = networkResponse.clone()
      
      // Add cache timestamp and ensure correct MIME types
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-date', new Date().toISOString())
      
      // Enforce correct MIME types based on file extension
      const url = new URL(request.url)
      const pathname = url.pathname.toLowerCase()
      
      if (pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8')
      } else if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8')
      } else if (pathname.endsWith('.woff2')) {
        headers.set('Content-Type', 'font/woff2')
      } else if (pathname.endsWith('.woff')) {
        headers.set('Content-Type', 'font/woff')
      }
      
      const responseWithHeaders = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, responseWithHeaders)
    }
    
    return networkResponse
  } catch (error) {
    console.log('📦 Network failed, trying cache:', request.url)
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Get cache max age based on cache name
function getCacheMaxAge(cacheName) {
  if (cacheName.includes('static')) return CACHE_DURATIONS.static
  if (cacheName.includes('images')) return CACHE_DURATIONS.images
  if (cacheName.includes('fonts')) return CACHE_DURATIONS.fonts
  return CACHE_DURATIONS.dynamic
}

// Background sync for failed requests (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(
        // Handle background sync logic here
        console.log('🔄 Background sync triggered')
      )
    }
  })
}

// Push notification handling (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log('📱 Push notification received:', data)
    
    // Handle push notifications
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/vite.svg',
        badge: '/vite.svg'
      })
    )
  }
})

// Message handling for cache updates and skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⚡ Skipping waiting...')
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    console.log('📦 Caching URLs on demand...')
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls)
      })
    )
  }
})

// Network First strategy for HTML (SPA routing)
async function networkFirstHTML(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // For SPA routing, always return index.html on navigation failure
    const cache = await caches.open(STATIC_CACHE_NAME)
    const indexResponse = await cache.match('/index.html')
    
    if (indexResponse) {
      return indexResponse
    }
    
    // Fallback to network index.html
    return fetch('/index.html')
  }
}
