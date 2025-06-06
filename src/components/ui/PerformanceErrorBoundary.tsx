import { Component, type ErrorInfo, type ReactNode } from 'react'
import { trackMemoryUsage } from '../../utils/analytics'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  performanceSnapshot?: {
    memory: number
    timing: PerformanceNavigationTiming
    resources: PerformanceResourceTiming[]
    timestamp: number
  }
}

class PerformanceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture performance snapshot at time of error
    const performanceSnapshot = this.capturePerformanceSnapshot()
    
    this.setState({
      error,
      errorInfo,
      performanceSnapshot
    })    // Log detailed error with performance context
    this.logErrorWithPerformanceContext(error, errorInfo, performanceSnapshot)
    
    // Analytics disabled - error tracking simplified
    if (import.meta.env.DEV) {
      console.warn('Error boundary triggered:', {
        message: error.message,
        component_stack: errorInfo.componentStack,
        performance: performanceSnapshot
      })
    }
  }

  private capturePerformanceSnapshot() {
    try {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      let memory = 0
      if ('memory' in performance) {
        memory = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      }

      return {
        memory,
        timing,
        resources: resources.slice(-10), // Last 10 resources only
        timestamp: Date.now()
      }
    } catch (e) {
      console.warn('Failed to capture performance snapshot:', e)
      return undefined
    }
  }

  private logErrorWithPerformanceContext(
    error: Error, 
    errorInfo: ErrorInfo, 
    performanceSnapshot?: State['performanceSnapshot']
  ) {
    console.group('🚨 React Error Boundary - Performance Context')
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)
    
    if (performanceSnapshot) {      console.log('📊 Performance Snapshot at Error Time:')
      console.log('Memory Usage:', `${performanceSnapshot.memory}MB`)
      
      if (performanceSnapshot.timing) {
        const { timing } = performanceSnapshot
        console.log('Page Load Performance:', {
          'DNS Lookup': `${timing.domainLookupEnd - timing.domainLookupStart}ms`,
          'TCP Connect': `${timing.connectEnd - timing.connectStart}ms`,
          'Request/Response': `${timing.responseEnd - timing.requestStart}ms`,
          'DOM Content Loaded': `${(timing.domContentLoadedEventEnd || 0) - (timing.domContentLoadedEventStart || 0)}ms`,
          'Total Load Time': `${(timing.loadEventEnd || 0) - (timing.fetchStart || 0)}ms`
        })
      }
      
      const slowResources = performanceSnapshot.resources.filter(r => r.duration > 1000)
      if (slowResources.length > 0) {
        console.warn('Slow Resources (>1s):', slowResources.map(r => ({
          name: r.name.split('/').pop(),
          duration: `${Math.round(r.duration)}ms`,
          size: r.transferSize ? `${Math.round(r.transferSize / 1024)}KB` : 'unknown'
        })))
      }
    }
    
    console.groupEnd()
    
    // Track memory usage for debugging
    trackMemoryUsage()
  }

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      performanceSnapshot: undefined 
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Performance data has been logged for debugging.
            </p>
            
            {import.meta.env.DEV && this.state.performanceSnapshot && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Performance Info:</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Memory: {this.state.performanceSnapshot.memory}MB</div>
                  <div>Error Time: {new Date(this.state.performanceSnapshot.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Reload Page
              </button>
            </div>
            
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default PerformanceErrorBoundary
