import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, BallCollider } from '@react-three/rapier'

export const PhysicsPointer = () => {
  const ref = useRef<any>(null)
  const { viewport } = useThree()
  const vec = useMemo(() => new THREE.Vector3(), [])
  
  useFrame(({ mouse }) => {
    if (ref.current) {
      // Convert mouse coordinates to world space
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
      
      // Update kinematic body position
      ref.current.setNextKinematicTranslation(vec)
    }
  })
  
  return (
    <RigidBody 
      position={[0, 0, 0]} 
      type="kinematicPosition" 
      colliders={false} 
      ref={ref}
      name="pointer"
      userData={{ isPointer: true }}
    >
      <BallCollider args={[1.5]} sensor={false} />      {/* Debug visualization */}
      {import.meta.env.DEV && (
        <mesh visible={true}>
          <sphereGeometry args={[1.5]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      )}
    </RigidBody>
  )
}
