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
            >
                {(!deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile) ? (
                    <>
                        <Pointer deviceCapabilities={deviceCapabilities} />
                        {limitedConnectors.map((props, i) => <Connector key={i} {...props} deviceCapabilities={deviceCapabilities} />)}
                        <Connector position={[10, 10, 5]} deviceCapabilities={deviceCapabilities}>
                            <LODConnector
                                clearcoat={1} 
                                thickness={0.1} 
                                anisotropicBlur={deviceCapabilities.isLowEnd ? 0.05 : 0.1} 
                                chromaticAberration={deviceCapabilities.isLowEnd ? 0.05 : 0.1} 
                                samples={deviceCapabilities.isLowEnd ? 4 : 8} 
                                resolution={deviceCapabilities.isLowEnd ? 256 : 512} 
                            />
                        </Connector>
                    </>                ) : (
                    // Static version without physics for low-end devices
                    <>
                        {limitedConnectors.map((props, i) => {
                            const r = THREE.MathUtils.randFloatSpread;
                            const pos = [r(10), r(10), r(10)] as [number, number, number];
                            return (
                                <mesh key={i} position={pos}>
                                    <LODConnector {...props} />
                                </mesh>
                            );
                        })}
                        <mesh position={[10, 10, 5]}>
                            <LODConnector
                                clearcoat={1} 
                                thickness={0.1} 
                                anisotropicBlur={0.05} 
                                chromaticAberration={0.05} 
                                samples={4} 
                                resolution={256} 
                            />
                        </mesh>
                    </>
                )}
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

// Physics-enabled Connector component - TEST COMMIT to verify git push
function PhysicsConnector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, deviceCapabilities, ...props }: ConnectorProps & { deviceCapabilities: any }) {
    const api = useRef<any>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const tempVec = useMemo(() => new THREE.Vector3(), []);
    const lastCollisionTime = useRef(0);
    const pos = useMemo(() => position || [r(10), r(10), r(10)] as [number, number, number], [position, r]);
    
    // Handle collisions with the pointer
    const handleCollision = (event: any) => {
        const now = performance.now();
        if (now - lastCollisionTime.current < 50) return;
        lastCollisionTime.current = now;
        
        if (!api.current || !event.other?.rigidBody?.userData?.isPointer) return;
        
        try {
            const myPos = api.current.translation();
            const pointerPos = event.other.rigidBody.translation();
            const pointerVelocity = event.other.rigidBody.userData.velocity || 5;
            
            const direction = tempVec.set(
                myPos.x - pointerPos.x,
                myPos.y - pointerPos.y,
                myPos.z - pointerPos.z
            );
            
            const distanceFactor = Math.max(0.5, 3 - direction.length() / 2);
            const impulsePower = 20 + pointerVelocity * 1.5 * distanceFactor;
            
            if (direction.length() > 0) {
                direction.normalize().multiplyScalar(impulsePower);
                api.current.applyImpulse(direction, true);
                
                const torqueStrength = Math.min(20, 5 + pointerVelocity * 0.8);
                const torque = new THREE.Vector3(
                    THREE.MathUtils.randFloatSpread(torqueStrength),
                    THREE.MathUtils.randFloatSpread(torqueStrength),
                    THREE.MathUtils.randFloatSpread(torqueStrength)
                );
                api.current.applyTorqueImpulse(torque, true);
            }
        } catch (error) {
            console.warn('Physics collision error:', error);
        }
    };
    
    // Physics-based animation
    useFrame((_state, delta) => {
        delta = Math.min(0.1, delta);
        
        if (!api.current) return;
        
        try {
            const position = api.current.translation();
            
            // Center-seeking force
            const direction = vec.copy(position).negate();
            const distance = direction.length();
            
            if (distance > 0) {
                direction.normalize();
                const strength = Math.min(10, Math.max(0.5, distance * 0.2));
                api.current.applyImpulse(direction.multiplyScalar(strength * delta * 60), true);
            }
            
            // Velocity damping
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
        } catch (error) {
            console.warn('Physics frame error:', error);
        }
    });

    return (
        <ConditionalRigidBody 
            enablePhysics={true}
            linearDamping={4} 
            angularDamping={1} 
            friction={0.1} 
            position={pos} 
            ref={api} 
            colliders={false}
            onCollisionEnter={handleCollision}
            userData={{ isConnector: true }}
            mass={1.5}
        >
            <ConditionalCuboidCollider enablePhysics={true} args={[0.38, 1.27, 0.38]} />
            <ConditionalCuboidCollider enablePhysics={true} args={[1.27, 0.38, 0.38]} />
            <ConditionalCuboidCollider enablePhysics={true} args={[0.38, 0.38, 1.27]} />
            <mesh ref={meshRef}>
                {children ? children : <LODConnector {...props} />}
            </mesh>
            {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
        </ConditionalRigidBody>
    );
}

// Static Connector component (no physics)
function StaticConnector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, deviceCapabilities, ...props }: ConnectorProps & { deviceCapabilities: any }) {
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
}

// Main Connector component that chooses implementation
function Connector({ deviceCapabilities, ...props }: ConnectorProps & { deviceCapabilities: any }) {
    const isPhysicsEnabled = !deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile;
    
    if (isPhysicsEnabled) {
        return <PhysicsConnector deviceCapabilities={deviceCapabilities} {...props} />;
    } else {
        return <StaticConnector deviceCapabilities={deviceCapabilities} {...props} />;
    }
}// Physics-enabled Pointer component
function PhysicsPointer({ vec = new THREE.Vector3() }: PointerProps) {
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
        if (!ref.current) return;
        
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        const z = 0;
        
        const currentPosition = new THREE.Vector3(x, y, z);
        const delta = currentPosition.distanceTo(prevPosition);
        const newVelocity = Math.min(delta * 100, 20);
        setVelocity(newVelocity);
        
        vec.set(x, y, z);
        
        if (ref.current.setNextKinematicTranslation) {
            ref.current.setNextKinematicTranslation(vec);
        }
        
        if (ref.current.rigidBody) {
            ref.current.rigidBody.userData = { 
                isPointer: true, 
                velocity: newVelocity,
                active: active
            };
        }
        
        prevPosition.copy(currentPosition);
    });
    
    return (
        <ConditionalRigidBody 
            enablePhysics={true}
            position={[0, 0, 0]} 
            type="kinematicPosition" 
            colliders={false} 
            ref={ref}
            userData={{ isPointer: true, velocity }}
            ccd={true}
            mass={active ? 30 : 15}
        >
            <ConditionalBallCollider 
                enablePhysics={true}
                args={[active ? 3 : 2]} 
                friction={0.1} 
                restitution={0.2} 
            />
        </ConditionalRigidBody>
    );
}

// Static Pointer component (no physics, just visual)
function StaticPointer() {
    // For static mode, we don't need any pointer interaction
    return null;
}

// Main Pointer component that chooses implementation
function Pointer({ deviceCapabilities, ...props }: PointerProps & { deviceCapabilities: any }) {
    const isPhysicsEnabled = !deviceCapabilities.isLowEnd && !deviceCapabilities.isMobile;
    
    if (isPhysicsEnabled) {
        return <PhysicsPointer {...props} />;
    } else {
        return <StaticPointer />;
    }
}

// Create Scene3D component with exported name
const Scene3D = memo(() => (
    <div className="w-full h-full absolute inset-0 z-0 bg-gray-900">
        <Scene style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} />
    </div>
))

Scene3D.displayName = 'Scene3D'

export default Scene3D
