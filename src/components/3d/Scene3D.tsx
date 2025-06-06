import * as THREE from 'three'
import React, { useRef, useReducer, useMemo, useState, useEffect, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { LODConnector } from './LODConnector'

// Define types
interface ConnectorProps {
  position?: [number, number, number]
  children?: React.ReactNode
  vec?: THREE.Vector3
  scale?: number
  r?: (range: number) => number
  accent?: boolean
  color?: string
  roughness?: number
  [key: string]: any
}



const accents = ['#4060ff', '#20ffa0', '#ff4060', '#ffcc00']
const shuffle = (accent = 0) => [
    { color: '#444', roughness: 0.1 },
    { color: '#444', roughness: 0.75 },
    { color: '#444', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: 'white', roughness: 0.75 },
    { color: 'white', roughness: 0.1 },
    { color: accents[accent], roughness: 0.1, accent: true },
    { color: accents[accent], roughness: 0.75, accent: true },
    { color: accents[accent], roughness: 0.1, accent: true }
]

function Scene(props: any) {
    const [accent, click] = useReducer((state) => ++state % accents.length, 0)
    const connectors = useMemo(() => shuffle(accent), [accent])
    
    // Advanced device-based performance scaling
    const [deviceCapabilities, setDeviceCapabilities] = useState({
        isMobile: false,
        isLowEnd: false,
        pixelRatio: 1,
        antialias: true,
        particleCount: 9,
        shadowQuality: 'high' as 'high' | 'medium' | 'low' | 'off',
        postProcessing: true,
        maxConnectors: 9
    })
    
    useEffect(() => {
        // Track 3D scene initialization start time for analytics
        const sceneStartTime = performance.now()
        
        // Enhanced device detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
        const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth < 1024
        const isLowEnd = navigator.hardwareConcurrency <= 4 || window.screen.width <= 1366
        const memoryLimit = (navigator as any).deviceMemory || 4 // GB
        const isLowMemory = memoryLimit < 4
        
        // Enhanced performance scaling
        let pixelRatio = 1
        let shadowQuality: 'high' | 'medium' | 'low' | 'off' = 'high'
        let particleCount = 9
        let postProcessing = true
        let maxConnectors = 9
        
        if (isMobile) {
            pixelRatio = Math.min(window.devicePixelRatio, 1.5)
            shadowQuality = 'low'
            particleCount = 6
            postProcessing = false
            maxConnectors = 6
        } else if (isTablet || isLowEnd) {
            pixelRatio = Math.min(window.devicePixelRatio, 1.75)
            shadowQuality = 'medium'
            particleCount = 7
            postProcessing = true
            maxConnectors = 7
        } else if (isLowMemory) {
            pixelRatio = Math.min(window.devicePixelRatio, 2)
            shadowQuality = 'medium'
            particleCount = 8
            postProcessing = true
            maxConnectors = 8
        } else {
            pixelRatio = Math.min(window.devicePixelRatio, 2.5)
            shadowQuality = 'high'
            particleCount = 9
            postProcessing = true
            maxConnectors = 9
        }
        
        const antialias = !isMobile && !isLowEnd
        
        setDeviceCapabilities({
            isMobile,
            isLowEnd: isLowEnd || isLowMemory,
            pixelRatio,
            antialias,
            particleCount,
            shadowQuality,
            postProcessing,
            maxConnectors
        })
        
        // Report 3D scene load time for analytics
        if (typeof window !== 'undefined' && window.track3DSceneLoad) {
            window.track3DSceneLoad(sceneStartTime)
        }
    }, [])
    
    // Limit connectors based on device capability
    const limitedConnectors = useMemo(() => 
        connectors.slice(0, deviceCapabilities.maxConnectors), 
        [connectors, deviceCapabilities.maxConnectors]
    )
      return (
        <Canvas 
            onClick={click} 
            shadows={deviceCapabilities.shadowQuality !== 'off'} 
            dpr={[1, deviceCapabilities.pixelRatio]} 
            gl={{ 
                antialias: deviceCapabilities.antialias,
                alpha: false,
                powerPreference: deviceCapabilities.isMobile ? 'low-power' : 'high-performance',
                logarithmicDepthBuffer: deviceCapabilities.isLowEnd,
                precision: deviceCapabilities.isLowEnd ? 'mediump' : 'highp'
            }} 
            camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }} 
            {...props}
        >
            <color attach="background" args={['black']} />
            <ambientLight intensity={0.4} />            {deviceCapabilities.shadowQuality !== 'off' && (
                <spotLight 
                    position={[10, 10, 10]}
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1} 
                    castShadow={deviceCapabilities.shadowQuality !== 'low'}
                    shadow-mapSize-width={deviceCapabilities.shadowQuality === 'high' ? 2048 : 1024}
                    shadow-mapSize-height={deviceCapabilities.shadowQuality === 'high' ? 2048 : 1024}
                />
            )}
            <>
                {limitedConnectors.map((props, i) => {
                    const r = THREE.MathUtils.randFloatSpread;
                    const pos = [r(10), r(10), r(10)] as [number, number, number];
                    return (
                        <StaticConnector key={i} position={pos} deviceCapabilities={deviceCapabilities} {...props} />
                    );
                })}
                <StaticConnector position={[10, 10, 5]} deviceCapabilities={deviceCapabilities}>
                    <LODConnector
                        clearcoat={1} 
                        thickness={0.1} 
                        anisotropicBlur={0.05} 
                        chromaticAberration={0.05} 
                        samples={4} 
                        resolution={256} 
                    />
                </StaticConnector>
            </>
            {deviceCapabilities.postProcessing && (
                <EffectComposer multisampling={deviceCapabilities.isLowEnd ? 0 : 8}>
                    <N8AO 
                        distanceFalloff={1} 
                        aoRadius={1} 
                        intensity={deviceCapabilities.isLowEnd ? 2 : 4}
                        aoSamples={deviceCapabilities.isLowEnd ? 16 : 32}
                    />
                </EffectComposer>
            )}
            
            <Environment resolution={deviceCapabilities.isLowEnd ? 128 : 256}>
                <group rotation={[-Math.PI / 3, 0, 1]}>
                    <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
                </group>
            </Environment>
        </Canvas>
    )
}

// Static Connector component (simplified for stability)
const StaticConnector = memo(({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, deviceCapabilities, ...props }: ConnectorProps & { deviceCapabilities: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const pos = useMemo(() => position || [r(10), r(10), r(10)] as [number, number, number], [position, r]);
    
    // Simple floating animation
    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group position={pos}>
            <mesh ref={meshRef}>
                {children ? children : <LODConnector {...props} />}
            </mesh>
            {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
        </group>
    );
});

// Create Scene3D component with exported name
const Scene3D = memo(() => (
    <div className="w-full h-full absolute inset-0 z-0 bg-gray-900">
        <Scene style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} />
    </div>
))

Scene3D.displayName = 'Scene3D'

export default Scene3D
