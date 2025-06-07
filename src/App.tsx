import { useEffect, useState, Suspense, lazy } from 'react'
import Hero from './components/sections/Hero'
import Navigation from './components/ui/Navigation'
import PageLoader from './components/ui/PageLoader'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import { initSmoothScrolling } from './utils/smoothScroll'

// Lazy load heavy components
const About = lazy(() => import('./components/sections/About'))
const TechStack = lazy(() => import('./components/sections/TechStack'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Contact = lazy(() => import('./components/sections/Contact'))

// Loading fallback component
const SectionLoader = ({ height = "min-h-[400px]" }: { height?: string }) => (
  <div className={`${height} flex items-center justify-center bg-gray-50`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)


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
        {/* Hero Section - Loads immediately */}
        <section id="hero">
          <Hero />
        </section>

        {/* Lazy loaded sections */}
        <section id="about">
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
        </section>
        <section id="techstack">
          <Suspense fallback={<SectionLoader height="min-h-[600px]" />}>
            <TechStack />
          </Suspense>
        </section>
        <section id="projects">
          <Suspense fallback={<SectionLoader height="min-h-[800px]" />}>
            <Projects />
          </Suspense>
        </section>
        <section id="contact">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
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
