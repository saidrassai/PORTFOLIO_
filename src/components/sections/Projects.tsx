import { useState, useEffect } from 'react'

interface TeamMember {
  name: string
  role: string
}

const Projects = () => {
  const teamMembers: TeamMember[] = [
    { name: "Emily Kim", role: "Founder" },
    { name: "Michael Steward", role: "Creative Director" },
    { name: "Emma Rodriguez", role: "Lead Developer" },
    { name: "Julia Gimmel", role: "UX Designer" },
    { name: "Lisa Anderson", role: "Marketing Manager" },
    { name: "James Wilson", role: "Product Manager" }
  ]

  const imageUrls = [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmVzc2lvbmFsJTIwcGVvcGxlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2Zlc3Npb25hbCUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [memberInfo, setMemberInfo] = useState({ name: teamMembers[0].name, role: teamMembers[0].role })
  const [infoOpacity, setInfoOpacity] = useState(1)

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return
    setIsAnimating(true)

    const validIndex = (newIndex + teamMembers.length) % teamMembers.length
    setCurrentIndex(validIndex)

    // Fade out member info
    setInfoOpacity(0)

    // Update member info after fade out
    setTimeout(() => {
      setMemberInfo({
        name: teamMembers[validIndex].name,
        role: teamMembers[validIndex].role
      })
      setInfoOpacity(1)
    }, 300)

    // Reset animation lock
    setTimeout(() => {
      setIsAnimating(false)
    }, 800)
  }
  const getCardPosition = (index: number): string => {
    const offset = (index - currentIndex + teamMembers.length) % teamMembers.length

    if (offset === 0) return 'center'
    if (offset === 1) return 'right-1'
    if (offset === 2) return 'right-2'
    if (offset === teamMembers.length - 1) return 'left-1'
    if (offset === teamMembers.length - 2) return 'left-2'
    return 'hidden'
  }
  const getCardStyles = (position: string): string => {
    const baseStyles = "absolute bg-white rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
      switch (position) {
      case 'center':
        return `${baseStyles} w-[320px] h-[420px] z-10 scale-110 translate-z-0`
      case 'left-1':
        return `${baseStyles} w-[288px] h-[378px] z-[5] -translate-x-[200px] scale-100 translate-z-[-100px] opacity-90`
      case 'left-2':
        return `${baseStyles} w-[256px] h-[336px] z-[1] -translate-x-[400px] scale-80 translate-z-[-300px] opacity-70`
      case 'right-1':
        return `${baseStyles} w-[288px] h-[378px] z-[5] translate-x-[200px] scale-100 translate-z-[-100px] opacity-90`
      case 'right-2':
        return `${baseStyles} w-[256px] h-[336px] z-[1] translate-x-[400px] scale-80 translate-z-[-300px] opacity-70`
      case 'hidden':
        return `${baseStyles} w-[280px] h-[380px] opacity-0 pointer-events-none`
      default:
        return `${baseStyles} w-[280px] h-[380px]`
    }
  }

  const getImageStyles = (position: string): string => {
    const baseStyles = "w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
    
    if (position === 'center') {
      return `${baseStyles} filter-none`
    }
    return `${baseStyles} grayscale`
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1)
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          updateCarousel(currentIndex + 1)
        } else {
          updateCarousel(currentIndex - 1)
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentIndex])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      {/* Title */}
      <h1 className="text-[7.5rem] font-black uppercase tracking-[-0.02em] absolute top-[45px] left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap font-['Arial_Black','Arial_Bold',Arial,sans-serif] bg-gradient-to-b from-[rgba(8,42,123,0.35)] to-[rgba(255,255,255,0)] bg-clip-text text-transparent md:text-[4.5rem]">
        OUR TEAM
      </h1>

      {/* Carousel Container */}
      <div className="w-full max-w-[1200px] h-[450px] relative perspective-[1000px] mt-20">
        {/* Carousel Track */}
        <div 
          className="w-full h-full flex justify-center items-center relative preserve-3d transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Cards */}
          {imageUrls.map((imageUrl, index) => {
            const position = getCardPosition(index)
            return (
              <div
                key={index}
                className={getCardStyles(position)}
                onClick={() => updateCarousel(index)}
              >
                <img
                  src={imageUrl}
                  alt={`Team Member ${index + 1}`}
                  className={getImageStyles(position)}
                />
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none pb-1 pr-[3px] hover:bg-[rgba(0,0,0,0.8)] hover:scale-110"
          onClick={() => updateCarousel(currentIndex - 1)}
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 text-2xl border-none outline-none pb-1 pl-[3px] hover:bg-[rgba(0,0,0,0.8)] hover:scale-110"
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </button>
      </div>

      {/* Member Info */}
      <div 
        className="text-center mt-10 transition-all duration-500 ease-out"
        style={{ opacity: infoOpacity }}
      >
        <h2 className="text-[rgb(8,42,123)] text-4xl font-bold mb-2.5 relative inline-block before:content-[''] before:absolute before:top-full before:left-[-120px] before:w-[100px] before:h-0.5 before:bg-[rgb(8,42,123)] after:content-[''] after:absolute after:top-full after:right-[-120px] after:w-[100px] after:h-0.5 after:bg-[rgb(8,42,123)] md:text-[2rem] md:before:w-[50px] md:before:left-[-70px] md:after:w-[50px] md:after:right-[-70px]">
          {memberInfo.name}
        </h2>
        <p className="text-[#848696] text-2xl font-medium opacity-80 uppercase tracking-[0.1em] py-2.5 -mt-[15px] relative md:text-[1.2rem]">
          {memberInfo.role}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-15">
        {teamMembers.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[rgb(8,42,123)] scale-120' 
                : 'bg-[rgba(8,42,123,0.2)]'
            }`}
            onClick={() => updateCarousel(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
