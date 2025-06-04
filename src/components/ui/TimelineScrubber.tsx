import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronUp, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface TimelineScrubberProps {
  sections: Array<{
    id: string
    label: string
    color: string
  }>
}

const TimelineScrubber = ({ sections }: TimelineScrubberProps) => {
  const scrubberRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 100 },
        ease: "power2.inOut"
      })
    }
  }, [])

  // Track scroll progress and active section
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      setProgress(scrollPercent)

      // Show scrubber after scrolling past hero
      setIsVisible(scrollTop > window.innerHeight * 0.3)

      // Determine active section
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isInView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5
          if (isInView) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [sections])

  // Navigation functions
  const navigateUp = () => {
    const prevIndex = Math.max(0, activeSection - 1)
    scrollToSection(sections[prevIndex].id)
  }

  const navigateDown = () => {
    const nextIndex = Math.min(sections.length - 1, activeSection + 1)
    scrollToSection(sections[nextIndex].id)
  }

  return (
    <div 
      ref={scrubberRef}
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      {/* Navigation Controls */}
      <div className="flex flex-col items-center space-y-4">
        {/* Up Button */}
        <button
          onClick={navigateUp}
          disabled={activeSection === 0}
          className="group relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                     flex items-center justify-center transition-all duration-300
                     hover:bg-white/20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
        </button>

        {/* Timeline Progress Track */}
        <div className="relative w-1 h-64 bg-white/10 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ height: `${progress * 100}%` }}
          />
          
          {/* Section Markers */}
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white 
                         transition-all duration-300 group hover:scale-150 ${
                activeSection === index 
                  ? 'bg-white shadow-lg shadow-white/50' 
                  : 'bg-transparent hover:bg-white/50'
              }`}
              style={{ 
                top: `${(index / (sections.length - 1)) * 100}%`,
                backgroundColor: activeSection === index ? section.color : undefined
              }}
            >
              {/* Tooltip */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900/90 
                             text-white text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                             group-hover:opacity-100 transition-opacity duration-200">
                {section.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 
                               w-2 h-2 bg-gray-900/90 rotate-45" />
              </div>
            </button>
          ))}
        </div>

        {/* Down Button */}
        <button
          onClick={navigateDown}
          disabled={activeSection === sections.length - 1}
          className="group relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                     flex items-center justify-center transition-all duration-300
                     hover:bg-white/20 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}

export default TimelineScrubber
