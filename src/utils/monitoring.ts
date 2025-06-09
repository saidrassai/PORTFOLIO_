/**
 * Central monitoring initialization
 * This file orchestrates all monitoring tools
 */

import { initGA, trackPageView } from './analytics'
import { initWebVitals } from './webVitals'
import { initErrorMonitoring } from './errorMonitoring'
import { performanceMonitor, logPerformanceSummary } from './performanceMonitor'
import { uptimeMonitor } from './uptimeMonitor'

/**
 * Initialize all monitoring tools
 */
export const initMonitoring = () => {
  try {
    // Initialize Google Analytics
    initGA()
    
    // Track initial page view
    trackPageView(window.location.pathname, document.title)
    
    // Initialize Web Vitals monitoring
    initWebVitals()
    
    // Initialize error monitoring
    initErrorMonitoring()
    
    // Start uptime monitoring (production only)
    if (uptimeMonitor) {
      uptimeMonitor.start()
    }
    
    // Log performance summary after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        logPerformanceSummary()
      }, 1000) // Wait 1 second after load for metrics to stabilize
    })
    
    if (import.meta.env.MODE === 'development') {
      console.log('🔧 Monitoring tools initialized')
    }
    
  } catch (error) {
    console.warn('Failed to initialize monitoring:', error)
  }
}

/**
 * Cleanup monitoring tools
 */
export const cleanupMonitoring = () => {
  try {
    performanceMonitor.disconnect()
    if (uptimeMonitor) {
      uptimeMonitor.stop()
    }
  } catch (error) {
    console.warn('Failed to cleanup monitoring:', error)
  }
}

// Export all monitoring utilities for direct use
export * from './analytics'
export * from './webVitals'
export * from './errorMonitoring'
export * from './performanceMonitor'
export * from './uptimeMonitor'
