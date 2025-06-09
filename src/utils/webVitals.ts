/**
 * Web Vitals monitoring for Core Web Vitals tracking
 */
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'
import { trackPerformance } from './analytics'

/**
 * Initialize Web Vitals monitoring
 * Automatically tracks Core Web Vitals and sends to analytics
 */
export const initWebVitals = () => {
  // Only run in production and when analytics is available
  if (import.meta.env.MODE !== 'production') {
    return
  }

  try {
    // Cumulative Layout Shift
    onCLS((metric) => {
      trackPerformance('CLS', metric.value, 'score')
      console.log('CLS:', metric.value)
    })

    // First Contentful Paint
    onFCP((metric) => {
      trackPerformance('FCP', metric.value, 'ms')
      console.log('FCP:', metric.value, 'ms')
    })

    // Largest Contentful Paint
    onLCP((metric) => {
      trackPerformance('LCP', metric.value, 'ms')
      console.log('LCP:', metric.value, 'ms')
    })

    // Time to First Byte
    onTTFB((metric) => {
      trackPerformance('TTFB', metric.value, 'ms')
      console.log('TTFB:', metric.value, 'ms')
    })

    // Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      trackPerformance('INP', metric.value, 'ms')
      console.log('INP:', metric.value, 'ms')
    })
  } catch (error) {
    console.warn('Failed to initialize Web Vitals:', error)
  }
}

/**
 * Track custom performance metrics
 */
export const trackCustomMetric = (name: string, startTime: number) => {
  const duration = performance.now() - startTime
  trackPerformance(name, Math.round(duration), 'ms')
  return duration
}

/**
 * Monitor resource loading performance
 */
export const trackResourceLoading = () => {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    // Track page load time
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationTiming) {
      const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart
      trackPerformance('page_load', Math.round(pageLoadTime), 'ms')
    }

    // Track resource timings
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    // Track video loading performance
    const videoResources = resources.filter(resource => 
      resource.name.includes('.webm') || resource.name.includes('video')
    )
    
    videoResources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.fetchStart
      trackPerformance('video_load', Math.round(loadTime), 'ms')
    })

    // Track font loading performance
    const fontResources = resources.filter(resource => 
      resource.name.includes('font') || resource.name.includes('.woff')
    )
    
    fontResources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.fetchStart
      trackPerformance('font_load', Math.round(loadTime), 'ms')
    })
  })
}
