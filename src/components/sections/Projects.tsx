import { useState, useEffect } from 'react'
import { ExternalLink, Github, Code, Globe, Smartphone, Database, Palette, Activity } from 'lucide-react'

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

const Projects = () => {
  const projects: Project[] = [
    {
      id: 'proj_001',
      title: 'Interactive 3D Portfolio',
      description: 'A modern portfolio featuring React Three Fiber, GSAP animations, and responsive design. Built with performance and accessibility in mind, showcasing cutting-edge web technologies.',
      github: 'https://github.com/username/portfolio',
      visit: 'https://portfolio-demo.com',
      tech: ['React', 'Three.js', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      status: 'live',
      version: 'v3.2.0',
      category: 'web',
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 'proj_002',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard. Scalable architecture with microservices and advanced analytics.',
      github: 'https://github.com/username/ecommerce',
      visit: 'https://ecommerce-demo.com',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
      status: 'completed',
      version: 'v2.1.5',
      category: 'fullstack',
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 'proj_003',
      title: 'Mobile Task Manager',
      description: 'Cross-platform mobile app for task management with offline sync, push notifications, and collaborative features. Designed for productivity and team coordination.',
      github: 'https://github.com/username/taskmanager',
      visit: 'https://taskmanager-demo.com',
      tech: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
      status: 'development',
      version: 'v1.8.3',
      category: 'mobile',
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww"
    },
    {
      id: 'proj_004',
      title: 'Design System & UI Kit',
      description: 'Comprehensive design system with reusable components, design tokens, and detailed documentation. Built for scalable applications and consistent user experiences.',
      github: 'https://github.com/username/designsystem',
      visit: 'https://designsystem-demo.com',
      tech: ['Figma', 'Storybook', 'React', 'Styled Components'],
      status: 'live',
      version: 'v4.0.1',
      category: 'design',
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww"
    },
    {
      id: 'proj_005',
      title: 'AI Analytics Dashboard',
      description: 'Real-time analytics dashboard with machine learning insights, data visualization, and predictive modeling. Advanced AI-powered business intelligence platform.',
      github: 'https://github.com/username/analytics',
      visit: 'https://analytics-demo.com',
      tech: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI'],
      status: 'live',
      version: 'v3.5.2',
      category: 'ai',
      image: "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2Zlc3Npb25hbCUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 'proj_006',
      title: 'Blockchain DeFi Platform',
      description: 'Decentralized finance platform with smart contracts, yield farming, and DeFi protocols. Built on Ethereum with advanced security and scalability features.',
      github: 'https://github.com/username/defi',
      visit: 'https://defi-demo.com',
      tech: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
      status: 'development',
      version: 'v0.9.1',
      category: 'web',
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [projectInfo, setProjectInfo] = useState({ title: projects[0].title, id: projects[0].id })
  const [infoOpacity, setInfoOpacity] = useState(1)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
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
      setIsAnimating(false)
    }, 800)
  }

  const getCardPosition = (index: number): string => {
    const offset = (index - currentIndex + projects.length) % projects.length

    if (offset === 0) return 'center'
    if (offset === 1) return 'right-1'
    if (offset === 2) return 'right-2'
    if (offset === projects.length - 1) return 'left-1'
    if (offset === projects.length - 2) return 'left-2'
    return 'hidden'
  }
  
  const getCardStyles = (position: string): string => {
    const baseStyles = "absolute bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
      switch (position) {
      case 'center':
        return `${baseStyles} w-[320px] h-[420px] z-10 scale-110 translate-z-0`
      case 'left-1':
        return `${baseStyles} w-[288px] h-[378px] z-[5] -translate-x-[200px] scale-100 translate-z-[-100px] opacity-90`
      case 'left-2':
        return `${baseStyles} w-[256px] h-[336px] z-[1] -translate-x-[400px] scale-80 translate-z-[-300px] opacity-70`
      case 'right-1':
        return `${baseStyles} w-[288px] h-[378px] z-[5] translate-x-[200px] scale-100 translate-z-[-100px] opacity-90`
      case 'right-2':
        return `${baseStyles} w-[256px] h-[336px] z-[1] translate-x-[400px] scale-80 translate-z-[-300px] opacity-70`
      case 'hidden':
        return `${baseStyles} w-[280px] h-[380px] opacity-0 pointer-events-none`
      default:
        return `${baseStyles} w-[280px] h-[380px]`
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
    return `${baseStyles} grayscale`
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

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
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentIndex])
  return (
    <section id="projects" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden py-20">
      {/* Title */}
      <h1 className="text-[7.5rem] font-black uppercase tracking-[-0.02em] mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] bg-gradient-to-b from-[rgba(8,42,123,0.35)] to-[rgba(255,255,255,0)] bg-clip-text text-transparent md:text-[4.5rem]">
        PROJECTS
      </h1>

      {/* Carousel Container */}
      <div className="w-full max-w-[1200px] h-[450px] relative perspective-[1000px]">
        {/* Carousel Track */}
        <div 
          className="w-full h-full flex justify-center items-center relative preserve-3d transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Project Cards */}
          {projects.map((project, index) => {
            const position = getCardPosition(index)
            const isCenter = position === 'center'
            const CategoryIcon = getCategoryIcon(project.category)
            
            return (
              <div
                key={project.id}
                className={getCardStyles(position)}
                onClick={() => updateCarousel(index)}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={getImageStyles(position)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
                  </h3>

                  {/* Tech Stack */}
                  <p className="text-sm text-white/80 mb-3 leading-relaxed">
                    {project.tech.slice(0, 3).join(' • ')}
                    {project.tech.length > 3 && ' • ...'}
                  </p>

                  {/* Description (on hover for center card) */}
                  {isCenter && hoveredCard === project.id && (
                    <div className="absolute inset-x-4 bottom-4 p-3 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2">
                      <p className="text-sm text-white/90 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none hover:bg-[rgba(0,0,0,0.8)] hover:scale-110 backdrop-blur-sm"
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous project"
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none hover:bg-[rgba(0,0,0,0.8)] hover:scale-110 backdrop-blur-sm"
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next project"
        >
          ›
        </button>
      </div>

      {/* Project Info Display */}
      <div 
        className="text-center mt-12 transition-all duration-500 ease-out"
        style={{ opacity: infoOpacity }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-[rgb(8,42,123)] text-sm font-mono bg-blue-50 px-3 py-1 rounded-full">
            {projectInfo.id}
          </span>
        </div>
        <h2 className="text-[rgb(8,42,123)] text-4xl font-bold mb-4 relative inline-block before:content-[''] before:absolute before:top-full before:left-[-120px] before:w-[100px] before:h-0.5 before:bg-[rgb(8,42,123)] after:content-[''] after:absolute after:top-full after:right-[-120px] after:w-[100px] after:h-0.5 after:bg-[rgb(8,42,123)] md:text-[2rem] md:before:w-[50px] md:before:left-[-70px] md:after:w-[50px] md:after:right-[-70px]">
          {projectInfo.title}
        </h2>
        <p className="text-[#848696] text-lg font-medium opacity-80 max-w-2xl mx-auto leading-relaxed">
          Hover over the center card to see project details and access links
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
          />
        ))}
      </div>
    </section>
  )
}

export default Projects
