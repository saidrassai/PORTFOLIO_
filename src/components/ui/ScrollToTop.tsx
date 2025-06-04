import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when user scrolls down 400px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 400)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-black/10 backdrop-blur-md border border-black/20 rounded-full hover:bg-black/20 transition-all duration-300 group"
      aria-label="Scroll to top"
    >
      <ArrowUp 
        size={20} 
        className="text-black group-hover:text-black transition-colors duration-300" 
      />
    </button>
  )
}

export default ScrollToTop
