import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, Code, GraduationCap, Rocket, Car, Sun } from '../../utils/icons'

gsap.registerPlugin(ScrollTrigger)

interface ChangelogEntry {
  id: string
  date: string
  version: string
  type: 'Skill' | 'Project' | 'Experience' | 'Education' | 'Milestone' | 'Certificate'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)  }, [])

  // Changelog entries data
  const changelogEntries: ChangelogEntry[] = [
    {
      id: '1',
      date: 'PRESENT',
      version: 'ENSI : School of New Sciences & Engineering',
      type: 'Education',
      title: 'Fourth-year Software Engineering student',
      description: 'I am currently in my fourth year Engineering degree, majoring in Big Data and Artificial Intelligence. I am passionate about the evolution of AI and eager to apply my skills to practical and innovative projects.',
      tags: ['MERN / MEAN', 'AI/ML', 'Big Data', 'DevOps/MLOps'],
      location: 'Tangier',
      icon: Code
    },
    {
      id: '2',
      date: '2017-2020',
      version: 'faculty of sciences - University Ibn Tofail',
      type: 'Education',
      title: "Bachelor's degree in Renewable Energy",
      description:"Pursued a Master's in Renewable Energy, acquiring strong knowledge in sustainable technologies and energy systems. Completed a 6-month traineeship in the Power-to-X field and served as Head Chef for Anglophone teams in the Solar Decathlon Africa competition.",
      tags: ['sustainable Energy', 'Energy efficiency', 'Solar Decathlon Africa',"IRESEN",'Green Energy Park'],
      location: 'Kenitra / Benguerir',
      icon: Sun
    },
    {
      id: '3',
      date: '2016-2017',
      version: 'ENSAM : High National School Of Arts and Crafts',
      type: 'Certificate',
      title: 'Certificate of Professional Competence in Car Manufacturing & Embedded Electronics',
      description: 'Completed hands-on training and coursework focused on modern automotive manufacturing techniques and embedded electronic systems.',
      tags: ['Embedded Systems', 'Car Manufacturing', 'Microcontrollers', 'Sensors & Actuators', 'Diagnostics',],
      location: 'Rabat',
      icon: Car
    },

    {
      id: '4',
      date: '2012-2015',
      version: 'Faculty of Sciences - University Mohammed V',
      type: 'Education',
      title: 'Bachelor of Science in Material Physics',
      description: 'Acquired a solid foundation in material properties, thermodynamics, and quantum mechanics. Conducted research on advanced materials for energy applications.',
      tags: ['Math', 'Physics', 'Computer Science', 'Electronics'],
      location: 'Rabat',
      icon: GraduationCap
    },
    //    {
    //  id: '5',
    //  date: '2024.06',
    //version: 'v3.0.8',
    //  type: 'Skill',
    //  title: 'Animation & Motion Design',
    //  description: 'Advanced proficiency in GSAP, Framer Motion, and CSS animations. Creating smooth, performant animations that enhance user experience.',
    //  tags: ['GSAP', 'Framer Motion', 'CSS', 'Performance'],
    //  icon: Atom
    //},
   // {
     // id: '6',
      //date: '2023.11',
      //version: 'v2.5.0',
    //  type: 'Skill',
    //  title: 'Modern TypeScript & React Patterns',
    //  description: 'Deep expertise in TypeScript, React hooks, and modern patterns. Focus on type safety, performance, and maintainable code architecture.',
    //  tags: ['TypeScript', 'React', 'Hooks', 'Architecture'],
    //  icon: Code
    //},
   // {
     // id: '7',
    //  date: '2023.08',
     // version: 'v2.3.0',
    //  type: 'Education',
    //  title: 'Advanced Web Development Certification',
    //  description: 'Completed comprehensive program covering modern web technologies, performance optimization, and best practices in software development.',
    //  tags: ['Certification', 'Web Development', 'Best Practices'],
    //  location: 'Online Academy',
    //  icon: GraduationCap
   // }
  ]
  const toggleCardExpansion = (entryId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {      // Animate title
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
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
      case 'Certificate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Project': return 'bg-green-100 text-green-800 border-green-200'
      case 'Experience': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Education': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  return (
    <section ref={sectionRef} id="about" className="pt-12 pb-20 px-6 bg-white relative overflow-hidden" data-theme="light">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      
      <div className="max-w-6xl mx-auto relative z-10">        {/* Section Title */}
        <div className="text-center mb-12">          <h2 ref={titleRef} className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[3.5rem] font-black uppercase tracking-[-0.02em] mb-8 pointer-events-none sm:whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] text-gray-900">
            <span className="block sm:inline">ACADEMIC</span>{' '}
            <span className="block sm:inline px-1 rounded" style={{ backgroundColor: '#FFEB3B', color: '#333446', paddingTop: '1px', paddingBottom: '1px' }}>
              JOURNEY
            </span>
          </h2><p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            A journey through skills, projects, and milestones that shaped my expertise in critical thinking & problem-solving.
          </p>
        </div>        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline background line - hidden on mobile */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 timeline-line hidden md:block" 
            style={{ 
              height: `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 400 : 100}px` 
            }} 
          />
          {/* Timeline progress line - hidden on mobile */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600 timeline-progress origin-top scale-y-0 hidden md:block" 
            style={{ 
              height: `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 400 : 100}px` 
            }} 
          />          {/* Changelog entries */}
          <div className="relative md:block md:min-h-0" style={{ minHeight: isMobile ? 'auto' : `${changelogEntries.length > 0 ? (changelogEntries.length - 1) * 224 + 360 : 0}px` }}>            {changelogEntries.map((entry, index) => {
              const IconComponent = entry.icon;
              // Place odd id (1,3,5...) on left, even id (2,4,6...) on right - desktop only
              const isLeft = parseInt(entry.id) % 2 === 1;
              // Calculate staggered positioning - each card starts at more spacing to prevent overlap
              const cardHeight = 320; // Increased card height including spacing
              const staggerOffset = cardHeight * 0.7; // Increased spacing between cards
              const topPosition = index * staggerOffset;

              return (
                <div 
                  key={entry.id} 
                  className="md:absolute md:flex md:items-start md:w-full mb-8 md:mb-0"
                  style={{ top: !isMobile ? `${topPosition}px` : 'auto' }}
                >
                  {/* Centered icon on timeline - desktop only, top of card on mobile */}
                  <div className="timeline-icon md:absolute md:left-1/2 md:top-8 md:-translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-blue-200 flex items-center justify-center shadow-lg md:z-30 opacity-0 scale-0 transition-all duration-500 mb-4 md:mb-0 mx-auto md:mx-0">
                    <IconComponent size={20} className="text-blue-600" />
                  </div>

                  {/* Entry card, positioned left or right on desktop, full width on mobile */}
                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:mr-auto md:pr-16 md:text-right' : 'md:ml-auto md:pl-16 md:text-left'}`}>                    <div 
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full relative z-10 md:cursor-default cursor-pointer"
                      onClick={(e) => {
                        // Only toggle on mobile and if not clicking on a button
                        if (isMobile && !(e.target as HTMLElement).closest('button')) {
                          toggleCardExpansion(entry.id)
                        }
                      }}
                    >
                      {/* Header */}
                      <div className={`flex items-center gap-3 mb-4 justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                        <div className={`flex items-center gap-2 ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(entry.type)}`}>
                            {entry.type}
                          </span>
                          <span className="text-sm font-mono text-gray-500">{entry.version}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                        {/* Description with responsive see more functionality */}
                      <div className="text-gray-600 mb-4 leading-relaxed">
                        {/* Show description based on expansion state */}
                        {expandedCards[entry.id] 
                          ? entry.description 
                          : isMobile 
                            ? '' // On mobile, hide description when collapsed
                            : entry.description.length > 120 
                              ? entry.description.substring(0, 120) + '...'
                              : entry.description
                        }
                        
                        {/* See more/less button - works on both mobile and desktop */}
                        {((isMobile && !expandedCards[entry.id]) || (!isMobile && entry.description.length > 120)) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCardExpansion(entry.id)
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline relative z-20 cursor-pointer transition-colors duration-200 hover:bg-blue-50 px-1 py-0.5 rounded"
                          >
                            {expandedCards[entry.id] ? 'Show less' : isMobile ? 'Tap to read more...' : 'See more'}
                          </button>
                        )}
                      </div>
                      
                      {/* Tags - show only when expanded on mobile or always on desktop */}
                      {(!isMobile || expandedCards[entry.id]) && (
                        <div className={`flex flex-wrap gap-2 mb-3 justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                          {entry.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Date and location - show only when expanded on mobile or always on desktop */}
                      {(!isMobile || expandedCards[entry.id]) && (
                        <div className={`flex items-center gap-4 text-sm text-gray-500 justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
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
                      )}
                    </div>
                  </div>
                    
                  {/* Connector line - desktop only */}
                  <div className={`timeline-connector absolute top-8 w-12 h-0.5 bg-gray-200 opacity-0 hidden md:block ${isLeft ? 'right-1/2 mr-6' : 'left-1/2 ml-6'}`} />
                </div>
              )
            })}
          </div>        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
            <Rocket size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">when you stop learning you start dying...</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
