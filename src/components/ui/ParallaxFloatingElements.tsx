import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FloatingElement {
  id: string
  size: number
  x: number
  y: number
  color: string
  speed: number
  rotation?: boolean
}

interface ParallaxFloatingElementsProps {
  elements?: FloatingElement[]
  sectionRef?: React.RefObject<HTMLElement>
}

const ParallaxFloatingElements = ({ 
  elements, 
  sectionRef 
}: ParallaxFloatingElementsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const defaultElements: FloatingElement[] = [
    {
      id: 'circle-1',
      size: 40,
      x: 10,
      y: 20,
      color: 'rgba(99,102,241,0.1)',
      speed: 0.3,
      rotation: true
    },
    {
      id: 'circle-2',
      size: 60,
      x: 85,
      y: 15,
      color: 'rgba(147,51,234,0.08)',
      speed: -0.4
    },
    {
      id: 'circle-3',
      size: 30,
      x: 20,
      y: 70,
      color: 'rgba(59,130,246,0.12)',
      speed: 0.5,
      rotation: true
    },
    {
      id: 'circle-4',
      size: 50,
      x: 75,
      y: 80,
      color: 'rgba(139,92,246,0.06)',
      speed: -0.2
    },
    {
      id: 'circle-5',
      size: 25,
      x: 50,
      y: 10,
      color: 'rgba(99,102,241,0.15)',
      speed: 0.6,
      rotation: true
    }
  ]

  const floatingElements = elements || defaultElements

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      floatingElements.forEach((element) => {
        const elementNode = container.querySelector(`[data-element="${element.id}"]`)
        if (!elementNode) return

        // Set initial position
        gsap.set(elementNode, {
          left: `${element.x}%`,
          top: `${element.y}%`
        })

        // Parallax movement on scroll
        ScrollTrigger.create({
          trigger: sectionRef?.current || container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const yMove = progress * 100 * element.speed
            
            gsap.set(elementNode, { 
              y: yMove,
              ...(element.rotation && { rotation: progress * 180 })
            })
          }
        })

        // Floating animation
        gsap.to(elementNode, {
          y: "+=20",
          duration: 3 + Math.random() * 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2
        })

        // Subtle scaling animation
        gsap.to(elementNode, {
          scale: 1.1,
          duration: 4 + Math.random() * 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 3
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [floatingElements, sectionRef])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {floatingElements.map((element) => (
        <div
          key={element.id}
          data-element={element.id}
          className="absolute rounded-full blur-sm"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            backgroundColor: element.color,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export default ParallaxFloatingElements
