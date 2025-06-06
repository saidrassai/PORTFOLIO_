/**
 * Advanced Resource Prefetching System
 * Implements intelligent prefetching based on user behavior and viewport intersection
 */

import { useEffect } from 'react'

interface PrefetchConfig {
  immediate?: string[]      // Resources to prefetch immediately
  onInteraction?: string[]  // Resources to prefetch on user interaction
  onViewport?: string[]     // Resources to prefetch when elements enter viewport
  onIdle?: string[]        // Resources to prefetch when browser is idle
}

interface PrefetchOptions {
  priority?: 'high' | 'low'
  crossOrigin?: 'anonymous' | 'use-credentials'
  type?: 'script' | 'style' | 'image' | 'font' | 'fetch'
}

class AdvancedPrefetcher {
  private prefetchedResources = new Set<string>()
  private intersectionObserver?: IntersectionObserver
  private idleCallback?: number

  constructor() {
    this.setupIntersectionObserver()
    this.setupIdlePrefetching()
  }

  /**
   * Prefetch a resource with advanced options
   */
  prefetch(url: string, options: PrefetchOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.prefetchedResources.has(url)) {
        resolve()
        return
      }

      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      
      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin
      }
      
      if (options.type) {
        link.as = options.type
      }

      // Set priority for browsers that support it
      if (options.priority && 'fetchPriority' in link) {
        ;(link as any).fetchPriority = options.priority
      }

      link.onload = () => {
        this.prefetchedResources.add(url)
        resolve()
      }
      
      link.onerror = () => reject(new Error(`Failed to prefetch ${url}`))
      
      document.head.appendChild(link)
    })
  }

  /**
   * Prefetch resources based on configuration
   */
  async initializePrefetching(config: PrefetchConfig) {
    // Immediate prefetching
    if (config.immediate?.length) {
      await Promise.all(
        config.immediate.map(url => 
          this.prefetch(url, { priority: 'high' })
        )
      )
    }

    // Interaction-based prefetching
    if (config.onInteraction?.length) {
      this.setupInteractionPrefetching(config.onInteraction)
    }

    // Viewport-based prefetching
    if (config.onViewport?.length) {
      this.setupViewportPrefetching(config.onViewport)
    }

    // Idle prefetching
    if (config.onIdle?.length) {
      this.scheduleIdlePrefetching(config.onIdle)
    }
  }

  /**
   * Setup intersection observer for viewport-based prefetching
   */
  private setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement
              const prefetchUrl = element.dataset.prefetch
              if (prefetchUrl) {
                this.prefetch(prefetchUrl, { priority: 'low' })
                this.intersectionObserver?.unobserve(element)
              }
            }
          })
        },
        { rootMargin: '50px' }
      )
    }
  }

  /**
   * Setup interaction-based prefetching
   */
  private setupInteractionPrefetching(urls: string[]) {
    const prefetchOnInteraction = () => {
      urls.forEach(url => this.prefetch(url, { priority: 'high' }))
      // Remove listeners after first interaction
      document.removeEventListener('mousedown', prefetchOnInteraction)
      document.removeEventListener('touchstart', prefetchOnInteraction)
      document.removeEventListener('keydown', prefetchOnInteraction)
    }

    document.addEventListener('mousedown', prefetchOnInteraction, { passive: true })
    document.addEventListener('touchstart', prefetchOnInteraction, { passive: true })
    document.addEventListener('keydown', prefetchOnInteraction, { passive: true })
  }
  /**
   * Setup viewport-based prefetching for specific elements
   */
  private setupViewportPrefetching(_urls: string[]) {
    if (!this.intersectionObserver) return

    // Find elements with data-prefetch attributes
    const elements = document.querySelectorAll('[data-prefetch]')
    elements.forEach(element => {
      this.intersectionObserver?.observe(element)
    })
  }

  /**
   * Setup idle prefetching
   */
  private setupIdlePrefetching() {
    if ('requestIdleCallback' in window) {
      // Modern browsers with idle callback support
      return
    }
    
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      this.idleCallback = window.setTimeout(() => {
        // Prefetch during idle time
      }, 100)
    }, 2000)
  }

  /**
   * Schedule prefetching during idle time
   */
  private scheduleIdlePrefetching(urls: string[]) {
    const prefetchDuringIdle = (deadline?: IdleDeadline) => {
      let i = 0
      while (i < urls.length && (!deadline || deadline.timeRemaining() > 0)) {
        this.prefetch(urls[i], { priority: 'low' })
        i++
      }
      
      if (i < urls.length) {
        // Schedule remaining prefetches
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(prefetchDuringIdle)
        } else {
          setTimeout(() => prefetchDuringIdle(), 100)
        }
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchDuringIdle)
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => prefetchDuringIdle(), 2000)
    }
  }

  /**
   * Prefetch critical Three.js resources when 3D section is about to be viewed
   */
  prefetch3DResources() {
    const threejsResources = [
      '/models-optimized/connector.glb',
      // These will be dynamically imported when needed, so we prefetch the chunks
      // The actual chunk names will be determined by Vite's build process
    ]

    return Promise.all(
      threejsResources.map(url => 
        this.prefetch(url, { type: 'fetch', priority: 'low' })
      )
    )
  }

  /**
   * Smart prefetching based on user behavior patterns
   */
  enableSmartPrefetching() {
    // Track user scroll behavior
    let scrollTimeout: number
    let isScrollingDown = false
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      isScrollingDown = currentScrollY > lastScrollY
      lastScrollY = currentScrollY

      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        if (isScrollingDown) {
          // User is scrolling down, prefetch next sections
          this.prefetchNextSectionResources()
        }
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  /**
   * Prefetch resources for the next likely section
   */
  private prefetchNextSectionResources() {
    const currentSection = this.getCurrentSection()
    const nextSectionResources = this.getNextSectionResources(currentSection)
    
    nextSectionResources.forEach(url => {
      this.prefetch(url, { priority: 'low' })
    })
  }

  private getCurrentSection(): string {
    const sections = ['hero', 'about', 'techstack', 'projects', 'contact']
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    
    // Simple section detection based on scroll position
    const sectionIndex = Math.floor(scrollY / windowHeight)
    return sections[Math.min(sectionIndex, sections.length - 1)] || 'hero'
  }

  private getNextSectionResources(currentSection: string): string[] {
    const resourceMap: Record<string, string[]> = {
      hero: [
        '/tech-icons-optimized/react.webp',
        '/tech-icons-optimized/typescript-icon.webp',
        '/tech-icons-optimized/javascript.webp'
      ],
      about: [
        '/tech-icons-optimized/nodejs.webp',
        '/tech-icons-optimized/python.webp'
      ],
      techstack: [
        '/Project_Photos/portolio.png'
      ],
      projects: [
        // Contact form resources would go here
      ],
      contact: []
    }

    return resourceMap[currentSection] || []
  }

  /**
   * Cleanup method
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
    
    if (this.idleCallback) {
      clearTimeout(this.idleCallback)
    }
  }
}

// Export singleton instance
export const prefetcher = new AdvancedPrefetcher()

// Export React hook for easy integration
export const usePrefetching = (config: PrefetchConfig) => {
  useEffect(() => {
    prefetcher.initializePrefetching(config)
    prefetcher.enableSmartPrefetching()
    
    return () => {
      prefetcher.destroy()
    }
  }, [config])
}

// Export default configuration
export const defaultPrefetchConfig: PrefetchConfig = {
  immediate: [
    // Critical fonts and styles are already preloaded in index.html
  ],
  onInteraction: [
    // Three.js chunks will be lazy-loaded when needed
    '/models-optimized/connector.glb'
  ],
  onViewport: [
    '/tech-icons-optimized/react.webp',
    '/tech-icons-optimized/typescript-icon.webp',
    '/tech-icons-optimized/javascript.webp',
    '/tech-icons-optimized/nodejs.webp',
    '/tech-icons-optimized/python.webp'
  ],
  onIdle: [
    '/Project_Photos/portolio.png',
    // Additional project images would go here
  ]
}

export default AdvancedPrefetcher
