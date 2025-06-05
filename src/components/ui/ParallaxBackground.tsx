import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxBackgroundProps {
  children?: React.ReactNode
  pattern?: 'dots' | 'lines' | 'circles' | 'custom'
  speed?: number
  opacity?: number
  color?: string
}

const ParallaxBackground = ({ 
  children,
  pattern = 'dots',
  speed = 0.5,
  opacity = 0.1,
  color = 'currentColor'
}: ParallaxBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const yMove = progress * 50 * speed
          gsap.set(container, { y: -yMove })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [speed])

  const getPattern = () => {
    const baseStyle = {
      position: 'absolute' as const,
      inset: 0,
      opacity,
      pointerEvents: 'none' as const,
      color
    }

    switch (pattern) {
      case 'dots':
        return (
          <div 
            style={{
              ...baseStyle,
              backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />
        )
      case 'lines':
        return (
          <div 
            style={{
              ...baseStyle,
              backgroundImage: `linear-gradient(45deg, ${color} 1px, transparent 1px)`,
              backgroundSize: '15px 15px'
            }}
          />
        )
      case 'circles':
        return (
          <div 
            style={{
              ...baseStyle,
              backgroundImage: `radial-gradient(circle at center, transparent 8px, ${color} 8px, ${color} 9px, transparent 9px)`,
              backgroundSize: '30px 30px'
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {pattern !== 'custom' && getPattern()}
      {children}
    </div>
  )
}

export default ParallaxBackground
