import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Moon, 
  Sun, 
  Maximize
} from 'lucide-react'

interface FloatingAction {
  id: string
  label: string
  icon: any
  color: string
  action: () => void
}

interface FloatingActionsProps {
  onSearch?: () => void
  onFilter?: () => void
  onThemeToggle?: () => void
  onFullscreen?: () => void
  onShare?: () => void
  onDownload?: () => void
}

const FloatingActions = ({
  onSearch,
  onFilter,
  onThemeToggle,
  onFullscreen,
  onShare,
  onDownload
}: FloatingActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement[]>([])

  // Show FAB after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset > window.innerHeight * 0.3
      setIsVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
    onThemeToggle?.()
  }

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    onFullscreen?.()
  }

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Changelog Portfolio',
          text: 'Check out this amazing changelog-style portfolio!',
          url: window.location.href
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
    onShare?.()
  }

  // Handle download resume
  const handleDownload = () => {
    // Create a temporary link to download resume
    const link = document.createElement('a')
    link.href = '/resume.pdf' // You would put your actual resume file here
    link.download = 'resume.pdf'
    link.click()
    onDownload?.()
  }

  const actions: FloatingAction[] = [
    {
      id: 'search',
      label: 'Search Timeline',
      icon: Search,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onSearch?.()
    },
    {
      id: 'filter',
      label: 'Filter Content',
      icon: Filter,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onFilter?.()
    },
    {
      id: 'theme',
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? Sun : Moon,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: handleThemeToggle
    },
    {
      id: 'fullscreen',
      label: 'Fullscreen',
      icon: Maximize,
      color: 'bg-green-500 hover:bg-green-600',
      action: handleFullscreen
    },
    {
      id: 'share',
      label: 'Share Portfolio',
      icon: Share2,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: handleShare
    },
    {
      id: 'download',
      label: 'Download Resume',
      icon: Download,
      color: 'bg-red-500 hover:bg-red-600',
      action: handleDownload
    }
  ]

  // Animation for expanding/collapsing
  useEffect(() => {
    if (isExpanded) {
      actionsRef.current.forEach((action, index) => {
        if (action) {
          gsap.fromTo(action,
            { opacity: 0, scale: 0, y: 20 },
            { 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              duration: 0.3,
              delay: index * 0.05,
              ease: "back.out(1.7)"
            }
          )
        }
      })
    } else {
      actionsRef.current.forEach((action) => {
        if (action) {
          gsap.to(action, {
            opacity: 0,
            scale: 0,
            y: 20,
            duration: 0.2
          })
        }
      })
    }
  }, [isExpanded])

  if (!isVisible) return null

  return (
    <div 
      ref={fabRef}
      className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start space-y-reverse space-y-3"
    >
      {/* Action Buttons */}
      {isExpanded && (
        <div className="flex flex-col space-y-3">
          {actions.map((action, index) => (
            <div
              key={action.id}
              ref={(el) => {
                if (el) actionsRef.current[index] = el
              }}
              className="group relative"
            >
              <button
                onClick={() => {
                  action.action()
                  setIsExpanded(false)
                }}
                className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg 
                           flex items-center justify-center transition-all duration-300
                           hover:shadow-xl hover:scale-110 group`}
              >
                <action.icon className="w-5 h-5" />
              </button>
              
              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 
                             text-white text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                             group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                {action.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 translate-x-1 
                               w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                   text-white shadow-lg flex items-center justify-center transition-all duration-300
                   hover:shadow-xl hover:scale-105 ${isExpanded ? 'rotate-45' : ''}`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Background overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}

export default FloatingActions
