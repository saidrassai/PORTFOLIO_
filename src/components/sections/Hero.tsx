import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Download, Mouse } from 'lucide-react'
import VideoHero from '../hero/VideoHero'

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial entrance animations
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(ctaRef.current,      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.2"
    )
  }, [])
  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-slate-900" data-theme="dark">{/* Video Background */}
      <VideoHero 
        introVideoSrc="/video/home.webm"
        loopVideoSrc="/video/home_loop.webm"
        className="z-0"
      />
      
      {/* Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-sm bg-black/20 p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-white/10"><h1 
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 tracking-tight text-white drop-shadow-xl"
          >
            <span className=" font-bold"style={{ color: '#EEEEEE' }}>WHERE IDEAS</span>
            <span className="text-white font-bold mx-2"> </span>
            <span className="font-bold px-1 rounded" style={{ color: '#333446', backgroundColor: '#FFEB3B', paddingTop: '1px', paddingBottom: '1px' }}>BECOMES REALITY</span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg px-2 sm:px-0"
          >
            Building solutions for tomorrow through modern technologies, clean design, critical thinking & a creative spirit.
          </p>            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a 
              href="#projects"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition-all duration-300 font-medium shadow-lg text-center"
            >
              View Work
            </a>            <a
              href="/Resume.pdf"
              download="RASSAI_SAID_Resume.pdf"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-yellow-400 hover:bg-yellow-300 backdrop-blur-sm text-gray-900 rounded-full transition-all duration-300 font-medium shadow-lg text-center flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
            <a 
              href="#contact"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-white/30 backdrop-blur-sm text-white rounded-full hover:border-white/50 hover:bg-white/10 transition-all duration-300 font-medium text-center"
            >
              Get In Touch
            </a>          </div>
        </div>
      </div>
        {/* Mouse scroll indicator at bottom */}
      <div 
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group"
        onClick={() => {
          const nextSection = document.querySelector('#about')
          if (nextSection) {
            nextSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }}
      >
        <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
          <Mouse size={20} className="text-white/70 group-hover:text-white/90 transition-colors duration-300 sm:hidden" />
          <Mouse size={24} className="text-white/70 group-hover:text-white/90 transition-colors duration-300 hidden sm:block" />
          <div className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-300 font-light">Scroll</div>
        </div>
      </div>
    </section>
  )
}

export default Hero
