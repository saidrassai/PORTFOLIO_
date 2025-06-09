/**
 * Error monitoring and reporting utilities
 */

// Sentry configuration
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

interface ErrorInfo {
  message: string
  stack?: string
  url?: string
  line?: number
  column?: number
  timestamp: string
  userAgent: string
  userId?: string
}

/**
 * Initialize error monitoring
 * Note: This is a lightweight alternative to Sentry for minimal setups
 */
export const initErrorMonitoring = () => {
  if (typeof window === 'undefined') return

  // Global error handler
  window.addEventListener('error', (event) => {
    const errorInfo: ErrorInfo = {
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    
    reportError(errorInfo)
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const errorInfo: ErrorInfo = {
      message: `Unhandled promise rejection: ${event.reason}`,
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    
    reportError(errorInfo)
  })

  // React error boundary fallback
  window.addEventListener('reactError', (event: any) => {
    const errorInfo: ErrorInfo = {
      message: event.detail.message,
      stack: event.detail.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    
    reportError(errorInfo)
  })
}

/**
 * Report error to monitoring service
 */
const reportError = (errorInfo: ErrorInfo) => {
  // In production, you might want to send to your preferred error tracking service
  if (import.meta.env.MODE === 'development') {
    console.error('Error reported:', errorInfo)
    return
  }

  // Example: Send to your own endpoint or third-party service
  // You can replace this with Sentry, LogRocket, or any other service
  try {
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo),
    }).catch(() => {
      // Silently fail if error reporting fails
      console.warn('Failed to report error to monitoring service')
    })
  } catch {
    // Backup: Log to console in production if fetch fails
    console.error('Error (monitoring failed):', errorInfo)
  }
}

/**
 * Manually report custom errors
 */
export const reportCustomError = (message: string, context?: Record<string, any>) => {
  const errorInfo: ErrorInfo = {
    message,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...context
  }
  
  reportError(errorInfo)
}

/**
 * Track user actions for debugging context
 */
export const trackUserAction = (action: string, details?: Record<string, any>) => {
  if (import.meta.env.MODE === 'development') {
    console.log('User action:', action, details)
  }
  
  // Store recent actions for error context
  const recentActions = JSON.parse(localStorage.getItem('recentActions') || '[]')
  recentActions.push({
    action,
    details,
    timestamp: new Date().toISOString()
  })
  
  // Keep only last 10 actions
  if (recentActions.length > 10) {
    recentActions.shift()
  }
  
  localStorage.setItem('recentActions', JSON.stringify(recentActions))
}
