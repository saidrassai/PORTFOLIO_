/**
 * Memory Management Utilities
 * Prevents memory leaks and optimizes memory usage in React applications
 */
import { useEffect, useState } from 'react'

// Cleanup registry for tracking active subscriptions, timers, and observers
class CleanupRegistry {
  private cleanupFunctions: Set<() => void> = new Set()
  private observers: Set<IntersectionObserver | ResizeObserver | MutationObserver> = new Set()
  private timers: Set<number> = new Set()
  private eventListeners: Set<{ element: EventTarget; event: string; handler: EventListener }> = new Set()

  // Register a cleanup function
  registerCleanup(cleanup: () => void): void {
    this.cleanupFunctions.add(cleanup)
  }

  // Register an observer
  registerObserver(observer: IntersectionObserver | ResizeObserver | MutationObserver): void {
    this.observers.add(observer)
  }

  // Register a timer
  registerTimer(timerId: number): void {
    this.timers.add(timerId)
  }

  // Register an event listener
  registerEventListener(element: EventTarget, event: string, handler: EventListener): void {
    this.eventListeners.add({ element, event, handler })
  }

  // Clean up all registered items
  cleanup(): void {
    // Run custom cleanup functions
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.warn('Error during cleanup:', error)
      }
    })

    // Disconnect observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect()
      } catch (error) {
        console.warn('Error disconnecting observer:', error)
      }
    })

    // Clear timers
    this.timers.forEach(timerId => {
      try {
        clearTimeout(timerId)
        clearInterval(timerId)
      } catch (error) {
        console.warn('Error clearing timer:', error)
      }
    })

    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler)
      } catch (error) {
        console.warn('Error removing event listener:', error)
      }
    })

    // Clear all registries
    this.cleanupFunctions.clear()
    this.observers.clear()
    this.timers.clear()
    this.eventListeners.clear()
  }
}

// Global cleanup registry
const globalCleanupRegistry = new CleanupRegistry()

// Memory monitoring utilities
export const memoryUtils = {
  // Get current memory usage (if available)
  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  },

  // Check if memory usage is high
  isMemoryUsageHigh(threshold: number = 100): boolean {
    const usage = this.getMemoryUsage()
    return usage ? usage.used > threshold : false
  },

  // Force garbage collection (Chrome DevTools only)
  forceGarbageCollection(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc()
    }
  },

  // Log memory usage to console
  logMemoryUsage(label: string = 'Memory Usage'): void {
    const usage = this.getMemoryUsage()
    if (usage) {
      console.info(`${label}: ${usage.used}MB / ${usage.total}MB (${usage.limit}MB limit)`)
    }
  }
}

// React hook for cleanup management
export const useCleanup = (cleanupFn?: () => void): CleanupRegistry => {
  const registry = new CleanupRegistry()

  useEffect(() => {
    if (cleanupFn) {
      registry.registerCleanup(cleanupFn)
    }

    return () => {
      registry.cleanup()
    }
  }, [registry, cleanupFn])

  return registry
}

// React hook for memory monitoring
export const useMemoryMonitor = (
  threshold: number = 100,
  onHighMemory?: (usage: { used: number; total: number; limit: number }) => void
) => {
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; limit: number } | null>(null)
  const [isHighMemory, setIsHighMemory] = useState(false)

  useEffect(() => {
    const checkMemory = () => {
      const usage = memoryUtils.getMemoryUsage()
      if (usage) {
        setMemoryUsage(usage)
        const isHigh = usage.used > threshold
        setIsHighMemory(isHigh)
        
        if (isHigh && onHighMemory) {
          onHighMemory(usage)
        }
      }
    }

    // Check memory immediately
    checkMemory()

    // Check memory every 5 seconds
    const interval = setInterval(checkMemory, 5000)

    return () => clearInterval(interval)
  }, [threshold, onHighMemory])

  return { memoryUsage, isHighMemory }
}

// Optimized event listener hook
export const useOptimizedEventListener = (
  element: EventTarget | null,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) => {
  const registry = useCleanup()

  useEffect(() => {
    if (!element) return

    // Add throttling for high-frequency events
    const throttledHandler = event === 'scroll' || event === 'resize' || event === 'mousemove'
      ? throttle(handler, 16) // ~60fps
      : handler

    element.addEventListener(event, throttledHandler, options)
    registry.registerEventListener(element, event, throttledHandler)

    return () => {
      element.removeEventListener(event, throttledHandler, options)
    }
  }, [element, event, handler, options, registry])
}

// Throttle utility for high-frequency events
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: number | null = null
  let lastExecTime = 0

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
        timeoutId = null
      }, delay - (currentTime - lastExecTime))
    }
  }) as T
}

// Debounce utility for delayed execution
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: number | null = null

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => func(...args), delay)
  }) as T
}

// Export cleanup registry for manual cleanup
export { CleanupRegistry, globalCleanupRegistry }
