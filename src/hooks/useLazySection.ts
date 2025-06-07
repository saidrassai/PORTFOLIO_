import { useState, useEffect, useRef } from 'react'

interface UseLazySectionOptions {
  threshold?: number
  rootMargin?: string
}

export const useLazySection = ({
  threshold = 0.1,
  rootMargin = '50px'
}: UseLazySectionOptions = {}) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin])

  return { shouldLoad, elementRef }
}