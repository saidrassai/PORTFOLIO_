/**
 * Resource Prefetching Utility
 * Intelligently prefetches resources based on user behavior and viewport visibility
 */

interface PrefetchOptions {
  priority?: 'high' | 'low'
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch'
  crossOrigin?: 'anonymous' | 'use-credentials'
  type?: string
}

class ResourcePrefetcher {
  private prefetchedUrls = new Set<string>()
  private intersectionObserver: IntersectionObserver | null = null
  private prefetchQueue: Array<{ url: string; options: PrefetchOptions }> = []
  private isProcessingQueue = false

  constructor() {
    this.initializeIntersectionObserver()
    this.initializeIdlePrefetching()
  }

  /**
   * Prefetch a resource immediately
   */
  prefetch(url: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedUrls.has(url)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    
    if (options.as) link.as = options.as
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin
    if (options.type) link.type = options.type

    document.head.appendChild(link)
    this.prefetchedUrls.add(url)

    if (import.meta.env.DEV) {
      console.log(`🔗 Prefetched: ${url}`, options)
    }
  }

  /**
   * Preload a critical resource (higher priority than prefetch)
   */
  preload(url: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedUrls.has(url)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    
    if (options.as) link.as = options.as
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin
    if (options.type) link.type = options.type

    document.head.appendChild(link)
    this.prefetchedUrls.add(url)

    if (import.meta.env.DEV) {
      console.log(`⚡ Preloaded: ${url}`, options)
    }
  }

  /**
   * Queue a resource for idle prefetching
   */
  prefetchOnIdle(url: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedUrls.has(url)) return
    
    this.prefetchQueue.push({ url, options })
    this.processQueueOnIdle()
  }

  /**
   * Prefetch resources when elements enter viewport
   */
  prefetchOnVisible(element: Element, url: string, options: PrefetchOptions = {}): void {
    if (!this.intersectionObserver) return

    this.intersectionObserver.observe(element)
    
    // Store prefetch data on the element
    ;(element as any).__prefetchData = { url, options }
  }

  /**
   * Prefetch tech stack icons progressively
   */
  prefetchTechIcons(iconNames: string[]): void {
    const formats = ['webp', 'avif', 'png']
    const sizes = ['32', '64', '128']

    iconNames.forEach((iconName, index) => {
      // Prefetch different formats and sizes with delay
      setTimeout(() => {
        formats.forEach(format => {
          sizes.forEach(size => {
            const url = `/tech-icons-optimized/${iconName}-${size}.${format}`
            this.prefetchOnIdle(url, { as: 'image' })
          })
        })
      }, index * 100) // Stagger the prefetching
    })
  }

  /**
   * Prefetch 3D models and textures
   */
  prefetch3DAssets(): void {
    const assets = [
      { url: '/models-optimized/connector.glb', as: 'fetch' as const },
      // Add more 3D assets as needed
    ]

    assets.forEach(asset => {
      this.prefetchOnIdle(asset.url, { as: asset.as })
    })
  }

  /**
   * Prefetch fonts that might be needed
   */
  prefetchFonts(): void {
    const fonts = [
      {
        url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
        options: { as: 'font' as const, crossOrigin: 'anonymous' as const, type: 'font/woff2' }
      }
    ]

    fonts.forEach(({ url, options }) => {
      this.preload(url, options)
    })
  }

  private initializeIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as any
            const prefetchData = element.__prefetchData
            
            if (prefetchData) {
              this.prefetch(prefetchData.url, prefetchData.options)
              this.intersectionObserver?.unobserve(entry.target)
              delete element.__prefetchData
            }
          }
        })
      },
      {
        rootMargin: '50px', // Start prefetching 50px before element enters viewport
        threshold: 0.1
      }
    )
  }

  private initializeIdlePrefetching(): void {
    if (typeof window === 'undefined') return

    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleWork = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(callback, { timeout: 2000 })
      } else {
        setTimeout(callback, 100)
      }
    }

    this.processQueueOnIdle = () => {
      if (this.isProcessingQueue || this.prefetchQueue.length === 0) return

      this.isProcessingQueue = true
      
      scheduleWork(() => {
        const batch = this.prefetchQueue.splice(0, 3) // Process 3 items at a time
        
        batch.forEach(({ url, options }) => {
          this.prefetch(url, options)
        })

        this.isProcessingQueue = false
        
        // Continue processing if more items in queue
        if (this.prefetchQueue.length > 0) {
          this.processQueueOnIdle()
        }
      })
    }
  }

  private processQueueOnIdle!: () => void

  /**
   * Clean up observers and clear queues
   */
  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }
    this.prefetchQueue = []
    this.prefetchedUrls.clear()
  }
}

// Create singleton instance
export const resourcePrefetcher = new ResourcePrefetcher()

// Initialize common prefetches
export function initializeResourcePrefetching(): void {
  if (typeof window === 'undefined') return

  // Prefetch critical fonts immediately
  resourcePrefetcher.prefetchFonts()

  // Prefetch 3D assets on idle
  resourcePrefetcher.prefetch3DAssets()

  // Prefetch tech icons for the first few technologies
  const priorityTechIcons = [
    'react', 'typescript-icon', 'javascript', 'nodejs', 'python'
  ]
  resourcePrefetcher.prefetchTechIcons(priorityTechIcons)

  if (import.meta.env.DEV) {
    console.log('🚀 Resource prefetching initialized')
  }
}

export default resourcePrefetcher
