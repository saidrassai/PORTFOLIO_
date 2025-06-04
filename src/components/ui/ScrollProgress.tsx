import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollProgress = () => {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3
        }
      })
    })

    return () => ctx.revert()
  }, [])

  // Set z-50 to be above the navbar (which is also z-50 by default in Tailwind)
  // Use top-0 to place it at the very top, and z-60 (custom) or z-[60] if you want to ensure it's above
  // If you want it to overlap, z-50 is enough, but to guarantee, use z-[60]
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-100/50 backdrop-blur-sm z-[60]">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left scale-x-0"
      />
    </div>
  )
}

export default ScrollProgress
