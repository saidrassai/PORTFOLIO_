/**
 * Comprehensive Web Performance Monitoring
 * Tracks Core Web Vitals and custom performance metrics
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (replaces FID in v5)
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

// Performance rating function
function getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Send metric to analytics service
function sendToAnalytics(metric: Metric) {
  const rating = getPerformanceRating(metric.name, metric.value);
  
  // Console logging for development
  if (import.meta.env.DEV) {
    console.log(`🚀 ${metric.name}:`, {
      value: metric.value,
      rating: rating,
      entries: metric.entries
    });
  }

  // Google Analytics 4 (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: rating,
      custom_map: {
        metric_id: metric.id,
        metric_delta: metric.delta,
      }
    });
  }
  // Send to custom analytics endpoint (disabled for now to avoid 404s)
  if (false && import.meta.env.PROD && typeof window !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: rating,
        id: metric.id,
        delta: metric.delta,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(err => console.warn('Analytics failed:', err));
  }
}

// Custom performance metrics
function trackCustomMetrics() {
  // Track Time to Interactive (approximation)
  function trackTTI() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const tti = navEntry.domInteractive;
              // Create a custom metric object (TTI is not a standard Core Web Vital)
            console.log(`⏱️ TTI: ${tti}ms`);
            
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'custom_timing', {
                name: 'time_to_interactive',
                value: tti,
                custom_parameter_1: 'TTI'
              });
            }
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // Track JavaScript bundle loading time
  function trackBundleLoadTime() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('index') && entry.name.includes('.js')) {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
            console.log(`📦 Bundle load time: ${loadTime}ms`);
            
            // Send custom metric
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'bundle_performance', {
                bundle_load_time: loadTime,
                bundle_name: entry.name.split('/').pop(),
              });
            }
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Track 3D scene initialization time
  if (typeof window !== 'undefined') {
    window.track3DSceneLoad = (startTime: number) => {
      const loadTime = performance.now() - startTime;
      console.log(`🎮 3D Scene load time: ${loadTime}ms`);
      
      if (window.gtag) {
        window.gtag('event', '3d_performance', {
          scene_load_time: loadTime,
          rating: loadTime < 1000 ? 'good' : loadTime < 2000 ? 'needs-improvement' : 'poor'
        });
      }
    };
  }

  trackTTI();
  trackBundleLoadTime();
}

// Error tracking with performance context
function trackErrors() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: event.error?.message || 'Unknown error',
        fatal: false,
        // Include performance context
        custom_map: {
          dom_content_loaded: perfData?.domContentLoadedEventEnd || 0,
          load_complete: perfData?.loadEventEnd || 0,
        }
      });
    }
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `Unhandled Promise: ${event.reason}`,
        fatal: false,
      });
    }
  });
}

// Main initialization function
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  if (!import.meta.env.PROD) {
    console.log('🔍 Performance monitoring initialized (dev mode)');
  }

  // Core Web Vitals (v5 API)
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);

  // Custom metrics
  trackCustomMetrics();
  
  // Error tracking
  trackErrors();

  // Performance observer for resource loading
  if ('PerformanceObserver' in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Track slow resources (> 1 second)
        if (entry.duration > 1000) {
          console.warn(`🐌 Slow resource: ${entry.name} (${entry.duration}ms)`);
        }
      }
    });
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.log('Resource performance monitoring not supported');
    }
  }
}

// Memory usage tracking (for development)
export function trackMemoryUsage() {
  if (import.meta.env.DEV && typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('💾 Memory usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
    });
  }
}

// Export types for TypeScript
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

// Global type augmentation
declare global {
  interface Window {
    track3DSceneLoad?: (startTime: number) => void;
  }
}
