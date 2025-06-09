/**
 * Analytics utilities for tracking user interactions and performance metrics
 */

// Google Analytics 4 Integration
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-8MS7CH2NHT'

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      // Privacy and performance optimizations
      anonymize_ip: true,
      allow_google_signals: false,
      send_page_view: true
    })
  }
}

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
    window.gtag('event', eventName, {
      ...parameters,
      custom_parameter: 'portfolio_interaction'
    })
  }
}

/**
 * Track page views
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    })
  }
}

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track project interactions
 */
export const trackProjectView = (projectName: string, action: 'view' | 'demo' | 'github') => {
  trackEvent('project_interaction', {
    project_name: projectName,
    action: action,
    timestamp: new Date().toISOString()
  })
}

/**
 * Track performance metrics
 */
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent('performance_metric', {
    metric_name: metric,
    value: value,
    unit: unit,
    timestamp: new Date().toISOString()
  })
}
