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
    // Analytics disabled - only console logging for development
  if (import.meta.env.DEV) {
    console.log(`🚀 ${metric.name}:`, {
      value: metric.value,
      rating: rating,
      entries: metric.entries
    });
  }
  
  // Send to custom analytics endpoint (Netlify function)
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    fetch('/.netlify/functions/analytics', {
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
    }).catch(err => {
      // Silently handle errors to avoid console noise
      if (import.meta.env.DEV) {
        console.warn('Analytics failed:', err);
      }
    });
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
            const tti = navEntry.domInteractive;            // Custom TTI tracking - analytics disabled
            console.log(`⏱️ TTI: ${tti}ms`);
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
            const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;            console.log(`📦 Bundle load time: ${loadTime}ms`);
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
    };
  }

  trackTTI();
  trackBundleLoadTime();
}

// Error tracking with performance context
function trackErrors() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => {
    // Error tracking disabled - only console logging in dev
    if (import.meta.env.DEV) {
      console.warn('Error tracked:', event.error?.message || 'Unknown error');
    }
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.DEV) {
      console.warn('Unhandled Promise rejection:', event.reason);
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
