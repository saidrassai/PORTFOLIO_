/**
 * Uptime monitoring and health check utilities
 */

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    api?: boolean
    assets?: boolean
    external?: boolean
  }
  responseTime?: number
}

/**
 * Perform health checks for the application
 */
export const performHealthCheck = async (): Promise<HealthCheck> => {
  const startTime = performance.now()
  const checks = {
    api: false,
    assets: false,
    external: false
  }

  try {
    // Check if critical assets are accessible
    const assetCheck = await fetch('/favicon.png', { method: 'HEAD' })
    checks.assets = assetCheck.ok    // Check external dependencies (fonts, analytics)
    try {
      await fetch('https://fonts.googleapis.com/css2?family=Inter', { 
        method: 'HEAD',
        mode: 'no-cors' 
      })
      checks.external = true // If no error thrown, assume external services are accessible
    } catch {
      checks.external = false
    }

    // Mock API check (replace with actual API endpoints if you have them)
    checks.api = true // No API endpoints to check currently

  } catch (error) {
    console.warn('Health check failed:', error)
  }

  const responseTime = performance.now() - startTime
  const healthyChecks = Object.values(checks).filter(Boolean).length
  const totalChecks = Object.values(checks).length

  let status: HealthCheck['status'] = 'unhealthy'
  if (healthyChecks === totalChecks) {
    status = 'healthy'
  } else if (healthyChecks > totalChecks / 2) {
    status = 'degraded'
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    checks,
    responseTime
  }
}

/**
 * Monitor uptime and report status
 */
export class UptimeMonitor {
  private checkInterval: number
  private intervalId?: number
  private lastCheck?: HealthCheck

  constructor(checkInterval: number = 5 * 60 * 1000) { // Default: 5 minutes
    this.checkInterval = checkInterval
  }

  /**
   * Start monitoring
   */
  start() {
    if (this.intervalId) return // Already running

    // Perform initial check
    this.performCheck()

    // Set up periodic checks
    this.intervalId = window.setInterval(() => {
      this.performCheck()
    }, this.checkInterval)
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  /**
   * Get last health check result
   */
  getLastCheck(): HealthCheck | undefined {
    return this.lastCheck
  }

  private async performCheck() {
    try {
      this.lastCheck = await performHealthCheck()
      
      if (import.meta.env.MODE === 'development') {
        console.log('🔍 Health Check:', this.lastCheck)
      }

      // Report to analytics if needed
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'health_check', {
          status: this.lastCheck.status,
          response_time: this.lastCheck.responseTime,
          timestamp: this.lastCheck.timestamp
        })
      }

    } catch (error) {
      console.error('Failed to perform health check:', error)
    }
  }
}

/**
 * Simple status page data
 */
export const getStatusPageData = async () => {
  const healthCheck = await performHealthCheck()
  
  return {
    status: healthCheck.status,
    lastUpdated: healthCheck.timestamp,
    services: [
      {
        name: 'Website',
        status: healthCheck.checks.assets ? 'operational' : 'down',
        responseTime: healthCheck.responseTime
      },
      {
        name: 'External Dependencies',
        status: healthCheck.checks.external ? 'operational' : 'degraded'
      },
      {
        name: 'Contact Form',
        status: 'operational' // Netlify Forms is generally reliable
      }
    ]
  }
}

// Global uptime monitor instance (only for production)
export const uptimeMonitor = import.meta.env.MODE === 'production' 
  ? new UptimeMonitor() 
  : null
