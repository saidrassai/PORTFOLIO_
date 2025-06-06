import React, { Suspense, useState, useEffect } from 'react'

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

// Lazy load colliders
const CuboidColliderLazy = React.lazy(() => 
  import('@react-three/rapier').then(module => ({ default: module.CuboidCollider }))
)

const BallColliderLazy = React.lazy(() => 
  import('@react-three/rapier').then(module => ({ default: module.BallCollider }))
)

export function ConditionalCuboidCollider({ 
  enablePhysics, 
  ...props 
}: ConditionalColliderProps & CuboidColliderProps) {
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
      <CuboidColliderLazy {...props} />
    </Suspense>
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
