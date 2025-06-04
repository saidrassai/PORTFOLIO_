import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, Code, Briefcase, GraduationCap, Rocket, Leaf, Car, Atom } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface ChangelogEntry {
  id: string
  date: string
  version: string
  type: 'Skill' | 'Project' | 'Experience' | 'Education' | 'Milestone'
  title: string
  description: string
  tags: string[]
  location?: string
  icon: any
}

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  // Changelog entries data
  const changelogEntries: ChangelogEntry[] = [
    {
      id: '1',
      date: 'NOW',
      version: 'v3.2.0',
      type: 'Education',
      title: 'Fourth-year Software Engineering student',
      description: 'I am currently in my fourth year Engineering degree, majoring in Big Data and Artificial Intelligence. I am passionate about the evolution of AI and eager to apply my skills to practical and innovative projects.',
      tags: ['FullStack MERN / MEAN', 'AI/ML', 'Big Data', 'DevOps/MlOps'],
      location: 'Tangier',
      icon: Code
    },
    {
      id: '2',
      date: '2017-2020',
      version: 'v3.1.5',
      type: 'Education',
      title: "Bachelor's degree in Renewable Energy",
      description: 'Mastered React Three Fiber and Three.js for creating immersive web experiences. Implemented complex shaders and performance optimizations.',
      tags: ['Three.js', 'WebGL', 'Shaders', 'Performance'],
      location: 'Kenitra',
      icon: Leaf
    },
    {
      id: '3',
      date: '2024.08',
      version: 'v3.1.0',
      type: 'Project',
      title: 'Interactive Portfolio Platform',
      description: 'Built a modern portfolio platform with smooth animations, 3D graphics, and responsive design. Features include real-time animations and interactive elements.',
      tags: ['React', 'GSAP', 'Tailwind', 'Vite'],
      icon: Car
    },
    {
      id: '4',
      date: '2024.06',
      version: 'v3.0.8',
      type: 'Skill',
      title: 'Animation & Motion Design',
      description: 'Advanced proficiency in GSAP, Framer Motion, and CSS animations. Creating smooth, performant animations that enhance user experience.',
      tags: ['GSAP', 'Framer Motion', 'CSS', 'Performance'],
      icon: Atom
    },
    {
      id: '5',
      date: '2024.03',
      version: 'v3.0.0',
      type: 'Experience',
      title: 'Senior Frontend Developer',
      description: 'Led frontend development for multiple high-traffic applications. Implemented design systems and improved performance by 40%.',
      tags: ['Leadership', 'React', 'Performance', 'Architecture'],
      location: 'Tech Company',
      icon: Briefcase
    },
    {
      id: '6',
      date: '2023.11',
      version: 'v2.5.0',
      type: 'Skill',
      title: 'Modern TypeScript & React Patterns',
      description: 'Deep expertise in TypeScript, React hooks, and modern patterns. Focus on type safety, performance, and maintainable code architecture.',
      tags: ['TypeScript', 'React', 'Hooks', 'Architecture'],
      icon: Code
    },
    {
      id: '7',
      date: '2023.08',
      version: 'v2.3.0',
      type: 'Education',
      title: 'Advanced Web Development Certification',
      description: 'Completed comprehensive program covering modern web technologies, performance optimization, and best practices in software development.',
      tags: ['Certification', 'Web Development', 'Best Practices'],
      location: 'Online Academy',
      icon: GraduationCap
    }
  ]
  const toggleCardExpansion = (entryId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate timeline progress bar
      gsap.to('.timeline-progress', {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1
        }
      })

      // Animate timeline icons
      const timelineIcons = document.querySelectorAll('.timeline-icon')
      timelineIcons.forEach((icon) => {
        gsap.set(icon, { opacity: 0, scale: 0 })
        gsap.to(icon, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: icon,
            start: "top 120%",
            end: "bottom -20%",
            toggleActions: "play none none reverse"
          }
        })
      })

      // Animate connector lines
      const connectorLines = document.querySelectorAll('.timeline-connector')
      connectorLines.forEach((line) => {
        gsap.set(line, { opacity: 0, scaleX: 0 })
        gsap.to(line, {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse"
          }
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Milestone': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Skill': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Project': return 'bg-green-100 text-green-800 border-green-200'
      case 'Experience': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Education': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section ref={sectionRef} id="about" className="min-h-screen py-20 px-6 bg-white relative overflow-hidden" data-theme="light">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      
      <div className="max-w-6xl mx-auto relative z-10">        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-[7.5rem] md:text-[4.5rem] font-black uppercase tracking-[-0.02em] mb-8 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900">
            DEVELOPMENT{' '}
            <span className="bg-gradient-to-b from-[rgba(8,42,123,0.35)] to-[rgba(255,255,255,0)] bg-clip-text text-transparent">
              CHANGELOG
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A journey through skills, projects, and milestones that shaped my expertise in modern web development.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">          {/* Timeline background line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 timeline-line" 
            style={{ 
              height: `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 400 : 100}px` 
            }} 
          />
          {/* Timeline progress line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600 timeline-progress origin-top scale-y-0" 
            style={{ 
              height: `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 400 : 100}px` 
            }} 
          />

          {/* Changelog entries */}          <div 
            className="relative" 
            style={{ 
              height: `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 360 : 0}px` 
            }}
          >
            {changelogEntries.map((entry, index) => {
              const IconComponent = entry.icon;
              // Place odd id (1,3,5...) on left, even id (2,4,6...) on right
              const isLeft = parseInt(entry.id) % 2 === 1;              // Calculate staggered positioning - each card starts at more spacing to prevent overlap
              const cardHeight = 320; // Increased card height including spacing
              const staggerOffset = cardHeight * 0.7; // Increased spacing between cards
              const topPosition = index * staggerOffset;

              return (
                <div 
                  key={entry.id} 
                  className="absolute flex items-start w-full"
                  style={{ top: `${topPosition}px` }}
                >                  {/* Centered icon on timeline - animated when in view */}
                  <div className="timeline-icon absolute left-1/2 top-8 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-blue-200 flex items-center justify-center shadow-lg z-30 opacity-0 scale-0 transition-all duration-500">
                    <IconComponent size={20} className="text-blue-600" />
                  </div>
                    {/* Entry card, positioned left or right */}
                  <div className={`w-5/12 ${isLeft ? 'mr-auto pr-16 text-right' : 'ml-auto pl-16 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full relative z-10">
                      {/* Header */}
                      <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-center gap-2 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(entry.type)}`}>
                            {entry.type}
                          </span>
                          <span className="text-sm font-mono text-gray-500">{entry.version}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                      
                      {/* Description with see more functionality */}
                      <div className="text-gray-600 mb-4 leading-relaxed">
                        {expandedCards[entry.id] 
                          ? entry.description 
                          : entry.description.length > 120 
                            ? entry.description.substring(0, 120) + '...'
                            : entry.description
                        }                        {entry.description.length > 120 && (
                          <button
                            onClick={() => toggleCardExpansion(entry.id)}
                            className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-medium underline relative z-20 cursor-pointer transition-colors duration-200 hover:bg-blue-50 px-1 py-0.5 rounded"
                          >
                            {expandedCards[entry.id] ? 'Show less' : 'See more'}
                          </button>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className={`flex flex-wrap gap-2 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                        {entry.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Date and location */}
                      <div className={`flex items-center gap-4 text-sm text-gray-500 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{entry.date}</span>
                        </div>
                        {entry.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{entry.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                    
                  {/* Connector line - animated */}
                  <div className={`timeline-connector absolute top-8 w-12 h-0.5 bg-gray-200 opacity-0 ${isLeft ? 'right-1/2 mr-6' : 'left-1/2 ml-6'}`} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
            <Rocket size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Currently building the next version...</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
