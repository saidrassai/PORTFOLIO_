import { useEffect, useState } from 'react'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Portfolio from './components/sections/Portfolio'
import Contact from './components/sections/Contact'
import Navigation from './components/ui/Navigation'
import PageLoader from './components/ui/PageLoader'
import ScrollProgress from './components/ui/ScrollProgress'
import QuickNav from './components/ui/QuickNav'
import TimelineScrubber from './components/ui/TimelineScrubber'
import FloatingActions from './components/ui/FloatingActions'
import PerformanceMonitor from './components/ui/PerformanceMonitor'
import { initSmoothScrolling } from './utils/smoothScroll'



function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Define timeline sections for scrubber
  const timelineSections = [
    { id: 'hero', label: 'Introduction', color: '#3B82F6' },
    { id: 'about', label: 'Timeline', color: '#8B5CF6' },
    { id: 'portfolio', label: 'Projects', color: '#06B6D4' },
    { id: 'contact', label: 'Contact', color: '#10B981' }
  ]

  // Initialize smooth scrolling
  useEffect(() => {
    initSmoothScrolling()
  }, [])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  // Handle floating action callbacks
  const handleSearch = () => {
    // You can implement a global search modal here
    console.log('Search triggered')
  }

  const handleFilter = () => {
    // You can implement a global filter modal here
    console.log('Filter triggered')
  }

  const handleThemeToggle = () => {
    // You can implement theme switching here
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      {/* Page Loader */}
      {isLoading && <PageLoader onLoadComplete={handleLoadComplete} />}
      
      <div className={`relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        {/* Fixed Navigation */}
        <Navigation />
        
        {/* Quick Navigation */}
        <QuickNav />
        
        {/* Timeline Scrubber */}
        <TimelineScrubber sections={timelineSections} />
        
        {/* Floating Actions */}
        <FloatingActions 
          onSearch={handleSearch}
          onFilter={handleFilter}
          onThemeToggle={handleThemeToggle}
        />
        
        {/* Performance Monitor */}
        <PerformanceMonitor />
        
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
        <section id="portfolio">
          <Portfolio />
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
