import { memo, useState, useEffect } from 'react'

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
  )
}

export function ConditionalBallCollider({ 
  enablePhysics, 
  ...props 
}: ConditionalColliderProps & BallColliderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (enablePhysics) {
      setIsLoaded(true)
    }
  }, [enablePhysics])

  if (!enablePhysics || !isLoaded) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <BallColliderLazy {...props} />
    </Suspense>
  )
}
