import * as THREE from 'three'
import { useRef, useReducer, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'

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

interface ModelProps {
  children?: React.ReactNode
  color?: string
  roughness?: number
  [key: string]: any
}

interface PointerProps {
  vec?: THREE.Vector3
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
    return (
        <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }} {...props}>
            <color attach="background" args={['black']} />
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />            <Physics 
                gravity={[0, 0, 0]}
                timeStep={1/60}
                paused={false}
                updatePriority={0}
                interpolate={true}
            >
                <Pointer />
                {connectors.map((props, i) => <Connector key={i} {...props} />)}
                <Connector position={[10, 10, 5]}>
                    <Model>
                        <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
                    </Model>
                </Connector>
            </Physics><EffectComposer multisampling={8}>
                <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
            </EffectComposer>
            <Environment resolution={256}>
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

function Connector({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, ...props }: ConnectorProps) {
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
    
    return (
        <RigidBody 
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
            <CuboidCollider args={[0.38, 1.27, 0.38]} />
            <CuboidCollider args={[1.27, 0.38, 0.38]} />
            <CuboidCollider args={[0.38, 0.38, 1.27]} />
            {children ? children : <Model {...props} />}
            {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
        </RigidBody>
    )
}

function Pointer({ vec = new THREE.Vector3() }: PointerProps) {
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
            ref.current.setNextKinematicTranslation(vec);
            
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
        <RigidBody 
            position={[0, 0, 0]} 
            type="kinematicPosition" 
            colliders={false} 
            ref={ref}
            userData={{ isPointer: true, velocity }}
            ccd={true} // Enable continuous collision detection for smoother interaction
            mass={active ? 30 : 15} // Heavier when clicking
        >
            <BallCollider args={[active ? 3 : 2]} friction={0.1} restitution={0.2} />
            
            {/* Debug visualization - only in development */}
          {/*  {import.meta.env.DEV && (
                <mesh visible={true}>
                    <sphereGeometry args={[active ? 3 : 2]} />
                    <meshBasicMaterial color={active ? "white" : "white"} wireframe transparent opacity={0.2} />
                </mesh>
            )} */}
        </RigidBody>
    )
}

function Model({ children, color = 'white', roughness = 0 }: ModelProps) {
    const ref = useRef<THREE.Mesh>(null!);
    // Using a fallback model when the actual one isn't available
    const modelPath = '/models/connector.glb'; // Using the existing connector model
    const { nodes, materials } = useGLTF(modelPath);
    
    useFrame((_state, delta) => {
        if (ref.current?.material) {
            easing.dampC((ref.current.material as THREE.MeshStandardMaterial).color, color, 0.2, delta)
        }
    })
    
    return (
        <mesh ref={ref} castShadow receiveShadow scale={8} geometry={(nodes as any).connector.geometry}>
            <meshStandardMaterial metalness={0.2} roughness={roughness} map={(materials as any).base.map} />
            {children}
        </mesh>
    )
}

// Create Scene3D component with exported name
const Scene3D = () => (
    <div className="w-full h-full absolute inset-0 z-0 bg-gray-900">
        <Scene style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}} />
    </div>
)

export default Scene3D
