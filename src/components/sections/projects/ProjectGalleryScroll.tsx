import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import './ProjectGalleryScroll.scss'

interface ProjectData {
  title: string
  status: string
  description?: string
  image: string
}

interface ProjectGalleryScrollProps {
  projects: ProjectData[]
}

const ProjectGalleryScroll: React.FC<ProjectGalleryScrollProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  console.log('ProjectGalleryScroll rendered with projects:', projects)

  // Calculate which slide should be active based on scroll position
  const updateSlideFromScroll = useCallback((progress: number) => {
    const slideIndex = Math.floor(progress * projects.length)
    const clampedIndex = Math.max(0, Math.min(slideIndex, projects.length - 1))
    
    if (clampedIndex !== currentSlide && sliderRef.current && isLoaded) {
      sliderRef.current.goToSlide(clampedIndex)
    }
  }, [currentSlide, projects.length, isLoaded])

  // Intersection Observer to track scroll position within the gallery section
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const containerHeight = container.offsetHeight
        // Calculate how much of the container is visible
      const visibleTop = Math.max(0, -rect.top)
      
      // Calculate scroll progress (0 to 1) within the gallery section
      const totalScrollableHeight = containerHeight - windowHeight
      const progress = totalScrollableHeight > 0 ? visibleTop / totalScrollableHeight : 0
      const clampedProgress = Math.max(0, Math.min(1, progress))
      
      setScrollProgress(clampedProgress)
      updateSlideFromScroll(clampedProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [updateSlideFromScroll])
  useEffect(() => {
    console.log('ProjectGalleryScroll useEffect called, projects:', projects.length)
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
        const canvas = renderer.domElement
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '-1'
      container.appendChild(canvas)

      // Load textures
      const loader = new THREE.TextureLoader()
      // loader.crossOrigin = "anonymous" // Not needed for local files
        const loadPromises = projects.map((project: ProjectData) => 
        new Promise<THREE.Texture>((resolve, reject) => {
          console.log('Loading texture for:', project.image)
          loader.load(
            project.image, // Remove cache busting for local files 
            (texture) => {
              console.log('Texture loaded successfully:', project.image)
              texture.magFilter = texture.minFilter = THREE.LinearFilter
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
              resolve(texture)
            }, 
            undefined, 
            (error) => {
              console.error('Failed to load texture:', project.image, error)
              reject(error)
            }
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

    // Store references
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

  const currentProject = projects[currentSlide] || projects[0]

  return (
    <div className="project-gallery-scroll" ref={containerRef}>
      {/* Content overlay that scrolls with the page */}
      <div className="gallery-content">
        <div className="project-info-scroll">
          <div className="meta">Projects</div>
          <h2 className="project-title-scroll">
            {currentProject?.title || 'Loading...'}
          </h2>
          <div className="meta">Status</div>
          <div className="project-status-scroll">
            {currentProject?.status || 'In Development'}
          </div>
          {currentProject?.description && (
            <div className="project-description-scroll">
              {currentProject.description}
            </div>
          )}
        </div>

        {/* Scroll progress indicator */}
        <div className="scroll-progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className="progress-slides">
            {projects.map((_, index) => (
              <div
                key={index}
                className={`progress-slide ${currentSlide === index ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Parallax content sections for each project */}
        {projects.map((project, index) => (
          <div
            key={index}
            className={`project-section ${currentSlide === index ? 'active' : ''}`}
            style={{ 
              transform: `translateY(${(index - scrollProgress * (projects.length - 1)) * 100}vh)`,
              opacity: currentSlide === index ? 1 : 0.3
            }}
          >
            <div className="project-details">
              <h3>{project.title}</h3>
              <p className="status">{project.status}</p>
              {project.description && <p className="description">{project.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="gallery-loading-scroll">
          <div className="loading-spinner"></div>
          <span>Loading WebGL Gallery...</span>
        </div>
      )}
    </div>
  )
}

export default ProjectGalleryScroll
