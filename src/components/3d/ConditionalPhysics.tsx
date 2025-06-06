import { Suspense, useState, useEffect, memo } from 'react'
import type { ReactNode } from 'react'
import { PhysicsAvailableContext } from '../../hooks/usePhysics'

interface ConditionalPhysicsProps {
  children: ReactNode
  enablePhysics?: boolean
  deviceCapabilities: {
    isLowEnd: boolean
    isMobile: boolean
  }
  gravity?: [number, number, number]
  timeStep?: number
  paused?: boolean
  updatePriority?: number
  interpolate?: boolean
}

// Static fallback component that just renders children without physics
const StaticContainer = memo(({ children }: { children: ReactNode }) => {
  return (
    <PhysicsAvailableContext.Provider value={false}>
      {children}
    </PhysicsAvailableContext.Provider>
  )
})

export const ConditionalPhysics = memo<ConditionalPhysicsProps>(({
  children,
  enablePhysics = false,
  deviceCapabilities,
  gravity = [0, 0, 0],
  timeStep,
  paused = false,
  updatePriority = 0,
  interpolate = true
}) => {
  const [shouldUsePhysics, setShouldUsePhysics] = useState(false)
  const [PhysicsComponent, setPhysicsComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    // Determine if we should use physics based on device capabilities and user preference
    const usePhysics = enablePhysics && 
                      !deviceCapabilities.isLowEnd && 
                      !deviceCapabilities.isMobile &&
                      // Only use physics if user hasn't disabled animations
                      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setShouldUsePhysics(usePhysics)

    if (usePhysics) {
      let mounted = true
      
      const loadPhysics = async () => {
        try {
          // Dynamic import to avoid loading physics bundle unless needed
          const { Physics } = await import('@react-three/rapier')
          if (mounted) {
            setPhysicsComponent(() => Physics)
          }
        } catch (error) {
          console.warn('Failed to load physics system, falling back to static mode:', error)
          setShouldUsePhysics(false)
        }
      }

      loadPhysics()
      
      return () => {
        mounted = false
      }
    }
  }, [enablePhysics, deviceCapabilities.isLowEnd, deviceCapabilities.isMobile])

  // If physics is disabled or failed to load, use static container
  if (!shouldUsePhysics || !PhysicsComponent) {
    return <StaticContainer>{children}</StaticContainer>
  }

  // Use physics system with optimized settings
  const effectiveTimeStep = timeStep || (deviceCapabilities.isLowEnd ? 1/30 : 1/60)
  const effectiveInterpolate = interpolate && !deviceCapabilities.isLowEnd
  return (
    <Suspense fallback={<StaticContainer>{children}</StaticContainer>}>
      <PhysicsAvailableContext.Provider value={true}>
        <PhysicsComponent
          gravity={gravity}
          timeStep={effectiveTimeStep}
          paused={paused}
          updatePriority={updatePriority}
          interpolate={effectiveInterpolate}
        >
          {children}
        </PhysicsComponent>
      </PhysicsAvailableContext.Provider>
    </Suspense>
  )
})

ConditionalPhysics.displayName = 'ConditionalPhysics'
