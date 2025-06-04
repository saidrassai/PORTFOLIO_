import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'

interface ConnectorModelProps {
  color?: string
  roughness?: number
  children?: React.ReactNode
  index?: number
}

const ConnectorModel = ({ 
  children, 
  color = 'white', 
  roughness = 0,
  index = 0
}: ConnectorModelProps) => {
  const ref = useRef<THREE.Mesh>(null)
  const { nodes, materials } = useGLTF('/models/connector.glb')
  
  // Calculate scale based on index - inner orbitals are smaller
  const scale = useMemo(() => {
    const baseScale = 10
    const scaleFactor = index !== undefined 
      ? Math.max(0.6, 1 - (index % 6) * 0.08) 
      : 1
    return baseScale * scaleFactor
  }, [index])
  
  // Smooth color transitions
  useFrame((_state, delta) => {
    if (ref.current?.material) {
      easing.dampC(
        (ref.current.material as THREE.MeshStandardMaterial).color, 
        color, 
        0.2, 
        delta
      )
      
      // Add subtle breathing animation
      const breathingScale = 1 + Math.sin(Date.now() * 0.001 + (index || 0) * 0.5) * 0.03
      ref.current.scale.set(scale * breathingScale, scale * breathingScale, scale * breathingScale)
    }
  })
    
  return (
    <mesh 
      ref={ref} 
      castShadow 
      receiveShadow 
      scale={scale} 
      geometry={(nodes as any).connector.geometry}
    >      <meshStandardMaterial 
        metalness={0.4} 
        roughness={roughness} 
        map={(materials as any).base.map}
        envMapIntensity={0.8}
      />
      {children}
    </mesh>
  )
}

// Preload the 3D model
useGLTF.preload('/models/connector.glb')

export default ConnectorModel
