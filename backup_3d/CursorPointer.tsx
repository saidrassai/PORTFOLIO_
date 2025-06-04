import * as THREE from 'three'
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, BallCollider } from '@react-three/rapier'

const CursorPointer = () => {
  const ref = useRef<any>(null)
  const { mouse, viewport } = useThree()
  const vec = useMemo(() => new THREE.Vector3(), [])
  const prevPosition = useMemo(() => new THREE.Vector3(), [])
  const [velocity, setVelocity] = useState(0)
  const [active, setActive] = useState(false)
  
  // Track mouse activity for enhanced interaction
  useEffect(() => {
    const handleMouseDown = () => setActive(true)
    const handleMouseUp = () => setActive(false)
    
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
  
  useFrame(() => {
    if (ref.current) {
      // Calculate world position from mouse coordinates
      const x = (mouse.x * viewport.width) / 2
      const y = (mouse.y * viewport.height) / 2
      const z = 0
      
      // Store current position
      const currentPosition = new THREE.Vector3(x, y, z)
      
      // Calculate velocity for force-based interactions
      const delta = currentPosition.distanceTo(prevPosition)
      const newVelocity = Math.min(delta * 100, 20) // Cap max velocity
      setVelocity(newVelocity)
      
      // Update position
      vec.set(x, y, z)
      ref.current.setNextKinematicTranslation(vec)
      
      // Store user data in the rigid body for access in collisions
      ref.current.rigidBody.userData.velocity = newVelocity
      ref.current.rigidBody.userData.isActive = active
      
      // Store position for next frame
      prevPosition.copy(currentPosition)
    }
  })
    
  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      colliders={false}
      userData={{ isPointer: true, velocity, active }}
      mass={active ? 30 : 15} // Heavier when clicking
      ccd={true} // Enable continuous collision detection for smoother interaction
    >
      <BallCollider 
        args={[active ? 2.5 : 2]} 
        friction={0.1} 
        restitution={0.2} 
      />
      
      {/* Debug sphere - invisible in production */}
      <mesh visible={import.meta.env.DEV}>
        <sphereGeometry args={[active ? 2.5 : 2]} />
        <meshBasicMaterial 
          color={active ? "#ff0030" : "#ff3060"} 
          transparent 
          opacity={0.2} 
          wireframe 
        />
      </mesh>
    </RigidBody>
  )
}

// Export with more detailed settings for cursor physics behavior
export default CursorPointer
