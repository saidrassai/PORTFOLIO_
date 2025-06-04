import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export const animationConfig = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    hero: 1.5
  },
  ease: {
    out: "power3.out",
    in: "power3.in",
    inOut: "power3.inOut",
    elastic: "elastic.out(1, 0.3)",
    bounce: "bounce.out"
  }
}

export const fadeInUp = (element: Element, options = {}) => {
  const defaults = {
    duration: animationConfig.duration.normal,
    ease: animationConfig.ease.out,
    y: 30,
    delay: 0
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.fromTo(element,
    { opacity: 0, y: config.y },
    { 
      opacity: 1, 
      y: 0, 
      duration: config.duration,
      ease: config.ease,
      delay: config.delay
    }
  )
}

export const staggerFadeInUp = (elements: Element[], options = {}) => {
  const defaults = {
    duration: animationConfig.duration.normal,
    ease: animationConfig.ease.out,
    y: 50,
    stagger: 0.1
  }
  
  const config = { ...defaults, ...options }
  
  return gsap.fromTo(elements,
    { opacity: 0, y: config.y, scale: 0.95 },
    { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger
    }
  )
}

export const createScrollTriggerAnimation = (element: Element, animation: gsap.core.Tween, options = {}) => {
  const defaults = {
    trigger: element,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
  
  const config = { ...defaults, ...options }
  
  ScrollTrigger.create({
    ...config,
    animation: animation
  })
  
  return animation
}

export const parallaxEffect = (element: Element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  })
}

export const hoverScale = (element: Element, scale = 1.05) => {
  const hover = gsap.to(element, {
    scale,
    duration: animationConfig.duration.fast,
    ease: animationConfig.ease.out,
    paused: true
  })
  
  element.addEventListener('mouseenter', () => hover.play())
  element.addEventListener('mouseleave', () => hover.reverse())
  
  return hover
}

export const typewriter = (element: Element, text: string, speed = 50) => {
  element.textContent = ''
  
  return gsap.to(element, {
    duration: text.length / speed,
    ease: "none",
    onUpdate: function() {
      const progress = this.progress()
      const currentLength = Math.round(progress * text.length)
      element.textContent = text.substring(0, currentLength)
    }
  })
}

// Prefers reduced motion utility
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const createAccessibleAnimation = (element: Element, animation: () => gsap.core.Tween) => {
  if (respectsReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, scale: 1 })
    return gsap.timeline()
  }
  return animation()
}
