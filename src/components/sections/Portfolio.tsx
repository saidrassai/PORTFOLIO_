import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github, Code, Globe, Smartphone, Database, Palette, Star, ChevronLeft, ChevronRight, Play, Pause, Zap, Activity } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface ProjectEntry {
  id: string
  date: string
  version: string
  title: string
  description: string
  tech: string[]
  category: 'web' | 'mobile' | 'fullstack' | 'design'
  status: 'live' | 'development' | 'completed'
  demo?: string
  github?: string
  icon: any
  features: string[]
  gradient: string
  accentColor: string
}

const Portfolio = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const carouselTrackRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const autoPlayRef = useRef<number | null>(null)

  const projects: ProjectEntry[] = [
    {
      id: '1',
      date: '2024.12',
      version: 'v3.2.0',
      title: 'Interactive 3D Portfolio',
      description: 'A modern portfolio featuring React Three Fiber, GSAP animations, and responsive design. Built with performance and accessibility in mind.',
      tech: ['React', 'Three.js', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      category: 'web',
      status: 'live',
      demo: 'https://portfolio-demo.com',
      github: 'https://github.com/username/portfolio',
      icon: Globe,
      features: ['3D Graphics', 'Smooth Animations', 'Mobile Responsive', 'Performance Optimized'],
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      accentColor: '#3B82F6'
    },
    {
      id: '2',
      date: '2024.10',
      version: 'v3.1.0',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard. Scalable architecture with microservices.',
      tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
      category: 'fullstack',
      status: 'completed',
      demo: 'https://ecommerce-demo.com',
      github: 'https://github.com/username/ecommerce',
      icon: Database,
      features: ['Payment Integration', 'Real-time Inventory', 'Admin Dashboard', 'Microservices'],
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      accentColor: '#10B981'
    },
    {
      id: '3',
      date: '2024.08',
      version: 'v3.0.5',
      title: 'Mobile Task Manager',
      description: 'Cross-platform mobile app for task management with offline sync, push notifications, and collaborative features.',
      tech: ['React Native', 'Expo', 'Firebase', 'TypeScript'],
      category: 'mobile',
      status: 'development',
      demo: 'https://taskmanager-demo.com',
      github: 'https://github.com/username/taskmanager',
      icon: Smartphone,
      features: ['Offline Sync', 'Push Notifications', 'Team Collaboration', 'Cross-platform'],
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      accentColor: '#F97316'
    },
    {
      id: '4',
      date: '2024.06',
      version: 'v2.8.0',
      title: 'Design System & UI Kit',
      description: 'Comprehensive design system with reusable components, design tokens, and detailed documentation for scalable applications.',
      tech: ['Figma', 'Storybook', 'React', 'Styled Components'],
      category: 'design',
      status: 'live',
      demo: 'https://designsystem-demo.com',
      github: 'https://github.com/username/designsystem',
      icon: Palette,
      features: ['Design Tokens', 'Component Library', 'Documentation', 'Accessibility'],
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      accentColor: '#8B5CF6'
    },
    {
      id: '5',
      date: '2024.04',
      version: 'v2.5.0',
      title: 'AI Analytics Dashboard',
      description: 'Real-time analytics dashboard with machine learning insights, data visualization, and predictive modeling capabilities.',
      tech: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI'],
      category: 'fullstack',
      status: 'live',
      demo: 'https://analytics-demo.com',
      github: 'https://github.com/username/analytics',
      icon: Activity,
      features: ['Machine Learning', 'Real-time Data', 'Predictive Analytics', 'Data Visualization'],
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      accentColor: '#059669'
    }
  ]
  // Auto-play functionality with 6-second intervals
  useEffect(() => {
    if (isAutoPlay && !isDragging) {
      autoPlayRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projects.length)
      }, 6000) // 6 seconds for better viewing experience
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlay, isDragging, projects.length])

  // Carousel animation
  useEffect(() => {
    if (carouselTrackRef.current) {
      gsap.to(carouselTrackRef.current, {
        x: -currentSlide * 100 + '%',
        duration: 0.8,
        ease: 'power2.inOut'
      })
    }
  }, [currentSlide])

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title with futuristic effect
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animate carousel container
      gsap.fromTo(carouselRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }, [projects.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }, [projects.length])
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const toggleCardExpansion = useCallback((projectId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }, [])
  // Enhanced touch/drag handlers with improved sensitivity
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStart(clientX)
    setDragOffset(0)
    // Pause auto-play during interaction
    setIsAutoPlay(false)
  }, [])

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault() // Prevent scrolling on touch devices
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offset = clientX - dragStart
    setDragOffset(offset)
  }, [isDragging, dragStart])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Improved sensitivity - 80px threshold for better UX
    if (Math.abs(dragOffset) > 80) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    setDragOffset(0)
    // Resume auto-play after a delay
    setTimeout(() => setIsAutoPlay(true), 3000)
  }, [isDragging, dragOffset, nextSlide, prevSlide])

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlay(!isAutoPlay)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, isAutoPlay])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-400/20 text-green-400 border-green-400/30'
      case 'development': return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
      case 'completed': return 'bg-purple-400/20 text-purple-400 border-purple-400/30'
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Globe
      case 'mobile': return Smartphone
      case 'fullstack': return Database
      case 'design': return Palette
      default: return Code
    }
  }
  return (    <section ref={sectionRef} id="portfolio" className="min-h-screen py-20 px-6 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden" data-theme="dark">
      {/* Simplified background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold text-white mb-6">
            Project
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"> Releases</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore my latest projects in an immersive carousel experience. Each release represents innovation, 
            craftsmanship, and cutting-edge technology.
          </p>
        </div>

        {/* Futuristic Carousel */}
        <div ref={carouselRef} className="relative">          {/* Simplified Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/50 transition-all duration-500">
            {/* Carousel Track with proper slide layout */}
            <div 
              ref={carouselTrackRef}
              className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%) translateX(${isDragging ? dragOffset : 0}px)`
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {projects.map((project) => {
                const IconComponent = project.icon
                const CategoryIcon = getCategoryIcon(project.category)
                
                return (
                  <div 
                    key={project.id} 
                    className="w-full flex-shrink-0 px-4 min-h-[600px]"
                  >
                    <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                      {/* Project Visual */}
                      <div className="relative group">
                        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient} p-1`}>
                          <div className="bg-gray-900 rounded-xl p-8 h-96 flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10" />
                            <div className="relative z-10 text-center">
                              <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <IconComponent size={40} className="text-white" />
                              </div>
                              <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
                              <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="text-sm font-mono text-gray-300">{project.version}</span>
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                <span className="text-sm text-gray-300">{project.date}</span>
                              </div>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(project.status)}`}>
                                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                                <span className="capitalize">{project.status}</span>
                              </div>
                            </div>                            
                            {/* Simplified particles effect */}
                            <div className="absolute inset-0 opacity-30">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                  style={{
                                    left: `${30 + i * 20}%`,
                                    top: `${40 + (i % 2) * 20}%`,
                                    animationDelay: `${i * 0.8}s`,
                                    animationDuration: '2s'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                            <CategoryIcon size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-white">{project.title}</h4>
                            <p className="text-gray-400 capitalize">{project.category} Development</p>
                          </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed">
                          {expandedCards[project.id] 
                            ? project.description 
                            : project.description.length > 120 
                              ? project.description.substring(0, 120) + '...'
                              : project.description
                          }
                          {project.description.length > 120 && (
                            <button
                              onClick={() => toggleCardExpansion(project.id)}
                              className="ml-2 text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                            >
                              {expandedCards[project.id] ? 'Show less' : 'See more'}
                            </button>
                          )}
                        </p>

                        {/* Features */}
                        <div className="space-y-3">
                          <h5 className="text-white font-semibold flex items-center gap-2">
                            <Star size={16} className="text-yellow-400" />
                            Key Features
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            {project.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-300">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-3">
                          <h5 className="text-white font-semibold flex items-center gap-2">
                            <Zap size={16} className="text-blue-400" />
                            Tech Stack
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700 hover:border-gray-600 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          {project.demo && (
                            <a
                              href={project.demo}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg shadow-blue-500/25"
                            >
                              <ExternalLink size={16} />
                              <span>Live Demo</span>
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 font-medium"
                            >
                              <Github size={16} />
                              <span>Source Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Navigation Arrows */}
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Enhanced Slide Indicators with numbers */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-mono">
                {String(currentSlide + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 ${
                      currentSlide === index 
                        ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full scale-125' 
                        : 'w-3 h-3 bg-gray-600 hover:bg-gray-500 rounded-full'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${
                isAutoPlay 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                  : 'bg-gray-800/80 border-gray-600 text-gray-400 hover:text-white'
              }`}
            >
              {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentSlide + 1) / projects.length) * 100}%` }}
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <Code size={20} className="text-cyan-400" />
            <span className="text-gray-300 font-medium">More innovative projects in development...</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
