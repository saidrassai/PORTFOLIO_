import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hook for basic GSAP animations
export const useGSAP = (
  animation: (ctx: gsap.Context) => void,
  dependencies: any[] = []
) => {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    contextRef.current = gsap.context(animation)
    
    return () => {
      contextRef.current?.revert()
    }
  }, dependencies)

  return contextRef.current
}

// Hook for scroll-triggered animations
export const useScrollAnimation = (
  target: RefObject<Element>,
  animation: gsap.TweenVars,
  triggerOptions: ScrollTrigger.Vars = {}
) => {
  useEffect(() => {
    if (!target.current) return

    const defaults: ScrollTrigger.Vars = {
      trigger: target.current,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }

    const tween = gsap.fromTo(target.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        ...animation,
        scrollTrigger: { ...defaults, ...triggerOptions }
      }
    )

    return () => {
      tween.kill()
    }
  }, [target, animation, triggerOptions])
}

// Hook for stagger animations
export const useStaggerAnimation = (
  containerRef: RefObject<Element>,
  childSelector: string = "> *",
  options: {
    animation?: gsap.TweenVars
    stagger?: number
    triggerOptions?: ScrollTrigger.Vars
  } = {}
) => {
  const {
    animation = { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    stagger = 0.1,
    triggerOptions = {}
  } = options

  useEffect(() => {
    if (!containerRef.current) return

    const children = containerRef.current.querySelectorAll(childSelector)
    if (children.length === 0) return

    const defaults: ScrollTrigger.Vars = {
      trigger: containerRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }

    const tween = gsap.fromTo(children,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        ...animation,
        stagger,
        scrollTrigger: { ...defaults, ...triggerOptions }
      }
    )

    return () => {
      tween.kill()
    }
  }, [containerRef, childSelector, animation, stagger, triggerOptions])
}

// Hook for hover animations
export const useHoverAnimation = (
  target: RefObject<Element>,
  hoverAnimation: gsap.TweenVars = { scale: 1.05 },
  duration: number = 0.3
) => {
  useEffect(() => {
    if (!target.current) return

    const element = target.current as HTMLElement
    
    const hoverTween = gsap.to(element, {
      ...hoverAnimation,
      duration,
      ease: "power2.out",
      paused: true
    })

    const handleMouseEnter = () => hoverTween.play()
    const handleMouseLeave = () => hoverTween.reverse()

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      hoverTween.kill()
    }
  }, [target, hoverAnimation, duration])
}

// Hook for page load animations
export const usePageLoadAnimation = (
  targets: RefObject<Element>[],
  animations: gsap.TweenVars[] = []
) => {
  useEffect(() => {
    const timeline = gsap.timeline()

    targets.forEach((target, index) => {
      if (target.current) {
        const animation = animations[index] || {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }

        timeline.fromTo(target.current,
          { opacity: 0, y: 30 },
          animation,
          index === 0 ? 0 : "-=0.3"
        )
      }
    })

    return () => {
      timeline.kill()
    }
  }, [targets, animations])
}

// Hook for parallax effects
export const useParallax = (
  target: RefObject<Element>,
  speed: number = 0.5
) => {
  useEffect(() => {
    if (!target.current) return

    const tween = gsap.to(target.current, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: target.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    return () => {
      tween.kill()
    }
  }, [target, speed])
}
