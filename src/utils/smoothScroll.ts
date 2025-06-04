import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export const smoothScrollTo = (target: string | HTMLElement, duration: number = 1.5) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target
  
  if (!element || !(element instanceof HTMLElement)) return

  const targetPosition = element.offsetTop
  
  gsap.to(window, {
    duration,
    scrollTo: { y: targetPosition, autoKill: false },
    ease: "power2.inOut"
  })
}

export const initSmoothScrolling = () => {
  // Add smooth scrolling to all anchor links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement
    
    if (link) {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      if (targetId) {
        smoothScrollTo(targetId)
      }
    }
  })
}
