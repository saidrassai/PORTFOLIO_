import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OptimizedImage from '../ui/OptimizedImage'
import ParallaxBackground from '../ui/ParallaxBackground'
import ParallaxContent from '../ui/ParallaxContent'

gsap.registerPlugin(ScrollTrigger)

interface Technology {
  name: string
  iconUrl: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'tools'
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const topRowAnimation = useRef<gsap.core.Tween | null>(null)
  const bottomRowAnimation = useRef<gsap.core.Tween | null>(null)

  const technologies: Technology[] = [
    // Frontend & Languages
    { name: 'React', iconUrl: '/tech-icons/react.svg', category: 'frontend' },
    { name: 'TypeScript', iconUrl: '/tech-icons/typescript-icon.svg', category: 'frontend' },
    { name: 'JavaScript', iconUrl: '/tech-icons/javascript.svg', category: 'frontend' },
    { name: 'Next.js', iconUrl: '/tech-icons/nextjs-icon.svg', category: 'frontend' },
    { name: 'Angular', iconUrl: '/tech-icons/angular-icon.svg', category: 'frontend' },
    
    // Backend & Frameworks
    { name: 'Node.js', iconUrl: '/tech-icons/nodejs.svg', category: 'backend' },
    { name: 'Python', iconUrl: '/tech-icons/python.svg', category: 'backend' },
    { name: 'C#', iconUrl: '/tech-icons/c-sharp.svg', category: 'backend' },
    { name: '.NET', iconUrl: '/tech-icons/dotnet.svg', category: 'backend' },
    { name: 'FastAPI', iconUrl: '/tech-icons/fastapi-icon.svg', category: 'backend' },
    { name: 'Flask', iconUrl: '/tech-icons/flask.svg', category: 'backend' },
    { name: 'LangChain', iconUrl: '/tech-icons/langchain.svg', category: 'backend' },
    
    // Databases
    { name: 'MongoDB', iconUrl: '/tech-icons/mongodb-icon.svg', category: 'database' },
    { name: 'PostgreSQL', iconUrl: '/tech-icons/postgresql.svg', category: 'database' },
    { name: 'MySQL', iconUrl: '/tech-icons/mysql.svg', category: 'database' },
    { name: 'Oracle', iconUrl: '/tech-icons/oracle.svg', category: 'database' },
    
    // Cloud & DevOps
    { name: 'AWS', iconUrl: '/tech-icons/aws.svg', category: 'cloud' },
    { name: 'Microsoft Azure', iconUrl: '/tech-icons/microsoft-azure.svg', category: 'cloud' },
    { name: 'Google Cloud', iconUrl: '/tech-icons/google-cloud.svg', category: 'cloud' },
    { name: 'Docker', iconUrl: '/tech-icons/docker-icon.svg', category: 'cloud' },
    { name: 'Kubernetes', iconUrl: '/tech-icons/kubernetes.svg', category: 'cloud' },
    { name: 'Heroku', iconUrl: '/tech-icons/heroku-icon.svg', category: 'cloud' },
    
    // AI & Data Science
    { name: 'TensorFlow', iconUrl: '/tech-icons/tensorflow.svg', category: 'ai' },
    { name: 'PyTorch', iconUrl: '/tech-icons/pytorch-icon.svg', category: 'ai' },
    { name: 'Scikit-learn', iconUrl: '/tech-icons/scikit-learn.svg', category: 'ai' },
    { name: 'Matplotlib', iconUrl: '/tech-icons/matplotlib-icon.svg', category: 'ai' },
    { name: 'Seaborn', iconUrl: '/tech-icons/seaborn-icon.svg', category: 'ai' },
    { name: 'Jupyter', iconUrl: '/tech-icons/jupyter.svg', category: 'ai' },
    { name: 'Hadoop', iconUrl: '/tech-icons/hadoop.svg', category: 'ai' },
    
    // Tools & Others
    { name: 'GraphQL', iconUrl: '/tech-icons/graphql.svg', category: 'tools' },
    { name: 'Kafka', iconUrl: '/tech-icons/kafka-icon.svg', category: 'tools' },
    { name: 'Jira', iconUrl: '/tech-icons/jira.svg', category: 'tools' },
    { name: 'WordPress', iconUrl: '/tech-icons/wordpress-icon.svg', category: 'tools' }
  ]

  // Split technologies into two rows for better visual balance
  const topRowTechs = technologies.slice(0, Math.ceil(technologies.length / 2))
  const bottomRowTechs = technologies.slice(Math.ceil(technologies.length / 2))

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
        <OptimizedImage 
          src={tech.iconUrl} 
          alt={tech.name} 
          className="w-full h-full object-contain" 
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
}

export default TechStack
