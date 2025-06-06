import { memo, useState, useEffect, Suspense } from 'react'

interface CuboidColliderProps {
  args: [number, number, number]
  friction?: number
  restitution?: number
  [key: string]: any
}

interface BallColliderProps {
  args: [number]
  friction?: number
  restitution?: number
  [key: string]: any
}

interface ConditionalColliderProps {
  enablePhysics: boolean
  children?: React.ReactNode
}

export const ConditionalCuboidCollider = memo<ConditionalColliderProps & CuboidColliderProps>(({ 
  enablePhysics, 
  ...props 
}) => {
  const [CuboidColliderComponent, setCuboidColliderComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    if (enablePhysics && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let mounted = true
      
      const loadCuboidCollider = async () => {
        try {
          const { CuboidCollider } = await import('@react-three/rapier')
          if (mounted) {
            setCuboidColliderComponent(() => CuboidCollider)
          }
        } catch (error) {
          console.warn('Failed to load CuboidCollider:', error)
        }
      }

      loadCuboidCollider()
      
      return () => {
        mounted = false
      }
    }
  }, [enablePhysics])
  if (!enablePhysics || !CuboidColliderComponent) {
    return null
  }

  return <CuboidColliderComponent {...props} />
})

// Lazy-loaded BallCollider component
const BallColliderLazy = memo((props: BallColliderProps) => {
  const [BallColliderComponent, setBallColliderComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    let mounted = true
    
    const loadBallCollider = async () => {
      try {
        const { BallCollider } = await import('@react-three/rapier')
        if (mounted) {
          setBallColliderComponent(() => BallCollider)
        }
      } catch (error) {
        console.warn('Failed to load BallCollider:', error)
      }
    }

    loadBallCollider()
    
    return () => {
      mounted = false
    }
  }, [])

  if (!BallColliderComponent) {
    return null
  }

  return <BallColliderComponent {...props} />
})

export const ConditionalBallCollider = memo<ConditionalColliderProps & BallColliderProps>(({ 
  enablePhysics, 
  ...props 
}) => {
  if (!enablePhysics || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <BallColliderLazy {...props} />
    </Suspense>
  )
})
