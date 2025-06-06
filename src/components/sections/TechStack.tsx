import { useEffect, useRef, useState, memo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OptimizedTechIcon from '../ui/OptimizedTechIcon'
import ParallaxBackground from '../ui/ParallaxBackground'
import ParallaxContent from '../ui/ParallaxContent'

gsap.registerPlugin(ScrollTrigger)

interface Technology {
  name: string
  iconName: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'tools'
}

const TechStack = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const topRowAnimation = useRef<gsap.core.Tween | null>(null)
  const bottomRowAnimation = useRef<gsap.core.Tween | null>(null)
  
  // Progressive loading state
  const [visibleIcons, setVisibleIcons] = useState(12) // Start with 12 icons
  const [allIconsLoaded, setAllIconsLoaded] = useState(false)

  const technologies: Technology[] = [
    // Frontend & Languages
    { name: 'React', iconName: 'react', category: 'frontend' },
    { name: 'TypeScript', iconName: 'typescript-icon', category: 'frontend' },
    { name: 'JavaScript', iconName: 'javascript', category: 'frontend' },
    { name: 'Next.js', iconName: 'nextjs-icon', category: 'frontend' },
    { name: 'Angular', iconName: 'angular-icon', category: 'frontend' },
    
    // Backend & Frameworks
    { name: 'Node.js', iconName: 'nodejs', category: 'backend' },
    { name: 'Python', iconName: 'python', category: 'backend' },
    { name: 'C#', iconName: 'c-sharp', category: 'backend' },
    { name: '.NET', iconName: 'dotnet', category: 'backend' },
    { name: 'FastAPI', iconName: 'fastapi-icon', category: 'backend' },
    { name: 'Flask', iconName: 'flask', category: 'backend' },
    { name: 'LangChain', iconName: 'langchain', category: 'backend' },
    
    // Databases
    { name: 'MongoDB', iconName: 'mongodb-icon', category: 'database' },
    { name: 'PostgreSQL', iconName: 'postgresql', category: 'database' },
    { name: 'MySQL', iconName: 'mysql', category: 'database' },
    { name: 'Oracle', iconName: 'oracle', category: 'database' },
    
    // Cloud & DevOps
    { name: 'AWS', iconName: 'aws', category: 'cloud' },
    { name: 'Microsoft Azure', iconName: 'microsoft-azure', category: 'cloud' },
    { name: 'Google Cloud', iconName: 'google-cloud', category: 'cloud' },
    { name: 'Docker', iconName: 'docker-icon', category: 'cloud' },
    { name: 'Kubernetes', iconName: 'kubernetes', category: 'cloud' },
    { name: 'Heroku', iconName: 'heroku-icon', category: 'cloud' },
    
    // AI & Data Science
    { name: 'TensorFlow', iconName: 'tensorflow', category: 'ai' },
    { name: 'PyTorch', iconName: 'pytorch-icon', category: 'ai' },
    { name: 'Scikit-learn', iconName: 'scikit-learn', category: 'ai' },
    { name: 'Matplotlib', iconName: 'matplotlib-icon', category: 'ai' },
    { name: 'Seaborn', iconName: 'seaborn-icon', category: 'ai' },
    { name: 'Jupyter', iconName: 'jupyter', category: 'ai' },
    { name: 'Hadoop', iconName: 'hadoop', category: 'ai' },
    
    // Tools & Others
    { name: 'GraphQL', iconName: 'graphql', category: 'tools' },
    { name: 'Kafka', iconName: 'kafka-icon', category: 'tools' },
    { name: 'Jira', iconName: 'jira', category: 'tools' },
    { name: 'WordPress', iconName: 'wordpress-icon', category: 'tools' }
  ]

  // Progressive loading: filter technologies based on visible count
  const displayedTechnologies = allIconsLoaded ? technologies : technologies.slice(0, visibleIcons)
  
  // Split technologies into two rows for better visual balance
  const topRowTechs = displayedTechnologies.slice(0, Math.ceil(displayedTechnologies.length / 2))
  const bottomRowTechs = displayedTechnologies.slice(Math.ceil(displayedTechnologies.length / 2))

  // Load more icons when section comes into view
  useEffect(() => {
    if (visibleIcons < technologies.length) {
      const timer = setTimeout(() => {
        setVisibleIcons(prev => Math.min(prev + 6, technologies.length))
        if (visibleIcons + 6 >= technologies.length) {
          setAllIconsLoaded(true)
        }
      }, 500) // Delay between loading batches
      
      return () => clearTimeout(timer)
    }
  }, [visibleIcons, technologies.length])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Simple continuous scrolling - Top row (left to right)
      if (topRowRef.current) {
        const iconWidth = 112
        const totalWidth = topRowTechs.length * iconWidth
        
        gsap.set(topRowRef.current, { x: 0 })
        topRowAnimation.current = gsap.to(topRowRef.current, {
          x: -totalWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        })
      }

      // Simple continuous scrolling - Bottom row (right to left)
      if (bottomRowRef.current) {
        const iconWidth = 112
        const totalWidth = bottomRowTechs.length * iconWidth
        
        gsap.set(bottomRowRef.current, { x: -totalWidth })
        bottomRowAnimation.current = gsap.to(bottomRowRef.current, {
          x: 0,
          duration: 20,
          ease: "none",
          repeat: -1,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleIconHover = (isHovering: boolean) => {
    if (isHovering) {
      topRowAnimation.current?.pause()
      bottomRowAnimation.current?.pause()
    } else {
      topRowAnimation.current?.resume()
      bottomRowAnimation.current?.resume()
    }
  }

  const renderTechIcon = (tech: Technology, index: number) => (
    <div
      key={`${tech.name}-${index}`}
      className="flex-shrink-0 mx-3 sm:mx-4 md:mx-6"
      title={tech.name}
      onMouseEnter={() => handleIconHover(true)}
      onMouseLeave={() => handleIconHover(false)}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 flex items-center justify-center p-2 sm:p-3">
        <OptimizedTechIcon 
          name={tech.iconName}
          alt={tech.name}
          size="medium"
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  )

  return (
    <div 
      ref={sectionRef} 
      className="pt-12 pb-20 overflow-hidden relative bg-white" 
      data-theme="light"
    >
      {/* Parallax Background Patterns */}
      <ParallaxBackground pattern="circles" speed={0.2} opacity={0.04} color="rgba(99,102,241,0.5)" />
      <ParallaxBackground pattern="dots" speed={-0.4} opacity={0.03} color="rgba(139,92,246,0.4)" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <ParallaxContent speed={0.8} scale={true}>
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              ref={titleRef}
              className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[3.5rem] font-black uppercase tracking-[-0.02em] mb-6 sm:mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900"
            >
              TECH{' '}
              <span className="px-1 rounded" style={{ backgroundColor: '#FFEB3B', color: '#333446', paddingTop: '1px', paddingBottom: '1px' }}>
                STACK
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Technologies and tools I work with to bring ideas to life
            </p>
          </div>
        </ParallaxContent>

        {/* Carousel Container */}
        <ParallaxContent speed={0.95} direction="left">
          <div className="relative max-w-none mx-auto overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 py-6 sm:py-8">
            {/* Top Row - Simple infinite scroll (left to right) */}
            <div className="mb-6 sm:mb-8 relative overflow-hidden">
              <div className="flex items-center">
                <div 
                  ref={topRowRef}
                  className="flex items-center"
                  style={{ width: 'fit-content' }}
                >
                  {/* Duplicate arrays for seamless loop */}
                  {[...topRowTechs, ...topRowTechs].map((tech, index) => 
                    renderTechIcon(tech, index)
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row - Simple infinite scroll (right to left) */}
            <div className="relative overflow-hidden">
              <div className="flex items-center">
                <div 
                  ref={bottomRowRef}
                  className="flex items-center"
                  style={{ width: 'fit-content' }}
                >
                  {/* Duplicate arrays for seamless loop */}
                  {[...bottomRowTechs, ...bottomRowTechs].map((tech, index) => 
                    renderTechIcon(tech, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </ParallaxContent>

        {/* Stats Section */}
        <ParallaxContent speed={1.1} direction="up">
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">By The Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="group">
                <div className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  25+
                </div>
                <div className="text-gray-600 text-sm font-medium">Technologies</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  6
                </div>
                <div className="text-gray-600 text-sm font-medium">Categories</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  50+
                </div>
                <div className="text-gray-600 text-sm font-medium">Projects</div>
              </div>
              <div className="group">
                <div className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  4+
                </div>
                <div className="text-gray-600 text-sm font-medium">Years</div>
              </div>
            </div>
          </div>
        </ParallaxContent>
      </div>
    </div>
  )
})

TechStack.displayName = 'TechStack'

export default TechStack
