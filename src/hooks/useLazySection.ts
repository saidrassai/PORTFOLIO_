import { useState, useEffect, useRef } from 'react'

interface UseLazySectionOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useLazySection = (options: UseLazySectionOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver support
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsIntersecting(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          setShouldLoad(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return {
    elementRef,
    shouldLoad,
    isIntersecting,
  }
}

export default useLazySection
