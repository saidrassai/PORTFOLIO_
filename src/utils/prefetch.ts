/**
 * Advanced Prefetching Utility
 * Intelligently prefetches resources based on user behavior, scroll patterns, and likely next actions
 */

interface PrefetchOptions {
  priority?: 'high' | 'low'
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch'
  crossOrigin?: 'anonymous' | 'use-credentials'
  type?: string
}

interface UserBehavior {
  scrollDirection: 'up' | 'down' | 'idle'
  scrollSpeed: number
  timeOnSection: number
  interactionCount: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionSpeed: 'slow' | 'fast'
}

interface SectionPrefetchMap {
  [sectionId: string]: {
    resources: string[]
    nextLikelySections: string[]
    prefetchDelay: number
    priority: 'high' | 'low'
  }
}

class AdvancedResourcePrefetcher {
  private prefetchedUrls = new Set<string>()
  private intersectionObserver: IntersectionObserver | null = null
  private prefetchQueue: Array<{ url: string; options: PrefetchOptions }> = []
  private isProcessingQueue = false
  private userBehavior: UserBehavior
  private sectionPrefetchMap: SectionPrefetchMap
  private currentSection: string = 'hero'
  private behaviorTracker: {
    scrollStartTime: number
    lastScrollY: number
    sectionStartTime: number
    interactions: number
  }

  constructor() {
    this.userBehavior = this.detectUserBehavior()
    this.behaviorTracker = {
      scrollStartTime: Date.now(),
      lastScrollY: window.scrollY,
      sectionStartTime: Date.now(),
      interactions: 0
    }
    
    this.sectionPrefetchMap = {
      hero: {
        resources: [
          '/models-optimized/connector.glb',
          '/tech-icons-optimized/react-64.webp',
          '/tech-icons-optimized/typescript-64.webp'
        ],
        nextLikelySections: ['about', 'tech-stack'],
        prefetchDelay: 2000,
        priority: 'high'
      },
      about: {
        resources: [
          '/tech-icons-optimized/javascript-64.webp',
          '/tech-icons-optimized/python-64.webp'
        ],
        nextLikelySections: ['tech-stack', 'projects'],
        prefetchDelay: 1500,
        priority: 'high'
      },
      'tech-stack': {
        resources: this.getAllTechIcons(),
        nextLikelySections: ['projects', 'contact'],
        prefetchDelay: 1000,
        priority: 'high'
      },
      projects: {
        resources: [
          '/Project_Photos/portolio.png'
        ],
        nextLikelySections: ['contact'],
        prefetchDelay: 2000,
        priority: 'low'
      },
      contact: {
        resources: [],
        nextLikelySections: ['hero'], // Loop back
        prefetchDelay: 3000,
        priority: 'low'
      }
    }

    this.initializeIntersectionObserver()
    this.initializeBehaviorTracking()
    this.initializeIdlePrefetching()
    this.initializeIntelligentPrefetching()
  }

  /**
   * Detect user device and connection capabilities
   */
  private detectUserBehavior(): UserBehavior {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth < 1024
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (isMobile) deviceType = 'mobile'
    else if (isTablet) deviceType = 'tablet'

    // Detect connection speed (rough estimation)
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionSpeed = connection?.effectiveType === '4g' || connection?.downlink > 10 ? 'fast' : 'slow'

    return {
      scrollDirection: 'idle',
      scrollSpeed: 0,
      timeOnSection: 0,
      interactionCount: 0,
      deviceType,
      connectionSpeed
    }
  }

  /**
   * Get all tech icon resources for prefetching
   */
  private getAllTechIcons(): string[] {
    const techNames = [
      'react', 'typescript', 'javascript', 'python', 'nodejs', 'nextjs',
      'tailwindcss', 'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes'
    ]
    
    const formats = this.userBehavior.connectionSpeed === 'fast' ? ['webp', 'avif'] : ['webp']
    const sizes = this.userBehavior.deviceType === 'mobile' ? [32, 48] : [48, 64]
    
    const icons: string[] = []
    techNames.forEach(name => {
      formats.forEach(format => {
        sizes.forEach(size => {
          icons.push(`/tech-icons-optimized/${name}-${size}.${format}`)
        })
      })
    })
    
    return icons
  }

