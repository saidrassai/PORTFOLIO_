import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxContentProps {
  children: React.ReactNode
  speed?: number // Parallax speed multiplier (0.5 = slower, 1.5 = faster)
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: boolean // Whether to add subtle scale effect
  rotate?: boolean // Whether to add subtle rotation
  quickReveal?: boolean // Whether to add quick reveal animation when section comes into view
  className?: string
}

const ParallaxContent = ({ 
  children, 
  speed = 0.8, 
  direction = 'up',
  scale = false,
  rotate = false,
  quickReveal = false,
  className = ''
}: ParallaxContentProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const ctx = gsap.context(() => {
      // Quick reveal animation for titles when section comes into view
      if (quickReveal) {
        gsap.set(element, { opacity: 0, y: 30 })
        
        ScrollTrigger.create({
          trigger: element,
          start: "top 85%", // Trigger when element is 85% into viewport
          end: "top 60%",   // Complete by the time it's 60% into viewport
          onEnter: () => {
            gsap.to(element, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              ease: "power2.out" 
            })
          }
        })
      }

      // Calculate movement based on direction
      const getMovement = (progress: number) => {
        const distance = progress * 100 * (1 - speed)
        switch (direction) {
          case 'up': return { y: -distance }
          case 'down': return { y: distance }
          case 'left': return { x: -distance }
          case 'right': return { x: distance }
          default: return { y: -distance }
        }
      }

      // Parallax effect
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const movement = getMovement(progress)
          
          const transforms = {
            ...movement,
            ...(scale && { scale: 1 + (progress * 0.05) }),
            ...(rotate && { rotation: progress * 2 })
          }
          
          gsap.set(element, transforms)
        }
      })
    }, elementRef)

    return () => ctx.revert()
  }, [speed, direction, scale, rotate, quickReveal])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

export default ParallaxContent
