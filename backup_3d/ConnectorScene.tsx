import { useReducer, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { Environment, Lightformer } from '@react-three/drei'
import Connector from './Connector'
import CursorPointer from './CursorPointer'

// Color accents for connectors
const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']

// Material properties generator with more variations and organization
const generateMaterials = (accent = 0) => {
  // Create a structured array of materials for better orbital organization
  const materials = []
  
  // Inner orbit shapes (smaller, darker)
  materials.push({ color: '#333', roughness: 0.1, index: 0 })
  materials.push({ color: '#444', roughness: 0.75, index: 1 })
  materials.push({ color: 'white', roughness: 0.1, index: 2 })
  
  // Middle orbit shapes (medium, accented)
  materials.push({ color: accents[accent], roughness: 0.1, accent: true, index: 6 })
  materials.push({ color: accents[accent], roughness: 0.75, accent: true, index: 7 })
  materials.push({ color: 'white', roughness: 0.25, index: 8 })
  materials.push({ color: '#555', roughness: 0.5, index: 9 })
  
  // Outer orbit shapes (larger, varied)
  materials.push({ color: accents[(accent + 1) % accents.length], roughness: 0.3, accent: true, index: 12 })
  materials.push({ color: accents[(accent + 2) % accents.length], roughness: 0.6, index: 13 })
  materials.push({ color: '#666', roughness: 0.2, index: 14 })
  materials.push({ color: 'white', roughness: 0.9, index: 15 })
  
  // Add additional nested center shapes (smallest, bright)
  materials.push({ color: 'white', roughness: 0.05, index: 3 })
  materials.push({ color: accents[(accent + 3) % accents.length], roughness: 0.1, accent: true, index: 4 })
  materials.push({ color: '#222', roughness: 0.3, index: 5 })
  
  return materials
}

const ConnectorScene = () => {
  const [accent, cycleAccent] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => generateMaterials(accent), [accent])
  
  return (
    <Canvas
      onClick={cycleAccent}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ background: 'transparent' }}
    >
      {/* Zero gravity physics world with improved settings */}
      <Physics 
        gravity={[0, 0, 0]} 
        timeStep={1/60}
        paused={false}
      >
        <CursorPointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
      </Physics>
      
      {/* Post-processing effects */}
      <EffectComposer multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      
      {/* Professional lighting setup */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer 
            form="circle" 
            intensity={4} 
            rotation-x={Math.PI / 2} 
            position={[0, 5, -9]} 
            scale={2} 
          />
          <Lightformer 
            form="circle" 
            intensity={2} 
            rotation-y={Math.PI / 2} 
            position={[-5, 1, -1]} 
            scale={2} 
          />
          <Lightformer 
            form="circle" 
            intensity={2} 
            rotation-y={-Math.PI / 2} 
            position={[10, 1, 0]} 
            scale={8} 
          />
        </group>
      </Environment>
    </Canvas>
  )
}

export default ConnectorScene
