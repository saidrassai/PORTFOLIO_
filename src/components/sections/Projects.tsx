import { useState, useEffect, memo } from 'react'
import { ExternalLink, Github, Code, Globe, Smartphone, Database, Palette, Activity, X } from '../../utils/icons'
import ParallaxBackground from '../ui/ParallaxBackground'
import ParallaxContent from '../ui/ParallaxContent'
import ParallaxFloatingElements from '../ui/ParallaxFloatingElements'
// Portfolio image will be referenced as /Project_Photos/portolio.png

interface Project {
  id: string
  title: string
  description: string
  github?: string
  visit?: string
  tech: string[]
  status: 'live' | 'development' | 'completed' | 'archived'
  version: string
  category: 'web' | 'mobile' | 'fullstack' | 'design' | 'ai'
  image: string
}

const Projects = memo(() => {
  const projects: Project[] = [
    {
      id: 'proj_001',
      title: 'Interactive 3D Portfolio',
      description: 'A modern portfolio featuring React Three Fiber, GSAP animations, and responsive design. Built with performance and accessibility in mind, showcasing cutting-edge web technologies.',
      github: 'https://github.com/saidrassai/portfolio',
      visit: 'https://rassaisaid.me',
      tech: ['React', 'Three.js', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      status: 'live',
      version: 'v3.2.0',
      category: 'web',
      image: '/Project_Photos/portolio.png'
    },
    {
      id: 'proj_002',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard. Scalable architecture with microservices and advanced analytics.',
      github: 'https://github.com/saidrassai/ecommerce',
      visit: 'https://ecommerce-demo.com',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
      status: 'completed',
      version: 'v2.1.5',
      category: 'fullstack',
      image: '/Project_Photos/portolio.png'
    },
    {
      id: 'proj_003',
      title: 'Mobile Task Manager',
      description: 'Cross-platform mobile app for task management with offline sync, push notifications, and collaborative features. Designed for productivity and team coordination.',
      github: 'https://github.com/saidrassai/taskmanager',
      visit: 'https://taskmanager-demo.com',
      tech: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
      status: 'development',
      version: 'v1.8.3',
      category: 'mobile',
      image: '/Project_Photos/portolio.png'
    },
    {
      id: 'proj_004',
      title: 'Design System & UI Kit',
      description: 'Comprehensive design system with reusable components, design tokens, and detailed documentation. Built for scalable applications and consistent user experiences.',
      github: 'https://github.com/saidrassai/designsystem',
      visit: 'https://designsystem-demo.com',
      tech: ['Figma', 'Storybook', 'React', 'Styled Components'],
      status: 'live',
      version: 'v4.0.1',
      category: 'design',
      image: '/Project_Photos/portolio.png'
    },
    {
      id: 'proj_005',
      title: 'AI Analytics Dashboard',
      description: 'Real-time analytics dashboard with machine learning insights, data visualization, and predictive modeling. Advanced AI-powered business intelligence platform.',
      github: 'https://github.com/saidrassai/analytics',
      visit: 'https://analytics-demo.com',
      tech: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI'],
      status: 'live',
      version: 'v3.5.2',
      category: 'ai',
      image: '/Project_Photos/portolio.png'
    },
    {
      id: 'proj_006',
      title: 'Blockchain DeFi Platform',
      description: 'Decentralized finance platform with smart contracts, yield farming, and DeFi protocols. Built on Ethereum with advanced security and scalability features.',
      github: 'https://github.com/saidrassai/defi',
      visit: 'https://defi-demo.com',
      tech: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
      status: 'development',
      version: 'v0.9.1',
      category: 'web',
      image: '/Project_Photos/portolio.png'
    }
  ]
    const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [projectInfo, setProjectInfo] = useState({ title: projects[0].title, id: projects[0].id })
  const [infoOpacity, setInfoOpacity] = useState(1)
  const [showDescription, setShowDescription] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    const validIndex = (newIndex + projects.length) % projects.length
    setCurrentIndex(validIndex)

    // Fade out project info
    setInfoOpacity(0)

    // Update project info after fade out
    setTimeout(() => {
      setProjectInfo({
        title: projects[validIndex].title,
        id: projects[validIndex].id
      })
      setInfoOpacity(1)
    }, 300)

    // Reset animation lock
    setTimeout(() => {
      setIsAnimating(false)    }, 800)
  }

  const handleImageClick = (project: Project, e: React.MouseEvent, position: string, index: number) => {
    e.stopPropagation()
    
    // Only show modal if card is in center position
    if (position === 'center') {
      setSelectedProject(project)
      setShowDescription(true)
      // Block page scroll when modal opens
      document.body.style.overflow = 'hidden'
    } else {
      // If not center, move card to center instead
      updateCarousel(index)
    }
  }
    const closeDescription = () => {
    setShowDescription(false)
    setSelectedProject(null)
    // Restore page scroll when modal closes
    document.body.style.overflow = 'unset'
  }
  
  const getCardPosition = (index: number): string => {
    const offset = (index - currentIndex + projects.length) % projects.length

    // Show only 5 cards in symmetric layout: center + 2 on each side
    switch (offset) {
      case 0: return 'center'          // Current card in center
      case 1: return 'right-1'         // First card to the right
      case 2: return 'right-2'         // Second card to the right  
      case 3: return 'hidden'          // Hidden behind center card
      case 4: return 'left-2'          // Second card to the left
      case 5: return 'left-1'          // First card to the left
      default: return 'center'
    }
  }
    const getCardStyles = (position: string): string => {
    const baseStyles = "absolute bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
      
    switch (position) {
      case 'center':
        return `${baseStyles} w-[250px] sm:w-[280px] md:w-[320px] h-[320px] sm:h-[370px] md:h-[420px] z-10 scale-110 left-1/2 -translate-x-1/2`
      
      // Right side cards (positive translations)
      case 'right-1':
        return `${baseStyles} w-[200px] sm:w-[230px] md:w-[280px] h-[270px] sm:h-[320px] md:h-[370px] z-[5] scale-95 opacity-90 left-1/2 -translate-x-1/2 translate-x-[30px] sm:translate-x-[170px] md:translate-x-[150px]`
      case 'right-2':
        return `${baseStyles} w-[160px] sm:w-[200px] md:w-[240px] h-[220px] sm:h-[270px] md:h-[320px] z-[3] scale-80 opacity-70 left-1/2 -translate-x-1/2 translate-x-[280px] sm:translate-x-[340px] md:translate-x-[300px]`
      
      // Left side cards (negative translations - perfect mirror)
      case 'left-1':
        return `${baseStyles} w-[200px] sm:w-[230px] md:w-[280px] h-[270px] sm:h-[320px] md:h-[370px] z-[5] scale-95 opacity-90 left-1/2 -translate-x-1/2 -translate-x-[140px] sm:-translate-x-[170px] md:-translate-x-[440px]`
      case 'left-2':
        return `${baseStyles} w-[160px] sm:w-[200px] md:w-[240px] h-[220px] sm:h-[270px] md:h-[320px] z-[3] scale-80 opacity-70 left-1/2 -translate-x-1/2 -translate-x-[280px] sm:-translate-x-[340px] md:-translate-x-[600px]`
      
      // Hidden card (behind center)
      case 'hidden':
        return `${baseStyles} w-[250px] sm:w-[280px] md:w-[320px] h-[320px] sm:h-[370px] md:h-[420px] z-0 scale-100 opacity-0 left-1/2 -translate-x-1/2 pointer-events-none`
      
      default:
        return `${baseStyles} w-[280px] h-[380px] left-1/2 -translate-x-1/2`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500/90 text-white border-green-400'
      case 'development': return 'bg-blue-500/90 text-white border-blue-400'
      case 'completed': return 'bg-purple-500/90 text-white border-purple-400'
      case 'archived': return 'bg-gray-500/90 text-white border-gray-400'
      default: return 'bg-gray-500/90 text-white border-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Globe
      case 'mobile': return Smartphone
      case 'fullstack': return Database
      case 'design': return Palette
      case 'ai': return Activity
      default: return Code
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web': return 'bg-blue-500/90 text-white'
      case 'mobile': return 'bg-green-500/90 text-white'
      case 'fullstack': return 'bg-purple-500/90 text-white'
      case 'design': return 'bg-pink-500/90 text-white'
      case 'ai': return 'bg-orange-500/90 text-white'
      default: return 'bg-gray-500/90 text-white'
    }
  }
  const getImageStyles = (position: string): string => {
    const baseStyles = "w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
    
    if (position === 'center') {
      return `${baseStyles} filter-none`
    }
    if (position === 'hidden') {
      return `${baseStyles} grayscale opacity-0`
    }
    return `${baseStyles} grayscale`
  }
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDescription) {
        if (e.key === 'Escape') {
          closeDescription()
        }
        return
      }
      
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, showDescription])

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1)
        } else {
          updateCarousel(currentIndex - 1)
        }      }
    }

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }  }, [currentIndex])

  // Cleanup scroll lock on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

    return (
    <div className="pt-12 pb-20 px-6 bg-white relative overflow-hidden">
      {/* Parallax Background Patterns */}
      <ParallaxBackground pattern="dots" speed={0.2} opacity={0.03} color="rgba(59,130,246,0.4)" />
      <ParallaxBackground pattern="lines" speed={-0.3} opacity={0.02} color="rgba(139,92,246,0.3)" />
      
      {/* Floating Elements */}
      <ParallaxFloatingElements />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-0">
        {/* Title */}        <ParallaxContent speed={0.8} scale={true}>
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[3.5rem] font-black uppercase tracking-[-0.02em] mb-6 sm:mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900">
            <span className="px-1 rounded" style={{ backgroundColor: '#FFEB3B', color: '#333446', paddingBottom: '1px' }}>PROJECTS</span>
          </h1>
        </ParallaxContent>        {/* Carousel Container */}
        <ParallaxContent speed={0.95} direction="up">
          <div className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[1200px] h-[350px] sm:h-[400px] md:h-[450px] relative mx-auto flex items-center justify-center overflow-visible">
            {/* Carousel Track */}
            <div 
              className="w-full h-full flex justify-center items-center relative"
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
          {/* Project Cards */}
          {projects.map((project, index) => {
            const position = getCardPosition(index)
            const isCenter = position === 'center'
            const CategoryIcon = getCategoryIcon(project.category)
            
            return (              <div
                key={project.id}
                className={getCardStyles(position)}
                onClick={() => updateCarousel(index)}
              >{/* Card Background Image */}                <div 
                  className="absolute inset-0 cursor-pointer" 
                  onClick={(e) => handleImageClick(project, e, position, index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleImageClick(project, e as any, position, index)
                    }
                  }}
                  aria-label={`View details for ${project.title}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className={getImageStyles(position)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-800/20 to-transparent" />
                  
                  {/* Click indicator for center card */}
                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <div className="bg-white/90 rounded-full p-3 backdrop-blur-sm border border-white/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                          <path d="M12 9v6m3-3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 ${getCategoryColor(project.category)}`}>
                  <CategoryIcon size={14} />
                  <span className="capitalize">{project.category}</span>
                </div>

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 ${getStatusColor(project.status)}`}>
                  <span className="capitalize">{project.status}</span>
                </div>

                {/* Version Badge */}
                <div className="absolute top-12 right-3 px-2 py-1 rounded text-xs font-medium bg-white/10 text-white backdrop-blur-sm border border-white/20">
                  {project.version}
                </div>

                {/* Project Links (visible on center card) */}
                {isCenter && (
                  <div className="absolute top-16 left-3 flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.visit && (
                      <a
                        href={project.visit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                )}

                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Project ID */}
                  <div className="text-xs font-mono text-white/60 mb-1">
                    {project.id}
                  </div>
                  
                  {/* Project Title */}
                  <h3 className="text-lg font-bold mb-2 leading-tight">
                    {project.title}
                  </h3>                  {/* Tech Stack */}
                  <p className="text-sm text-white/80 mb-3 leading-relaxed">
                    {project.tech.slice(0, 3).join(' • ')}
                    {project.tech.length > 3 && ' • ...'}
                  </p>
                </div>
              </div>
            )
          })}            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/90 text-gray-800 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none hover:bg-white hover:scale-110 backdrop-blur-sm shadow-lg border border-gray-200/50"
              onClick={() => updateCarousel(currentIndex - 1)}
              aria-label="Previous project"
            >
              ‹
            </button>
            <button
              className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/90 text-gray-800 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none hover:bg-white hover:scale-110 backdrop-blur-sm shadow-lg border border-gray-200/50"
              onClick={() => updateCarousel(currentIndex + 1)}
              aria-label="Next project"
            >
              ›
            </button>
          </div>      {/* Project Info Display */}
      <div 
        className="text-center mt-6 transition-all duration-500 ease-out"
        style={{ opacity: infoOpacity }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-[rgb(8,42,123)] text-sm font-mono bg-blue-50 px-3 py-1 rounded-full">
            {projectInfo.id}
          </span>
        </div>
        <h2 className="text-[rgb(8,42,123)] text-4xl font-bold mb-4 relative inline-block before:content-[''] before:absolute before:top-full before:left-[-120px] before:w-[100px] before:h-0.5 before:bg-[rgb(8,42,123)] after:content-[''] after:absolute after:top-full after:right-[-120px] after:w-[100px] after:h-0.5 after:bg-[rgb(8,42,123)] md:text-[2rem] md:before:w-[50px] md:before:left-[-70px] md:after:w-[50px] md:after:right-[-70px]">
          {projectInfo.title}
        </h2>        <p className="text-[#848696] text-lg font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
          Click on the center card to see detailed project information, or click other cards to bring them to center
        </p>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2.5 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 border-none outline-none ${
              index === currentIndex 
                ? 'bg-[rgb(8,42,123)] scale-120' 
                : 'bg-[rgba(8,42,123,0.2)] hover:bg-[rgba(8,42,123,0.4)]'
            }`}
            onClick={() => updateCarousel(index)}
            aria-label={`Go to project ${index + 1}`}        
             />        ))}      </div>        </ParallaxContent>
        </div>
      </div>

      {/* Description Modal */}
      {showDescription && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDescription}>
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 pr-4">{selectedProject.title}</h3>              <button
                onClick={closeDescription}
                className="p-2 hover:bg-yellow-100 rounded-full transition-colors duration-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} className="text-yellow-600 hover:text-yellow-700" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-48 sm:h-56 object-cover rounded-xl mb-6 shadow-lg"
              />
              
              {/* Status and Category Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(selectedProject.category)}`}>
                  {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {selectedProject.version}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                {selectedProject.description}
              </p>
              
              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, index) => (
                    <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Project Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Github size={16} />
                    View Code
                  </a>
                )}
                {selectedProject.visit && (
                  <a
                    href={selectedProject.visit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>  )
})

Projects.displayName = 'Projects'

export default Projects
