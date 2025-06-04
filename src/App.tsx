import { useEffect, useState } from 'react'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import TechStack from './components/sections/TechStack'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import Navigation from './components/ui/Navigation'
import PageLoader from './components/ui/PageLoader'
import ScrollToTop from './components/ui/ScrollToTop'
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
        {/* Fixed Navigation */}
        <Navigation />
        
        {/* Scroll to Top Arrow */}
        <ScrollToTop />
        
        {/* Main Content */}
        <main className="relative">
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
      </main>
      </div>
    </>
  )
}

export default App
