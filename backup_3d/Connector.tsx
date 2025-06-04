import * as THREE from 'three'
import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import ConnectorModel from './ConnectorModel'

interface ConnectorProps {
  position?: [number, number, number]
  color?: string
  roughness?: number
  accent?: boolean
  children?: React.ReactNode
  index?: number // Add index for orbital calculations
}

const Connector = ({ 
  position, 
  children, 
  accent, 
  color = 'white',
  roughness = 0.1,
  ...props 
}: ConnectorProps) => {
  const api = useRef<any>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const lastCollisionTime = useRef(0)
  
  // Random position if not provided
  const pos = useMemo(() => 
    position || [
      THREE.MathUtils.randFloatSpread(8), 
      THREE.MathUtils.randFloatSpread(8), 
      THREE.MathUtils.randFloatSpread(8)
    ] as [number, number, number], 
    [position]
  )  // Enhanced collision handling for more dynamic interactions
  const handleCollision = useCallback((event: any) => {
    const now = performance.now()
    if (now - lastCollisionTime.current < 30) return // Even faster response time
    lastCollisionTime.current = now
    
    if (!api.current) return
    
    // Check if collision is with cursor pointer
    if (event.other?.rigidBody?.userData?.isPointer) {
      // Get positions
      const myPos = api.current.translation()
      const pointerPos = event.other.rigidBody.translation()
      
      // Get cursor velocity for force calculation
      const pointerVelocity = event.other.rigidBody.userData.velocity || 5
      
      // Calculate repulsion vector
      const direction = vec.set(
        myPos.x - pointerPos.x,
        myPos.y - pointerPos.y,
        myPos.z - pointerPos.z
      )
      
      // Distance factor - closer hits are stronger
      const distanceFactor = Math.max(0.5, 3 - direction.length() / 2)
      
      // Apply velocity-based repulsion force
      if (direction.length() > 0) {
        // Calculate impulse strength based on cursor velocity and distance
        const impulsePower = 25 + pointerVelocity * 1.5 * distanceFactor
        
        // Apply directional impulse
        direction.normalize().multiplyScalar(impulsePower)
        api.current.applyImpulse(direction, true)
        
        // Add dynamic rotation based on impact velocity
        const torqueStrength = Math.min(30, 10 + pointerVelocity * 0.8)
        const torque = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(torqueStrength),
          THREE.MathUtils.randFloatSpread(torqueStrength),
          THREE.MathUtils.randFloatSpread(torqueStrength)
        )
        api.current.applyTorqueImpulse(torque, true)
      }
    } 
    // Very minimal interactions between connectors
    else if (event.other?.rigidBody?.name === 'connector') {
      // Almost no impact between connectors, just prevent overlap
      return;
    }
  }, [vec])
  
  // Apply dynamic center-seeking force each frame with orbital behavior
  useFrame((_state, delta) => {
    delta = Math.min(0.1, delta)
    
    if (!api.current) return
    
    // Get current position
    const position = api.current.translation()
    const distanceFromCenter = Math.sqrt(
      position.x * position.x + 
      position.y * position.y + 
      position.z * position.z
    )
    
    // Create layered orbital effect with multiple target radii
    // This creates nested rounded shapes around the center
    const targetRadius = props.index !== undefined 
      ? 2 + (Math.floor(props.index % 6) * 1.5) 
      : 5
      
    // Calculate forces to keep object in its orbital layer
    const radiusDelta = distanceFromCenter - targetRadius
    
    // Direction to center
    const direction = vec.set(
      -position.x,
      -position.y,
      -position.z
    )
    
    if (direction.length() > 0) {
      direction.normalize()
      
      // Apply radial force (toward or away from center to maintain orbit)
      const radialForce = direction.clone().multiplyScalar(radiusDelta * 0.8 * delta * 60)
      api.current.applyImpulse(radialForce, true)
      
      // Apply some angular momentum for orbit-like movement
      const tangent = new THREE.Vector3(
        -direction.y,
        direction.x,
        direction.z * 0.2
      ).normalize().multiplyScalar(0.04 * delta * 60)
      api.current.applyImpulse(tangent, true)
    }
    
    // Velocity damping for stability
    const velocity = api.current.linvel()
    const velocityMagnitude = Math.sqrt(
      velocity.x * velocity.x + 
      velocity.y * velocity.y + 
      velocity.z * velocity.z
    )
    
    // Apply stronger damping when moving too fast
    if (velocityMagnitude > 15) {
      api.current.applyImpulse(
        new THREE.Vector3(
          -velocity.x * 0.1, 
          -velocity.y * 0.1, 
          -velocity.z * 0.1
        ),
        true
      )
    }
  })
  
  return (
    <RigidBody 
      linearDamping={4} 
      angularDamping={1} 
      friction={0.1} 
      position={pos} 
      ref={api} 
      colliders={false}
      onCollisionEnter={handleCollision}
      mass={1}
    >
      {/* Cross-shaped collision detection */}
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      
      {children ? children : (
        <ConnectorModel 
          color={color} 
          roughness={roughness} 
          index={props.index} 
          {...props} 
        />
      )}
      
      {/* Accent lighting for special connectors */}
      {accent && (
        <pointLight 
          intensity={4} 
          distance={2.5} 
          color={color} 
        />
      )}
    </RigidBody>
  )
}

export default Connector
