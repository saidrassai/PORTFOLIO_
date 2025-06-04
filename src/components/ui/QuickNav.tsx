import { useState, useEffect } from 'react'
import { ChevronUp, Calendar, Code, User, Briefcase } from 'lucide-react'

const QuickNav = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)
  const sections = [
    { id: 'hero', label: 'Home', icon: User },
    { id: 'about', label: 'Changelog', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'contact', label: 'Contact', icon: Briefcase }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > 500)

      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
        offsetTop: document.getElementById(section.id)?.offsetTop || 0
      }))

      const currentSection = sectionElements
        .filter(section => section.element)
        .reduce((prev, current) => {
          const currentDistance = Math.abs(scrollPosition + 100 - current.offsetTop)
          const prevDistance = Math.abs(scrollPosition + 100 - prev.offsetTop)
          return currentDistance < prevDistance ? current : prev
        })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-6 bottom-6 z-50 space-y-3">
      {/* Quick Navigation */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-gray-100">
        {sections.map((section) => {
          const IconComponent = section.icon
          const isActive = activeSection === section.id
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={section.label}
            >
              <IconComponent size={18} />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {section.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  )
}

export default QuickNav
