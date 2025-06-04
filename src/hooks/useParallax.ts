import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useParallax = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })
    }, element)

    return () => ctx.revert()
  }, [speed])

  return elementRef
}

export const useStaggerAnimation = (selector: string, delay: number = 0.1) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll(selector)
      
      gsap.fromTo(elements,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: delay,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, container)

    return () => ctx.revert()
  }, [selector, delay])

  return containerRef
}

export const useTimelineAnimation = () => {
  const timelineRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const ctx = gsap.context(() => {
      // Animate the timeline line growing
      const timelineLine = timeline.querySelector('.timeline-line')
      if (timelineLine) {
        gsap.fromTo(timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timeline,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }

      // Animate timeline entries
      const entries = timeline.querySelectorAll('.timeline-entry')
      entries.forEach((entry, index) => {
        const isLeft = index % 2 === 0
        
        gsap.fromTo(entry,
          { 
            opacity: 0, 
            x: isLeft ? -100 : 100, 
            scale: 0.8,
            rotation: isLeft ? -5 : 5
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: entry,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )
      })
    }, timeline)

    return () => ctx.revert()
  }, [])

  return timelineRef
}
