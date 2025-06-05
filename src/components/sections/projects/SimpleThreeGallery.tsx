import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ProjectData {
  title: string
  status: string
  description?: string
  image: string
}

interface SimpleGalleryProps {
  projects: ProjectData[]
}

const SimpleThreeGallery: React.FC<SimpleGalleryProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return

    console.log('Initializing Simple Three.js Gallery')
    console.log('Projects:', projects)

    const container = containerRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Make sure canvas is visible
    const canvas = renderer.domElement
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '1'
    canvas.style.pointerEvents = 'none'
    
    container.appendChild(canvas)

    // Create a simple plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2)
    let material: THREE.MeshBasicMaterial
    let mesh: THREE.Mesh

    // Load first texture
    const loader = new THREE.TextureLoader()
    console.log('Loading first image:', projects[0].image)
    
    loader.load(
      projects[0].image,
      (texture) => {
        console.log('First texture loaded successfully')
        
        // Calculate aspect ratio
        const imageAspect = texture.image.width / texture.image.height
        const screenAspect = width / height
        
        if (imageAspect > screenAspect) {
          geometry.scale(screenAspect / imageAspect, 1, 1)
        } else {
          geometry.scale(1, imageAspect / screenAspect, 1)
        }

        material = new THREE.MeshBasicMaterial({ map: texture })
        mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        
        setIsLoaded(true)
        animate()
      },
      undefined,
      (error) => {
        console.error('Failed to load first texture:', error)
      }
    )

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
      renderer.dispose()
      geometry.dispose()
      if (material) material.dispose()
    }
  }, [projects])

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % projects.length
    setCurrentIndex(newIndex)
    console.log('Switching to image:', projects[newIndex].image)
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative',
        width: '100vw', 
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Loading indicator */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '24px',
          zIndex: 10
        }}>
          Loading Gallery...
        </div>
      )}

      {/* Controls */}
      {isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <button 
            onClick={nextImage}
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Next Image ({currentIndex + 1}/{projects.length})
          </button>
        </div>
      )}

      {/* Project info */}
      {isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          color: 'white',
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h2>{projects[currentIndex].title}</h2>
          <p><strong>Status:</strong> {projects[currentIndex].status}</p>
          <p>{projects[currentIndex].description}</p>
        </div>
      )}
    </div>
  )
}

export default SimpleThreeGallery
