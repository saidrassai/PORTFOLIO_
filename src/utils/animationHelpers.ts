import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const createScrollAnimation = (
  trigger: HTMLElement | string,
  element: HTMLElement | HTMLElement[],
  options: {
    from?: gsap.TweenVars
    to?: gsap.TweenVars
    start?: string
    end?: string
    scrub?: boolean
    toggleActions?: string
    stagger?: number
  } = {}
) => {
  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    toggleActions = "play none none reverse",
    stagger = 0
  } = options

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      toggleActions,
    }
  })

  if (Array.isArray(element)) {
    tl.fromTo(element, from, { ...to, stagger })
  } else {
    tl.fromTo(element, from, to)
  }

  return tl
}

export const createHoverAnimation = (
  element: HTMLElement,
  options: {
    scale?: number
    y?: number
    duration?: number
    ease?: string
  } = {}
) => {
  const { scale = 1.05, y = -5, duration = 0.3, ease = "power2.out" } = options

  const handleMouseEnter = () => {
    gsap.to(element, {
      scale,
      y,
      duration,
      ease
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration,
      ease
    })
  }

  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

export const createStaggeredTextAnimation = (
  container: HTMLElement,
  options: {
    delay?: number
    duration?: number
    ease?: string
    stagger?: number
  } = {}
) => {
  const { delay = 0, duration = 0.8, ease = "power3.out", stagger = 0.1 } = options
  
  const words = container.textContent?.split(' ') || []
  container.innerHTML = words
    .map(word => `<span class="inline-block">${word}</span>`)
    .join(' ')

  const wordElements = container.querySelectorAll('span')

  gsap.fromTo(wordElements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  )
}
