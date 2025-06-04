import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown } from 'lucide-react'
import Scene3D from '../3d/Scene3D'

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    )    .fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.2"
    )
  }, []);
  
  return (
    <section id="home" className="min-h-screen relative overflow-hidden" data-theme="dark">
      {/* 3D Scene Background */}
      <Scene3D />
      
      {/* Content */}      
      <div className="min-h-screen flex items-center justify-center px-6 z-1">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-sm bg-black/10 p-8 rounded-xl shadow-xl">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 tracking-tight text-white drop-shadow-xl"
          >
            Creative{' '}
            <span className="font-medium text-indigo-400">Developer</span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Building digital experiences with modern web technologies,
            clean design, and smooth animations
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#projects"
              className="px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition-all duration-300 font-medium shadow-lg"
            >
              View Work
            </a>
            <a 
              href="#contact"
              className="px-8 py-3 border-2 border-white/30 backdrop-blur-sm text-white rounded-full hover:border-white/50 hover:bg-white/10 transition-all duration-300 font-medium"
            >
              Get In Touch
            </a>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown size={24} className="text-white/70" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
