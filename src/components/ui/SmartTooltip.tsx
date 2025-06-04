import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ExternalLink, Github, Calendar, MapPin } from 'lucide-react'

interface SmartTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  delay?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: string
  interactive?: boolean
}

const SmartTooltip = ({ 
  content, 
  children, 
  delay = 300, 
  position = 'top',
  maxWidth = '300px',
  interactive = false 
}: SmartTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true)
      if (tooltipRef.current) {
        gsap.fromTo(tooltipRef.current, 
          { opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "back.out(1.7)" }
        )
      }
    }, delay)
  }
  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!interactive || !isHovered) {
      setIsVisible(false)
    }
  }

  const getTooltipPosition = () => {
    const baseClasses = "absolute z-[100] pointer-events-none"
    switch (position) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 mb-2`
      case 'bottom':
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 mt-2`
      case 'left':
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 mr-2`
      case 'right':
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 ml-2`
      default:
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 mb-2`
    }
  }

  const getArrowClasses = () => {
    const baseClasses = "absolute w-3 h-3 bg-gray-900 rotate-45"
    switch (position) {
      case 'top':
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1.5`
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1.5`
      case 'left':
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 -ml-1.5`
      case 'right':
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 -mr-1.5`
      default:
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 -mt-1.5`
    }
  }
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={getTooltipPosition()}
          style={{ maxWidth }}
          onMouseEnter={() => interactive && setIsHovered(true)}
          onMouseLeave={() => interactive && setIsHovered(false)}
        >
          <div className={`bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-xl border border-gray-700 ${
            interactive ? 'pointer-events-auto' : ''
          }`}>
            {content}
            <div className={getArrowClasses()} />
          </div>
        </div>
      )}
    </div>
  )
}

// Pre-built tooltip variants for common use cases
export const ProjectTooltip = ({ project, children }: { project: any, children: React.ReactNode }) => (
  <SmartTooltip
    interactive
    maxWidth="350px"
    content={
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">{project.title}</h4>
          <div className="flex items-center space-x-2">
            {project.github && (
              <a href={project.github} className="text-blue-400 hover:text-blue-300">
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live && (
              <a href={project.live} className="text-green-400 hover:text-green-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
        
        {project.features && (
          <div>
            <h5 className="text-xs font-medium text-gray-400 mb-2">Key Features:</h5>
            <ul className="text-xs text-gray-300 space-y-1">
              {project.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {project.tech && (
          <div className="flex flex-wrap gap-1">
            {project.tech.slice(0, 5).map((tech: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    }
  >
    {children}
  </SmartTooltip>
)

export const SkillTooltip = ({ skill, children }: { skill: any, children: React.ReactNode }) => (
  <SmartTooltip
    content={
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">{skill.name}</h4>
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
            {skill.level || 'Advanced'}
          </span>
        </div>
        
        {skill.description && (
          <p className="text-gray-300 text-sm">{skill.description}</p>
        )}
        
        {skill.experience && (
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {skill.experience} experience
          </div>
        )}
        
        {skill.projects && (
          <div className="text-xs text-gray-400">
            Used in {skill.projects} projects
          </div>
        )}
      </div>
    }
  >
    {children}
  </SmartTooltip>
)

export const ExperienceTooltip = ({ experience, children }: { experience: any, children: React.ReactNode }) => (
  <SmartTooltip
    interactive
    maxWidth="400px"
    content={
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-white">{experience.title}</h4>
          <p className="text-blue-300 text-sm">{experience.company}</p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {experience.period}
          </div>
          {experience.location && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {experience.location}
            </div>
          )}
        </div>
        
        {experience.description && (
          <p className="text-gray-300 text-sm leading-relaxed">{experience.description}</p>
        )}
        
        {experience.achievements && (
          <div>
            <h5 className="text-xs font-medium text-gray-400 mb-2">Key Achievements:</h5>
            <ul className="text-xs text-gray-300 space-y-1">
              {experience.achievements.slice(0, 3).map((achievement: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-1 h-1 bg-green-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    }
  >
    {children}
  </SmartTooltip>
)

export default SmartTooltip