  /**
   * Initialize behavior tracking for intelligent prefetching
   */
  private initializeBehaviorTracking(): void {
    let lastScrollY = window.scrollY
    let lastScrollTime = Date.now()

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = currentTime - lastScrollTime
      const scrollDiff = Math.abs(currentScrollY - lastScrollY)

      // Update scroll behavior
      this.userBehavior.scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      this.userBehavior.scrollSpeed = scrollDiff / timeDiff

      lastScrollY = currentScrollY
      lastScrollTime = currentTime
    }

    const handleInteraction = () => {
      this.behaviorTracker.interactions++
      this.userBehavior.interactionCount++
    }

    // Throttled scroll listener
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 16) // ~60fps
    }, { passive: true })    // Track user interactions
    const interactionEvents = ['click', 'touchstart', 'keydown'] as const
    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleInteraction, { passive: true })
    })
  }

  /**
   * Initialize intelligent prefetching based on section visibility and user behavior
   */
  private initializeIntelligentPrefetching(): void {
    const sectionElements = document.querySelectorAll('[data-section]')
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section')
          if (sectionId && sectionId !== this.currentSection) {
            this.onSectionEnter(sectionId)
          }
        }
      })
    }, {
      threshold: 0.3,
      rootMargin: '20px'
    })

    sectionElements.forEach(el => observer.observe(el))
  }

  /**
   * Handle section enter - trigger intelligent prefetching
   */
  private onSectionEnter(sectionId: string): void {
    const previousSection = this.currentSection
    this.currentSection = sectionId
    this.behaviorTracker.sectionStartTime = Date.now()

    const sectionConfig = this.sectionPrefetchMap[sectionId]
    if (!sectionConfig) return

    // Prefetch current section resources immediately
    setTimeout(() => {
      sectionConfig.resources.forEach(resource => {
        this.prefetch(resource, { 
          priority: sectionConfig.priority,
          as: this.getResourceType(resource)
        })
      })
    }, 100)

    // Predict and prefetch likely next sections based on user behavior
    setTimeout(() => {
      this.prefetchLikelyNextSections(sectionConfig.nextLikelySections)
    }, sectionConfig.prefetchDelay)

    if (import.meta.env.DEV) {
      console.log(`📍 Section: ${previousSection} → ${sectionId}`)
      console.log(`🎯 Behavior: scroll=${this.userBehavior.scrollDirection}, speed=${this.userBehavior.scrollSpeed.toFixed(2)}, device=${this.userBehavior.deviceType}`)
    }
  }
  /**
   * Prefetch resources for likely next sections based on user behavior
   */
  private prefetchLikelyNextSections(nextSections: string[]): void {    // Prioritize sections based on scroll direction and speed
    const prioritizedSections = nextSections.sort((a, _b) => {
      const aConfig = this.sectionPrefetchMap[a]
      
      // Fast scrollers are more likely to skip sections
      if (this.userBehavior.scrollSpeed > 2) {
        return aConfig?.priority === 'high' ? -1 : 1
      }
      
      return 0
    })

    prioritizedSections.forEach((sectionId, index) => {
      const sectionConfig = this.sectionPrefetchMap[sectionId]
      if (!sectionConfig) return

      // Delay based on likelihood and connection speed
      const delay = index * (this.userBehavior.connectionSpeed === 'fast' ? 500 : 1000)
      
      setTimeout(() => {
        sectionConfig.resources.slice(0, this.userBehavior.connectionSpeed === 'fast' ? 10 : 5).forEach(resource => {
          this.prefetch(resource, { 
            priority: 'low',
            as: this.getResourceType(resource)
          })
        })
      }, delay)
    })
  }

  /**
   * Determine resource type for prefetching
   */
  private getResourceType(url: string): PrefetchOptions['as'] {
    if (url.includes('.glb') || url.includes('.gltf')) return 'fetch'
    if (url.includes('.webp') || url.includes('.avif') || url.includes('.png') || url.includes('.jpg')) return 'image'
    if (url.includes('.woff') || url.includes('.woff2')) return 'font'
    if (url.includes('.css')) return 'style'
    if (url.includes('.js')) return 'script'
    return 'fetch'
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
export const resourcePrefetcher = new AdvancedResourcePrefetcher()

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
