import { useEffect, useState } from 'react'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import TechStack from './components/sections/TechStack'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import Navigation from './components/ui/Navigation'
import PageLoader from './components/ui/PageLoader'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import { initSmoothScrolling } from './utils/smoothScroll'



function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Initialize smooth scrolling
  useEffect(() => {
    initSmoothScrolling()
  }, [])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {/* Page Loader */}
      {isLoading && <PageLoader onLoadComplete={handleLoadComplete} />}
      
      <div className={`relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Global Scroll Progress Bar */}
        <ScrollProgress />
        
        {/* Fixed Navigation */}
        <Navigation />
        
        {/* Scroll to Top Arrow */}
        <ScrollToTop />
        
        {/* Main Content */}
        <main className="relative bg-white">
        {/* Hero Section */}
        <section id="hero">
          <Hero />
        </section>

        {/* Other Sections */}
        <section id="about">
          <About />
        </section>
        <section id="techstack">
          <TechStack />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
        
        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-sm">
              <div className="text-gray-300">
                © 2025 All rights reserved
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className="text-gray-300">Made with ❤️ by</span>
                <a 
                  href="https://rassaisaid.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-blue-400 transition-colors duration-300"
                >
                  RASS.AI
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </>
  )
}

export default App
