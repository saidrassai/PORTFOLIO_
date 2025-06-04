import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OptimizedImage from '../ui/OptimizedImage'

gsap.registerPlugin(ScrollTrigger)

interface Technology {
  name: string
  iconUrl: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'tools'
}

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

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
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Top row carousel animation (left to right)
      if (topRowRef.current) {
        const topRowWidth = topRowRef.current.scrollWidth
        gsap.to(topRowRef.current, {
          x: -(topRowWidth / 2),
          duration: 40,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (topRowWidth / 2))
          }
        })
      }

      // Bottom row carousel animation (right to left)
      if (bottomRowRef.current) {
        const bottomRowWidth = bottomRowRef.current.scrollWidth
        gsap.set(bottomRowRef.current, { x: -(bottomRowWidth / 2) })
        gsap.to(bottomRowRef.current, {
          x: 0,
          duration: 35,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (bottomRowWidth / 2))
          }
        })
      }

      // Individual tech icons stagger animation on scroll
      gsap.fromTo(".tech-icon",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const renderTechIcon = (tech: Technology, index: number) => (
    <div
      key={`${tech.name}-${index}`}
      className="tech-icon flex-shrink-0 mx-4 group cursor-pointer"
      title={tech.name}
    >
      <div className="relative w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:bg-white group-hover:border-blue-200">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <OptimizedImage 
          src={tech.iconUrl} 
          alt={tech.name} 
          className="w-full h-full object-contain relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:drop-shadow-md" 
        />
        
        {/* Tech name tooltip */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap font-medium">
            {tech.name}
            <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section 
      ref={sectionRef} 
      id="techstack" 
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden" 
      data-theme="light"
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-[7.5rem] md:text-[4.5rem] font-black uppercase tracking-[-0.02em] mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900"
          >
            TECH{' '}
            <span className="bg-gradient-to-b from-[rgba(8,42,123,0.35)] to-[rgba(255,255,255,0)] bg-clip-text text-transparent">
              STACK
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Top Row - Moving Left to Right */}
          <div className="mb-8 overflow-hidden">
            <div 
              ref={topRowRef}
              className="flex items-center will-change-transform"
              style={{ width: 'fit-content' }}
            >
              {/* Duplicate the array for seamless loop */}
              {[...topRowTechs, ...topRowTechs].map((tech, index) => 
                renderTechIcon(tech, index)
              )}
            </div>
          </div>

          {/* Bottom Row - Moving Right to Left */}
          <div className="overflow-hidden">
            <div 
              ref={bottomRowRef}
              className="flex items-center will-change-transform"
              style={{ width: 'fit-content' }}
            >
              {/* Duplicate the array for seamless loop */}
              {[...bottomRowTechs, ...bottomRowTechs].map((tech, index) => 
                renderTechIcon(tech, index)
              )}
            </div>
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-2xl md:text-3xl font-light text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {technologies.length}+
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
    </section>
  )
}

export default TechStack
