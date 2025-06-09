/**
 * Performance monitoring utilities
 */

interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  cls?: number
  ttfb?: number
  inp?: number
  pageLoad?: number
  videoLoad?: number[]
  fontLoad?: number[]
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initObservers()
  }

  private initObservers() {
    if (typeof window === 'undefined') return

    try {
      // Navigation timing observer
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.pageLoad = navEntry.loadEventEnd - navEntry.fetchStart
            this.metrics.ttfb = navEntry.responseStart - navEntry.fetchStart
          }
        })
      })
      
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)

      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            const loadTime = resourceEntry.responseEnd - resourceEntry.fetchStart
            
            if (resourceEntry.name.includes('.webm') || resourceEntry.name.includes('video')) {
              this.metrics.videoLoad = this.metrics.videoLoad || []
              this.metrics.videoLoad.push(loadTime)
            }
            
            if (resourceEntry.name.includes('font') || resourceEntry.name.includes('.woff')) {
              this.metrics.fontLoad = this.metrics.fontLoad || []
              this.metrics.fontLoad.push(loadTime)
            }
          }
        })
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)

      // Largest Contentful Paint observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.lcp = lastEntry.startTime
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // First Contentful Paint observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
          }
        })
      })
      
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)

    } catch (error) {
      console.warn('Failed to initialize performance observers:', error)
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance summary
   */
  getSummary(): string {
    const metrics = this.getMetrics()
    const summary = []

    if (metrics.fcp) summary.push(`FCP: ${Math.round(metrics.fcp)}ms`)
    if (metrics.lcp) summary.push(`LCP: ${Math.round(metrics.lcp)}ms`)
    if (metrics.ttfb) summary.push(`TTFB: ${Math.round(metrics.ttfb)}ms`)
    if (metrics.pageLoad) summary.push(`Page Load: ${Math.round(metrics.pageLoad)}ms`)
    if (metrics.videoLoad?.length) {
      const avgVideo = metrics.videoLoad.reduce((a, b) => a + b, 0) / metrics.videoLoad.length
      summary.push(`Avg Video Load: ${Math.round(avgVideo)}ms`)
    }

    return summary.join(' | ')
  }

  /**
   * Check if performance meets targets
   */
  meetsTargets(): { passed: boolean; issues: string[] } {
    const metrics = this.getMetrics()
    const issues: string[] = []

    // Performance targets based on your requirements
    if (metrics.fcp && metrics.fcp > 1500) {
      issues.push(`FCP too slow: ${Math.round(metrics.fcp)}ms (target: <1500ms)`)
    }
    
    if (metrics.lcp && metrics.lcp > 2500) {
      issues.push(`LCP too slow: ${Math.round(metrics.lcp)}ms (target: <2500ms)`)
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      issues.push(`CLS too high: ${metrics.cls.toFixed(3)} (target: <0.1)`)
    }

    return {
      passed: issues.length === 0,
      issues
    }
  }

  /**
   * Cleanup observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Easy access function to log performance summary
 */
export const logPerformanceSummary = () => {
  if (import.meta.env.MODE === 'development') {
    console.log('🚀 Performance Summary:', performanceMonitor.getSummary())
    
    const { passed, issues } = performanceMonitor.meetsTargets()
    if (!passed) {
      console.warn('⚠️ Performance Issues:', issues)
    } else {
      console.log('✅ All performance targets met!')
    }
  }
}
