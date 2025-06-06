/**
 * Service Worker registration utility
 * Handles registration, updates, and user notifications
 */

interface ServiceWorkerAPI {
  register: () => Promise<ServiceWorkerRegistration | undefined>
  unregister: () => Promise<boolean>
  checkForUpdates: () => Promise<void>
}

class ServiceWorkerManager implements ServiceWorkerAPI {
  private registration: ServiceWorkerRegistration | null = null
  private isUpdateAvailable = false

  /**
   * Register the service worker
   */
  async register(): Promise<ServiceWorkerRegistration | undefined> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported')
      return undefined
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      this.registration = registration
      console.log('Service Worker registered successfully:', registration.scope)

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.isUpdateAvailable = true
              this.notifyUpdateAvailable()
            }
          })
        }
      })

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when new service worker takes control
        if (this.isUpdateAvailable) {
          window.location.reload()
        }
      })

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return undefined
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        const result = await registration.unregister()
        console.log('Service Worker unregistered:', result)
        return result
      }
      return true
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update()
        console.log('Service Worker update check completed')
      } catch (error) {
        console.error('Service Worker update check failed:', error)
      }
    }
  }

  /**
   * Notify user that an update is available
   */
  private notifyUpdateAvailable(): void {
    // You can customize this notification method
    console.log('New version available! Refresh to update.')
    
    // Optional: Show a custom notification banner
    this.showUpdateBanner()
  }

  /**
   * Show update banner (optional)
   */
  private showUpdateBanner(): void {
    // Create a simple update banner
    const banner = document.createElement('div')
    banner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #4F46E5;
        color: white;
        padding: 12px;
        text-align: center;
        z-index: 10000;
        font-family: system-ui, sans-serif;
        font-size: 14px;
      ">
        <span>New version available!</span>
        <button 
          onclick="this.parentElement.parentElement.style.display='none'; window.location.reload()" 
          style="
            margin-left: 12px;
            background: white;
            color: #4F46E5;
            border: none;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
          "
        >
          Refresh
        </button>
        <button 
          onclick="this.parentElement.parentElement.style.display='none'" 
          style="
            margin-left: 8px;
            background: transparent;
            color: white;
            border: 1px solid white;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          Later
        </button>
      </div>
    `
    
    document.body.appendChild(banner)
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (banner.parentElement) {
        banner.style.display = 'none'
      }
    }, 10000)
  }

  /**
   * Skip waiting and activate new service worker immediately
   */
  skipWaiting(): void {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }
}

// Create singleton instance
const swManager = new ServiceWorkerManager()

// Auto-register service worker when module loads
if (import.meta.env.PROD) {
  // Register service worker in production
  swManager.register().catch(console.error)
  
  // Check for updates every 30 minutes
  setInterval(() => {
    swManager.checkForUpdates().catch(console.error)
  }, 30 * 60 * 1000)
} else {
  console.log('Service Worker disabled in development mode')
}

export default swManager
export type { ServiceWorkerAPI }
