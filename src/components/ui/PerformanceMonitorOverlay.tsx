import { useEffect, useState, useCallback, memo } from 'react'
import { Activity, Monitor, Zap, MemoryStick } from '../../utils/icons'

interface PerformanceMetrics {
  fps: number
  memory: number
  timing: {
    navigationStart: number
    loadEventEnd: number
    domContentLoadedEventEnd: number
    firstPaint: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    firstInputDelay: number
    cumulativeLayoutShift: number
  }
  connection: {
    effectiveType: string
    downlink: number
    rtt: number
  }
}

interface PerformanceMonitorOverlayProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const PerformanceMonitorOverlay = memo(({ 
  enabled = false, 
  position = 'bottom-right' 
}: PerformanceMonitorOverlayProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastFrameTime, setLastFrameTime] = useState(0)
  const [fps, setFps] = useState(0)

  // FPS calculation
  const calculateFps = useCallback(() => {
    const now = performance.now()
    const delta = now - lastFrameTime
    const currentFps = 1000 / delta
    
    setFps(Math.round(currentFps))
    setLastFrameTime(now)
    
    if (enabled) {
      requestAnimationFrame(calculateFps)
    }
  }, [lastFrameTime, enabled])

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  }, [])

  // Network information
  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      }
    }
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    }
  }, [])
  // Performance timing
  const getPerformanceTiming = useCallback(() => {
    const timing = performance.timing
    
    return {
      navigationStart: timing.navigationStart,
      loadEventEnd: timing.loadEventEnd,
      domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
      firstPaint: 0, // Will be updated by observer
      firstContentfulPaint: 0, // Will be updated by observer
      largestContentfulPaint: 0, // Will be updated by observer
      firstInputDelay: 0, // Will be updated by observer
      cumulativeLayoutShift: 0 // Will be updated by observer
    }
  }, [])

  // Core Web Vitals observer
  useEffect(() => {
    if (!enabled) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        setMetrics(prev => {
          if (!prev) return null
          
          const updatedTiming = { ...prev.timing }
            switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-paint') {
                updatedTiming.firstPaint = entry.startTime
              } else if (entry.name === 'first-contentful-paint') {
                updatedTiming.firstContentfulPaint = entry.startTime
              }
              break
            case 'largest-contentful-paint':
              updatedTiming.largestContentfulPaint = entry.startTime
              break
            case 'first-input':
              const firstInputEntry = entry as PerformanceEventTiming
              updatedTiming.firstInputDelay = firstInputEntry.processingStart - firstInputEntry.startTime
              break
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                updatedTiming.cumulativeLayoutShift += (entry as any).value
              }
              break
          }
          
          return {
            ...prev,
            timing: updatedTiming
          }
        })
      })
    })

    // Observe different performance entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      console.warn('Some performance observers not supported:', e)
    }

    return () => observer.disconnect()
  }, [enabled])

  // Initialize metrics
  useEffect(() => {
    if (!enabled) return

    const initializeMetrics = () => {
      const memory = getMemoryUsage()
      const networkInfo = getNetworkInfo()
      const timing = getPerformanceTiming()
      
      setMetrics({
        fps: 0,
        memory: memory ? memory.used : 0,
        timing,
        connection: networkInfo
      })
    }

    initializeMetrics()
    
    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const memory = getMemoryUsage()
      const networkInfo = getNetworkInfo()
      
      setMetrics(prev => prev ? {
        ...prev,
        fps,
        memory: memory ? memory.used : 0,
        connection: networkInfo
      } : null)
    }, 2000)

    return () => clearInterval(interval)
  }, [enabled, fps, getMemoryUsage, getNetworkInfo, getPerformanceTiming])

  // Start FPS monitoring
  useEffect(() => {
    if (enabled) {
      setLastFrameTime(performance.now())
      requestAnimationFrame(calculateFps)
    }
  }, [enabled, calculateFps])

  if (!enabled || !metrics) return null

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-500'
    if (fps >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-500'
    if (memory < 100) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] pointer-events-none`}>
      <div className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg text-xs font-mono">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="w-4 h-4" />
          <button
            className="text-xs hover:text-blue-400 transition-colors pointer-events-auto"
            onClick={() => setIsVisible(!isVisible)}
          >
            Performance {isVisible ? '▼' : '▶'}
          </button>
        </div>
        
        {isVisible && (
          <div className="space-y-2 min-w-[200px]">
            {/* FPS */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                FPS:
              </span>
              <span className={getFpsColor(metrics.fps)}>
                {metrics.fps}
              </span>
            </div>

            {/* Memory */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MemoryStick className="w-3 h-3" />
                Memory:
              </span>
              <span className={getMemoryColor(metrics.memory)}>
                {metrics.memory}MB
              </span>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Network:
              </span>
              <span className="text-blue-400">
                {metrics.connection.effectiveType}
              </span>
            </div>

            {/* Core Web Vitals */}
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="text-xs font-semibold mb-1">Core Web Vitals</div>
              
              <div className="flex justify-between text-xs">
                <span>FCP:</span>
                <span className={metrics.timing.firstContentfulPaint < 1800 ? 'text-green-500' : 'text-yellow-500'}>
                  {Math.round(metrics.timing.firstContentfulPaint)}ms
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>LCP:</span>
                <span className={metrics.timing.largestContentfulPaint < 2500 ? 'text-green-500' : 'text-red-500'}>
                  {Math.round(metrics.timing.largestContentfulPaint)}ms
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>FID:</span>
                <span className={metrics.timing.firstInputDelay < 100 ? 'text-green-500' : 'text-red-500'}>
                  {Math.round(metrics.timing.firstInputDelay)}ms
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span>CLS:</span>
                <span className={metrics.timing.cumulativeLayoutShift < 0.1 ? 'text-green-500' : 'text-red-500'}>
                  {metrics.timing.cumulativeLayoutShift.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

PerformanceMonitorOverlay.displayName = 'PerformanceMonitorOverlay'

export default PerformanceMonitorOverlay
