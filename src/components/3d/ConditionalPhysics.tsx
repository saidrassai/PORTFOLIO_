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

// Physics wrapper component - only loaded when needed
const PhysicsWrapper = memo<ConditionalPhysicsProps & { PhysicsComponent: React.ComponentType<any> }>(({
  children,
  PhysicsComponent,
  deviceCapabilities,
  gravity = [0, 0, 0],
  timeStep,
  paused = false,
  updatePriority = 0,
  interpolate = true
}) => {
  const effectiveTimeStep = timeStep || (deviceCapabilities.isLowEnd ? 1/30 : 1/60)
  const effectiveInterpolate = interpolate && !deviceCapabilities.isLowEnd
  
  return (
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
  )
})

export const ConditionalPhysics = memo<ConditionalPhysicsProps>(({
  children,
  enablePhysics = false,
  deviceCapabilities,
  ...physicsProps
}) => {
  const [physicsState, setPhysicsState] = useState<{
    shouldUse: boolean
    component: React.ComponentType<any> | null
    loading: boolean
  }>({
    shouldUse: false,
    component: null,
    loading: false
  })

  useEffect(() => {
    // Determine if we should use physics based on device capabilities and user preference
    const shouldUsePhysics = enablePhysics && 
                            !deviceCapabilities.isLowEnd && 
                            !deviceCapabilities.isMobile &&
                            // Only use physics if user hasn't disabled animations
                            !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!shouldUsePhysics) {
      setPhysicsState({ shouldUse: false, component: null, loading: false })
      return
    }

    // If we should use physics but haven't loaded it yet
    if (shouldUsePhysics && !physicsState.component && !physicsState.loading) {
      setPhysicsState(prev => ({ ...prev, loading: true }))
      
      const loadPhysics = async () => {
        try {
          // Dynamic import to avoid loading physics bundle unless needed
          const { Physics } = await import('@react-three/rapier')
          setPhysicsState({
            shouldUse: true,
            component: Physics,
            loading: false
          })
        } catch (error) {
          console.warn('Failed to load physics system, falling back to static mode:', error)
          setPhysicsState({
            shouldUse: false,
            component: null,
            loading: false
          })
        }
      }

      loadPhysics()
    }
  }, [enablePhysics, deviceCapabilities.isLowEnd, deviceCapabilities.isMobile, physicsState.component, physicsState.loading])

  // If physics is disabled, loading, or failed to load, use static container
  if (!physicsState.shouldUse || physicsState.loading || !physicsState.component) {
    return <StaticContainer>{children}</StaticContainer>
  }

  // Use physics system
  return (
    <Suspense fallback={<StaticContainer>{children}</StaticContainer>}>
      <PhysicsWrapper
        PhysicsComponent={physicsState.component}
        deviceCapabilities={deviceCapabilities}
        {...physicsProps}
      >
        {children}
      </PhysicsWrapper>
    </Suspense>
  )
})

ConditionalPhysics.displayName = 'ConditionalPhysics'
