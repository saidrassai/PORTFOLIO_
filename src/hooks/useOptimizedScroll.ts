import { useCallback, useEffect, useState } from 'react'

/**
 * Optimized scroll hook that throttles scroll events and provides debounced scroll data
 * @param throttleMs - Throttle interval in milliseconds (default: 16ms for 60fps)
 * @param debounceMs - Debounce interval for scroll end detection (default: 100ms)
 */
export const useOptimizedScroll = (throttleMs = 16, debounceMs = 100) => {
  const [scrollY, setScrollY] = useState(0)  
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  
  const throttle = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let lastExecTime = 0
    
    return (...args: any[]) => {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func(...args)
        lastExecTime = currentTime
      } else {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func(...args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }, [])

  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }, [])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY
      
      // Update scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }
      
      setScrollY(currentScrollY)
      setIsScrolling(true)
      lastScrollY = currentScrollY
    }, throttleMs)

    const handleScrollEnd = debounce(() => {
      setIsScrolling(false)
    }, debounceMs)

    const optimizedScrollHandler = () => {
      handleScroll()
      handleScrollEnd()
    }

    // Use passive listeners for better performance
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true })

    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler)
    }
  }, [throttle, debounce, throttleMs, debounceMs])

  return {
    scrollY,
    scrollDirection,
    isScrolling,
    // Helper computed values
    scrollProgress: Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1),
    isAtTop: scrollY < 10,
    isNearTop: scrollY < 100
  }
}

/**
 * Hook for scroll-based animations with requestAnimationFrame
 * @param callback - Function to call on scroll with scroll data
 * @param deps - Dependencies array for the callback
 */
export const useScrollAnimation = (
  callback: (data: { scrollY: number; progress: number; direction: 'up' | 'down' | null }) => void,
  deps: React.DependencyList = []
) => {
  const { scrollY, scrollDirection } = useOptimizedScroll(16) // 60fps
  
  useEffect(() => {
    let animationId: number
    
    const animate = () => {
      const progress = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)
      callback({ scrollY, progress, direction: scrollDirection })
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [callback, scrollY, scrollDirection, ...deps])
}

export default useOptimizedScroll
