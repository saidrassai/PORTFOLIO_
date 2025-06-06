import * as THREE from 'three'
import React, { useRef, useReducer, useMemo, useState, useEffect, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { LODConnector } from './LODConnector'
import { ConditionalPhysics } from './ConditionalPhysics'
import { ConditionalRigidBody } from './ConditionalRigidBody'
import { ConditionalCuboidCollider, ConditionalBallCollider } from './ConditionalColliders'

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

interface PointerProps {
  vec?: THREE.Vector3
  deviceCapabilities?: any
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
            <ambientLight intensity={0.4} />
            {deviceCapabilities.shadowQuality !== 'off' && (
                <spotLight 
                    position={[10, 10, 10]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1} 
                    castShadow={deviceCapabilities.shadowQuality !== 'low'}
                    shadow-mapSize-width={deviceCapabilities.shadowQuality === 'high' ? 2048 : 1024}
                    shadow-mapSize-height={deviceCapabilities.shadowQuality === 'high' ? 2048 : 1024}
                />            )}
            
            <ConditionalPhysics 
                enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                deviceCapabilities={deviceCapabilities}
                gravity={[0, 0, 0]}
                timeStep={deviceCapabilities.isLowEnd ? 1/30 : 1/60}
                paused={false}
                updatePriority={0}
                interpolate={!deviceCapabilities.isLowEnd}
            >                <Pointer deviceCapabilities={deviceCapabilities} />
                {limitedConnectors.map((props, i) => <Connector key={i} {...props} deviceCapabilities={deviceCapabilities} />)}                <Connector position={[10, 10, 5]} deviceCapabilities={deviceCapabilities}>
                    <LODConnector
                        clearcoat={1} 
                        thickness={0.1} 
                        anisotropicBlur={deviceCapabilities.isLowEnd ? 0.05 : 0.1} 
                        chromaticAberration={deviceCapabilities.isLowEnd ? 0.05 : 0.1} 
                        samples={deviceCapabilities.isLowEnd ? 4 : 8} 
                        resolution={deviceCapabilities.isLowEnd ? 256 : 512} 
                    />
                </Connector>
            </ConditionalPhysics>
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

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, deviceCapabilities, ...props }: ConnectorProps & { deviceCapabilities: any }) {
    const api = useRef<any>(null);
    const tempVec = useMemo(() => new THREE.Vector3(), []);
    const lastCollisionTime = useRef(0);
    const pos = useMemo(() => position || [r(10), r(10), r(10)] as [number, number, number], [position, r]);
    
    // Handle collisions with the pointer
    const handleCollision = (event: any) => {
        const now = performance.now();
        if (now - lastCollisionTime.current < 50) return; // Prevent too frequent collisions
        lastCollisionTime.current = now;
        
        if (!api.current) return;
        
        // Check if we collided with the cursor
        if (event.other?.rigidBody?.userData?.isPointer) {
            // Get positions
            const myPos = api.current.translation();
            const pointerPos = event.other.rigidBody.translation();
            
            // Get cursor velocity
            const pointerVelocity = event.other.rigidBody.userData.velocity || 5;
            
            // Direction to push the object away from pointer
            const direction = tempVec.set(
                myPos.x - pointerPos.x,
                myPos.y - pointerPos.y,
                myPos.z - pointerPos.z
            );
            
            // Scale force based on distance and velocity
            const distanceFactor = Math.max(0.5, 3 - direction.length() / 2);
            const impulsePower = 20 + pointerVelocity * 1.5 * distanceFactor;
            
            if (direction.length() > 0) {
                // Apply directional impulse
                direction.normalize().multiplyScalar(impulsePower);
                api.current.applyImpulse(direction, true);
                
                // Add some rotation
                const torqueStrength = Math.min(20, 5 + pointerVelocity * 0.8);
                const torque = new THREE.Vector3(
                    THREE.MathUtils.randFloatSpread(torqueStrength),
                    THREE.MathUtils.randFloatSpread(torqueStrength),
                    THREE.MathUtils.randFloatSpread(torqueStrength)
                );
                api.current.applyTorqueImpulse(torque, true);
            }
        }
    };
    
    // Center-seeking behavior
    useFrame((_state, delta) => {
        delta = Math.min(0.1, delta)
        if (api.current) {
            const position = api.current.translation();
            
            // Center-seeking force
            const direction = vec.copy(position).negate();
            const distance = direction.length();
            
            if (distance > 0) {
                direction.normalize();
                const strength = Math.min(10, Math.max(0.5, distance * 0.2));
                api.current.applyImpulse(direction.multiplyScalar(strength * delta * 60), true);
            }
            
            // Velocity damping when moving too fast
            const velocity = api.current.linvel();
            const velocityMagnitude = Math.sqrt(
                velocity.x * velocity.x + 
                velocity.y * velocity.y + 
                velocity.z * velocity.z
            );
            
            if (velocityMagnitude > 15) {
                api.current.applyImpulse(
                    tempVec.set(-velocity.x * 0.1, -velocity.y * 0.1, -velocity.z * 0.1),
                    true
                );
            }
        }
    })
      return (            <ConditionalRigidBody 
                enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                linearDamping={4} 
                angularDamping={1} 
                friction={0.1} 
                position={pos} 
                ref={api} 
                colliders={false}
                onCollisionEnter={handleCollision}
                userData={{ isConnector: true }}
                mass={1.5}
            >                {(!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile) && (
                    <>
                        <ConditionalCuboidCollider 
                            enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                            args={[0.38, 1.27, 0.38]} 
                        />
                        <ConditionalCuboidCollider 
                            enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                            args={[1.27, 0.38, 0.38]} 
                        />
                        <ConditionalCuboidCollider 
                            enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                            args={[0.38, 0.38, 1.27]} 
                        />
                    </>
                )}
                {children ? children : <LODConnector {...props} />}
                {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
            </ConditionalRigidBody>
    )
}

function Pointer({ vec = new THREE.Vector3(), deviceCapabilities }: PointerProps & { deviceCapabilities: any }) {
    const ref = useRef<any>(null);
    const prevPosition = useMemo(() => new THREE.Vector3(), []);
    const [velocity, setVelocity] = useState(0);
    const [active, setActive] = useState(false);
    
    // Track mouse activity for enhanced interaction
    useEffect(() => {
        const handleMouseDown = () => setActive(true);
        const handleMouseUp = () => setActive(false);
        
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    
    useFrame(({ mouse, viewport }) => {
        if (ref.current) {
            // Calculate world position from mouse coordinates
            const x = (mouse.x * viewport.width) / 2;
            const y = (mouse.y * viewport.height) / 2;
            const z = 0;
            
            // Create current position vector
            const currentPosition = new THREE.Vector3(x, y, z);
            
            // Calculate velocity for force-based interactions
            const delta = currentPosition.distanceTo(prevPosition);
            const newVelocity = Math.min(delta * 100, 20); // Cap max velocity
            setVelocity(newVelocity);
            
            // Update pointer position
            vec.set(x, y, z);
            if (ref.current.setNextKinematicTranslation) {
                ref.current.setNextKinematicTranslation(vec);
            }
            
            // Store userData for collision detection
            if (ref.current.rigidBody) {
                ref.current.rigidBody.userData = { 
                    isPointer: true, 
                    velocity: newVelocity,
                    active: active
                };
            }
            
            // Store position for next frame
            prevPosition.copy(currentPosition);
        }
    });
    
    return (
        <ConditionalRigidBody 
            enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
            position={[0, 0, 0]} 
            type="kinematicPosition" 
            colliders={false} 
            ref={ref}
            userData={{ isPointer: true, velocity }}
            ccd={true} // Enable continuous collision detection for smoother interaction
            mass={active ? 30 : 15} // Heavier when clicking
        >            {(!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile) && (
                <ConditionalBallCollider 
                    enablePhysics={!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile}
                    args={[active ? 3 : 2]} 
                    friction={0.1} 
                    restitution={0.2} 
                />
            )}
            
            {/* Debug visualization - only in development */}
          {/*  {import.meta.env.DEV && (
                <mesh visible={true}>
                    <sphereGeometry args={[active ? 3 : 2]} />
                    <meshBasicMaterial color={active ? "white" : "white"} wireframe transparent opacity={0.2} />
                </mesh>
            )} */}
        </ConditionalRigidBody>    )
}

// Create Scene3D component with exported name
const Scene3D = memo(() => (
    <div className="w-full h-full absolute inset-0 z-0 bg-gray-900">
        <Scene style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} />
    </div>
))

Scene3D.displayName = 'Scene3D'

export default Scene3D
