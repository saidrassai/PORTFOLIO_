import { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Define types
interface ModelProps {
  children?: React.ReactNode
  color?: string
  roughness?: number
  [key: string]: any
}

interface LODConnectorProps extends ModelProps {
  position?: [number, number, number]
  scale?: number
  [key: string]: any
}

// LOD distances for model quality switching
const LOD_DISTANCES = [8, 12, 18] // High, Medium, Low quality distances

// High-quality connector component (for close distances)
function HighQualityConnector(props: ModelProps) {
  const { nodes } = useGLTF('/models-optimized/connector.glb') as any
  
  return (
    <mesh 
      geometry={nodes.connector?.geometry} 
      castShadow 
      receiveShadow
    >
      <MeshTransmissionMaterial 
        backside 
        samples={16}  // High sample count for quality
        resolution={1024}  // High resolution
        transmission={1} 
        roughness={props.roughness || 0} 
        thickness={3.5} 
        ior={1.5} 
        chromaticAberration={0.1} 
        anisotropy={0.3} 
        distortion={0.5} 
        distortionScale={0.5} 
        temporalDistortion={0.1} 
        color={props.color} 
      />
    </mesh>
  )
}

// Medium-quality connector component (for medium distances)
function MediumQualityConnector(props: ModelProps) {
  const { nodes } = useGLTF('/models-optimized/connector.glb') as any
  
  return (
    <mesh 
      geometry={nodes.connector?.geometry} 
      castShadow 
      receiveShadow
    >
      <MeshTransmissionMaterial 
        samples={8}  // Reduced samples
        resolution={512}  // Reduced resolution
        transmission={1} 
        roughness={props.roughness || 0} 
        thickness={3.5} 
        ior={1.5} 
        chromaticAberration={0.05} 
        anisotropy={0.1} 
        distortion={0.3} 
        distortionScale={0.3} 
        temporalDistortion={0.05} 
        color={props.color} 
      />
    </mesh>
  )
}

// Low-quality connector component (for far distances)
function LowQualityConnector(props: ModelProps) {
  const { nodes } = useGLTF('/models-optimized/connector.glb') as any
  
  return (
    <mesh geometry={nodes.connector?.geometry}>
      <meshBasicMaterial 
        color={props.color} 
        transparent={true}
        opacity={0.7}
      />
    </mesh>
  )
}

// LOD Connector wrapper that switches quality based on distance
export function LODConnector(props: LODConnectorProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [distance, setDistance] = useState(0)
  
  // Update distance every few frames for performance
  let frameCount = 0
  useFrame(() => {
    frameCount++
    if (frameCount % 5 === 0 && groupRef.current && camera) {
      const dist = camera.position.distanceTo(groupRef.current.position)
      if (Math.abs(dist - distance) > 0.5) { // Only update if significant change
        setDistance(dist)
      }
    }
  })
  
  // Determine quality level based on distance with hysteresis to prevent flickering
  const QualityComponent = useMemo(() => {
    if (distance < LOD_DISTANCES[0]) return HighQualityConnector
    if (distance < LOD_DISTANCES[1]) return MediumQualityConnector
    return LowQualityConnector
  }, [distance])
  
  return (
    <group ref={groupRef} position={props.position} scale={props.scale}>
      <QualityComponent {...props} />
    </group>
  )
}

// Preload all model variants
useGLTF.preload('/models-optimized/connector.glb')
