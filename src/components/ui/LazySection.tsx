import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { useLazySection } from '../../hooks/useLazySection'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  className?: string
  id?: string
}

const defaultFallback = (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

const LazySection = ({ 
  children, 
  fallback = defaultFallback, 
  threshold = 0.1,
  className,
  id 
}: LazySectionProps) => {
  const { elementRef, shouldLoad } = useLazySection({ threshold })

  return (
    <section ref={elementRef} className={className} id={id}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
      )}
    </section>
  )
}

export default LazySection
