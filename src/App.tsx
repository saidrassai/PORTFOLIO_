import { useEffect, useState, lazy } from 'react'
import Hero from './components/sections/Hero'
import Navigation from './components/ui/Navigation'
import PageLoader from './components/ui/PageLoader'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollProgress from './components/ui/ScrollProgress'
import PerformanceErrorBoundary from './components/ui/PerformanceErrorBoundary'
import PerformanceMonitorOverlay from './components/ui/PerformanceMonitorOverlay'
import LazySection from './components/ui/LazySection'
import { initSmoothScrolling } from './utils/smoothScroll'
import { useMemoryMonitor, memoryUtils } from './utils/memoryManagement'

// Lazy load heavy components
const About = lazy(() => import('./components/sections/About'))
const TechStack = lazy(() => import('./components/sections/TechStack'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Contact = lazy(() => import('./components/sections/Contact'))



function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Monitor memory usage
  const { memoryUsage, isHighMemory } = useMemoryMonitor(150, (usage) => {
    console.warn('High memory usage detected:', usage)
    // Optionally force garbage collection if available
    if (typeof window !== 'undefined' && 'gc' in window) {
      memoryUtils.forceGarbageCollection()
    }
  })

  // Initialize smooth scrolling
  useEffect(() => {
    initSmoothScrolling()

    // Enable performance monitor in development or when ?debug=true
    const urlParams = new URLSearchParams(window.location.search)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const debugMode = urlParams.get('debug') === 'true'
    
    setShowPerformanceMonitor(isDevelopment || debugMode)

    // Log initial memory usage
    memoryUtils.logMemoryUsage('App Initialized')
  }, [])

  const handleLoadComplete = () => {
    setIsLoading(false)
    // Log memory usage after page load
    setTimeout(() => {
      memoryUtils.logMemoryUsage('Page Load Complete')
    }, 1000)
  }

  return (
    <PerformanceErrorBoundary>
      {/* Page Loader */}
      {isLoading && <PageLoader onLoadComplete={handleLoadComplete} />}
      
      <div className={`relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Global Scroll Progress Bar */}
        <ScrollProgress />
        
        {/* Fixed Navigation */}
        <Navigation />
        
        {/* Scroll to Top Arrow */}
        <ScrollToTop />
        
        {/* Performance Monitor (development/debug only) */}
        <PerformanceMonitorOverlay 
          enabled={showPerformanceMonitor} 
          position="bottom-right" 
        />
        
        {/* Memory warning for high usage */}
        {isHighMemory && memoryUsage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            High memory usage: {memoryUsage.used}MB
          </div>
        )}
        
        {/* Main Content */}
        <main className="relative bg-white">
        {/* Hero Section */}
        <section id="hero">
          <Hero />
        </section>

        {/* Other Sections with Intersection Observer-based Loading */}
        <LazySection id="about" threshold={0.2}>
          <About />
        </LazySection>
        
        <LazySection id="techstack" threshold={0.2}>
          <TechStack />
        </LazySection>
        
        <LazySection id="projects" threshold={0.2}>
          <Projects />
        </LazySection>
        
        <LazySection id="contact" threshold={0.2}>
          <Contact />
        </LazySection>
        
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
    </PerformanceErrorBoundary>
  )
}

export default App
