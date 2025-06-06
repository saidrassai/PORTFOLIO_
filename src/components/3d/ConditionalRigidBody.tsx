import { memo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface ConditionalRigidBodyProps {
  children: ReactNode
  enablePhysics?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
  // Add other RigidBody props as needed
  [key: string]: any
}

// Static container for non-physics mode
const StaticRigidBody = memo(({ 
  children, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  ...props 
}: ConditionalRigidBodyProps) => {
  return (
    <group position={position} rotation={rotation} {...props}>
      {children}
    </group>
  )
})

export const ConditionalRigidBody = memo<ConditionalRigidBodyProps>(({
  children,
  enablePhysics = false,
  ...props
}) => {
  const [RigidBodyComponent, setRigidBodyComponent] = useState<React.ComponentType<any> | null>(null)
  const [shouldUsePhysics, setShouldUsePhysics] = useState(false)

  useEffect(() => {
    if (enablePhysics && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let mounted = true
      
      const loadRigidBody = async () => {
        try {
          const { RigidBody } = await import('@react-three/rapier')
          if (mounted) {
            setRigidBodyComponent(() => RigidBody)
            setShouldUsePhysics(true)
          }
        } catch (error) {
          console.warn('Failed to load RigidBody, using static version:', error)
          setShouldUsePhysics(false)
        }
      }

      loadRigidBody()
      
      return () => {
        mounted = false
      }
    }
  }, [enablePhysics])

  if (!shouldUsePhysics || !RigidBodyComponent) {
    return <StaticRigidBody {...props}>{children}</StaticRigidBody>
  }

  return (
    <RigidBodyComponent {...props}>
      {children}
    </RigidBodyComponent>
  )
})

ConditionalRigidBody.displayName = 'ConditionalRigidBody'
