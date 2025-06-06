import { useState, useEffect, useRef } from 'react'
import { Menu, X, Github, Linkedin, Mail } from '../../utils/icons'
import { gsap } from 'gsap'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [sectionTheme, setSectionTheme] = useState<'light' | 'dark'>('dark')
  const logoRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);      // Update active section based on scroll position
      const sections = ['home', 'about', 'techstack', 'projects', 'contact']
      let foundSection = null;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            foundSection = section;
            break;
          }
        }
      }
      if (foundSection) {
        setActiveSection(foundSection);
        // Detect theme from data-theme attribute
        const el = document.getElementById(foundSection);
        const theme = el?.getAttribute('data-theme') as 'light' | 'dark' | null;
        setSectionTheme(theme === 'light' ? 'light' : 'dark');
      }
    }

    // Animate logo on mount
    gsap.fromTo(logoRef.current, 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
    )

    // Animate menu items on mount
    const menuItems = menuRef.current?.children
    if (menuItems) {
      gsap.fromTo(menuItems,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.4, stagger: 0.1 }
      )
    }    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Tech Stack', href: '#techstack' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  // Calculate opacity: more transparent at top, more solid as you scroll down (max at 120px)
  const minOpacity = 0.2;
  const maxOpacity = sectionTheme === 'dark' ? 0.7 : 0.8;
  const scrollMax = 120;
  const opacity = scrollY < 10 ? minOpacity : Math.min(maxOpacity, minOpacity + ((maxOpacity - minOpacity) * Math.min(scrollY, scrollMax) / scrollMax));
  const navBg = scrollY < 5
    ? 'bg-transparent'
    : sectionTheme === 'dark'
      ? ''
      : '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md shadow-sm ${navBg}`}
      style={{
        backgroundColor:
          scrollY < 5
            ? 'transparent'
            : sectionTheme === 'dark'
              ? `rgba(17,17,17,${opacity})` // Tailwind's neutral-900
              : `rgba(255,255,255,${opacity})`,
      }}
    >      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-2">
        <div className="flex items-center justify-between">            {/* Logo */}          <div
            ref={logoRef}
            className={`text-sm sm:text-lg font-light tracking-wide cursor-pointer hover:scale-105 transition-all duration-300 ${
              sectionTheme === 'dark' ? 'text-white hover:text-gray-100' : 'text-neutral-900 hover:text-neutral-800'
            }`}
          >
            <span className="hidden sm:inline">WELCOME TO RASSAISAID.ME</span>
            <span className="sm:hidden">RASSAISAID.ME</span>
          </div>

          {/* Desktop Navigation */}
          <div ref={menuRef} className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-200 group ${
                  activeSection === item.href.slice(1)
                    ? sectionTheme === 'dark' ? 'text-white' : 'text-neutral-900'
                    : sectionTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 transition-all duration-200 ${
                  activeSection === item.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </a>
            ))}          </div>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-4 ml-6">
            <a
              href="https://github.com/saidrassai"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-200 ${
                sectionTheme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-200 ${
                sectionTheme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:rassai.said@ensi.ma"
              className={`p-2 rounded-lg transition-all duration-200 ${
                sectionTheme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="Email"
            >
              <Mail size={18} />
            </a>
          </div>          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-3 rounded-lg transition-all duration-200 ${
              sectionTheme === 'dark' 
                ? 'text-gray-200 hover:text-white hover:bg-white/10' 
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 border-t transition-all duration-200 ${
            sectionTheme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'
          }`}>            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`block py-3 px-2 text-base font-medium transition-all duration-200 rounded-lg ${
                  activeSection === item.href.slice(1)
                    ? sectionTheme === 'dark' 
                      ? 'text-white bg-white/10' 
                      : 'text-neutral-900 bg-neutral-100'
                    : sectionTheme === 'dark' 
                      ? 'text-gray-200 hover:text-white hover:bg-white/5' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </a>
            ))}
            
            {/* Mobile Social Media Icons */}
            <div className={`flex items-center justify-center space-x-2 mt-6 pt-4 border-t ${
              sectionTheme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <a
                href="https://github.com/saidrassai"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  sectionTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="GitHub"
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  sectionTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="mailto:rassai.said@ensi.ma"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  sectionTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
