import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import './ProjectSliderEnhanced.scss'

interface ProjectData {
  title: string
  status: string
  description?: string
  image: string
}

interface ProjectSliderProps {
  projects: ProjectData[]
  autoPlay?: boolean
  interval?: number
}

const ProjectSliderEnhanced: React.FC<ProjectSliderProps> = ({ 
  projects, 
  autoPlay = false, 
  interval = 4000 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  const nextSlide = useCallback(() => {
    if (sliderRef.current && !sliderRef.current.isAnimating) {
      const nextIndex = (currentSlide + 1) % projects.length
      sliderRef.current.goToSlide(nextIndex)
    }
  }, [currentSlide, projects.length])

  const prevSlide = useCallback(() => {
    if (sliderRef.current && !sliderRef.current.isAnimating) {
      const prevIndex = currentSlide === 0 ? projects.length - 1 : currentSlide - 1
      sliderRef.current.goToSlide(prevIndex)
    }
  }, [currentSlide, projects.length])

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return

    let scene: THREE.Scene
    let camera: THREE.OrthographicCamera
    let renderer: THREE.WebGLRenderer
    let geometry: THREE.PlaneGeometry
    let material: THREE.ShaderMaterial
    let mesh: THREE.Mesh
    let textures: THREE.Texture[] = []
    let currentIndex = 0
    let nextIndex = 1
    let isAnimating = false

    const vertex = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `

    const fragment = `
      varying vec2 vUv;
      uniform sampler2D currentImage;
      uniform sampler2D nextImage;
      uniform float dispFactor;

      void main() {
        vec2 uv = vUv;
        vec4 _currentImage;
        vec4 _nextImage;
        float intensity = 0.3;

        vec4 orig1 = texture2D(currentImage, uv);
        vec4 orig2 = texture2D(nextImage, uv);
        
        _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
        _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

        vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
        gl_FragColor = finalTexture;
      }
    `

    const init = () => {
      const container = containerRef.current!
      const renderWidth = window.innerWidth
      const renderHeight = window.innerHeight
      
      // Scene setup
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x23272a)
      
      camera = new THREE.OrthographicCamera(
        renderWidth / -2,
        renderWidth / 2,
        renderHeight / 2,
        renderHeight / -2,
        1,
        1000
      )
      camera.position.z = 1

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setSize(renderWidth, renderHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x23272a, 1.0)
      container.appendChild(renderer.domElement)

      // Load textures
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = "anonymous"
      
      const loadPromises = projects.map((project: ProjectData) => 
        new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            project.image + "?v=" + Date.now(), 
            (texture) => {
              texture.magFilter = texture.minFilter = THREE.LinearFilter
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
              resolve(texture)
            }, 
            undefined, 
            reject
          )
        })
      )

      Promise.all(loadPromises).then(loadedTextures => {
        textures = loadedTextures

        // Create geometry and material
        geometry = new THREE.PlaneGeometry(renderWidth, renderHeight, 1, 1)
        material = new THREE.ShaderMaterial({
          uniforms: {
            dispFactor: { value: 0.0 },
            currentImage: { value: textures[0] },
            nextImage: { value: textures[1] || textures[0] }
          },
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: false
        })

        mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 0, 0)
        scene.add(mesh)

        setIsLoaded(true)
        animate()
      }).catch(error => {
        console.error('Error loading textures:', error)
      })
    }

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    const goToSlide = (index: number) => {
      if (isAnimating || index === currentIndex || !textures[index]) return
      
      isAnimating = true
      nextIndex = index
      
      material.uniforms.nextImage.value = textures[nextIndex]
      
      const startTime = Date.now()
      const duration = 1200
      
      const animateTransition = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Expo easing
        const easeInOutExpo = (t: number) => {
          if (t === 0) return 0
          if (t === 1) return 1
          if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2
          return (2 - Math.pow(2, -20 * t + 10)) / 2
        }
        
        const easedProgress = easeInOutExpo(progress)
        material.uniforms.dispFactor.value = easedProgress
        
        if (progress < 1) {
          requestAnimationFrame(animateTransition)
        } else {
          material.uniforms.currentImage.value = textures[nextIndex]
          material.uniforms.dispFactor.value = 0
          currentIndex = nextIndex
          isAnimating = false
          setCurrentSlide(currentIndex)
        }
      }
      
      animateTransition()
    }

    // Store references for cleanup
    sliderRef.current = { goToSlide, isAnimating: () => isAnimating }

    init()

    // Handle resize
    const handleResize = () => {
      const renderWidth = window.innerWidth
      const renderHeight = window.innerHeight
      
      camera.left = renderWidth / -2
      camera.right = renderWidth / 2
      camera.top = renderHeight / 2
      camera.bottom = renderHeight / -2
      camera.updateProjectionMatrix()
      
      renderer.setSize(renderWidth, renderHeight)
      
      if (geometry) {
        geometry.dispose()
        geometry = new THREE.PlaneGeometry(renderWidth, renderHeight, 1, 1)
        mesh.geometry = geometry
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
      
      if (geometry) geometry.dispose()
      if (material) material.dispose()
      textures.forEach(texture => texture.dispose())
    }
  }, [projects])

  // Mouse scroll functionality
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLoaded || !sliderRef.current) return
      
      e.preventDefault()
        // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Debounce scroll events
      scrollTimeoutRef.current = window.setTimeout(() => {        if (e.deltaY > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
      }, 100)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        container.removeEventListener('wheel', handleWheel)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [isLoaded, nextSlide, prevSlide])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isLoaded || !sliderRef.current) return

    const intervalId = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(intervalId)
  }, [autoPlay, isLoaded, interval, nextSlide])

  const handleSlideChange = (index: number) => {
    if (sliderRef.current && index !== currentSlide) {
      sliderRef.current.goToSlide(index)
    }
  }

  const currentProject = projects[currentSlide] || projects[0]

  return (
    <div className="project-slider-fullscreen">
      <div 
        ref={containerRef} 
        className="displacement-slider-fullscreen"
      />
      
      {/* Project Content Overlay */}
      <div className="slider-content-overlay">
        <div className="project-info">
          <div className="meta">Projects</div>
          <h2 className="project-title">
            {currentProject?.title || 'Loading...'}
          </h2>
          <div className="meta">Status</div>
          <div className="project-status">
            {currentProject?.status || 'In Development'}
          </div>
          {currentProject?.description && (
            <div className="project-description">
              {currentProject.description}
            </div>
          )}
        </div>
      </div>

      {/* Pagination controls */}
      <div className="slider-pagination-fullscreen">
        {projects.map((_, index: number) => (
          <button
            key={index}
            className={`pagination-dot-fullscreen ${currentSlide === index ? 'active' : ''}`}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Instructions */}
      <div className="scroll-hint">
        <div className="scroll-icon">↕</div>
        <span>Scroll to navigate</span>
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="slider-loading-fullscreen">
          <div className="loading-spinner"></div>
          <span>Loading WebGL Gallery...</span>
        </div>
      )}
    </div>
  )
}

export default ProjectSliderEnhanced
