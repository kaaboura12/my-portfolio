'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

// Performance: Constants moved outside component to prevent recreation
const SCROLL_THRESHOLD = 50
const LOGO_CLICK_THRESHOLD = 5
const EASTER_EGG_DURATION = 5000
const SCROLL_DEBOUNCE_MS = 10

// TypeScript interfaces for better type safety
interface NavItem {
  name: string
  href: string
}

interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

const socialLinks: SocialLink[] = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/kaaboura12', 
    icon: Github,
    color: 'hover:text-white'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: Linkedin,
    color: 'hover:text-blue-400'
  },
  { 
    name: 'Email', 
    href: 'mailto:mohamedamin.sayari@esprit.tn', 
    icon: Mail,
    color: 'hover:text-primary-400'
  },
]

// Performance: Debounce utility for scroll events
const useDebounce = (callback: () => void, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const debouncedCallback = useCallback(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    
    const timer = setTimeout(() => {
      callback()
    }, delay)
    
    setDebounceTimer(timer)
  }, [callback, delay, debounceTimer])

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [debounceTimer])

  return debouncedCallback
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [logoClicks, setLogoClicks] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  // Performance: Memoized section calculation
  const sectionIds = useMemo(() => navItems.map(item => item.href.substring(1)), [])

  // Performance: Optimized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    const offset = window.scrollY
    setScrolled(offset > SCROLL_THRESHOLD)

    // Update active section based on scroll position
    const currentSection = sectionIds.find(section => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      }
      return false
    })

    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection)
    }
  }, [sectionIds, activeSection])

  const debouncedHandleScroll = useDebounce(handleScroll, SCROLL_DEBOUNCE_MS)

  useEffect(() => {
    // Performance: Passive event listener for better scroll performance
    const options = { passive: true }
    window.addEventListener('scroll', debouncedHandleScroll, options)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [debouncedHandleScroll])

  // Easter egg logic with proper cleanup
  useEffect(() => {
    if (logoClicks >= LOGO_CLICK_THRESHOLD) {
      setShowEasterEgg(true)
      const timeout = setTimeout(() => {
        setShowEasterEgg(false)
        setLogoClicks(0)
      }, EASTER_EGG_DURATION)
      return () => clearTimeout(timeout)
    }
  }, [logoClicks])

  // Performance: Memoized navigation handler
  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false)
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Performance: Memoized logo click handler
  const handleLogoClick = useCallback(() => {
    setLogoClicks(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Accessibility: Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent background scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            aria-label="Go to top of page"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick()
              }
            }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 p-0.5 relative group"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
                <img 
                  src="/cyber-turtle-logo.jpg" 
                  alt="Sayari Mohamed Amine - Portfolio Logo" 
                  className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
                  loading="eager"
                  width={40}
                  height={40}
                />
                {/* Cyber glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
              </div>
            </motion.div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-lg">Sayari</span>
              {logoClicks > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-primary-400 text-sm"
                  aria-label={`Logo clicked ${logoClicks} times`}
                >
                  {logoClicks}
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  activeSection === item.href.substring(1)
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role="menuitem"
                aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
              >
                {item.name}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-400 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Social Links & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Visit ${social.name} profile`}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
            
            {/* Resume/CV Button */}
            <motion.a
              href="/Sayari-Mohamed-Amin-FlowCV-Resume-20250519.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Download resume PDF"
            >
              <span>Resume</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-dark backdrop-blur-md border-t border-white/10"
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors duration-200 ${
                    activeSection === item.href.substring(1)
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  role="menuitem"
                  aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Mobile Social Links */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/10">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
              
              {/* Mobile Resume Button */}
              <motion.a
                href="/Sayari-Mohamed-Amin-FlowCV-Resume-20250519.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Download resume PDF"
              >
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowEasterEgg(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="easter-egg-title"
            aria-describedby="easter-egg-description"
          >
            <motion.div
              className="glass-dark p-8 rounded-2xl text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-2xl" role="img" aria-label="Turtle emoji">🐢</span>
              </motion.div>
              <h3 id="easter-egg-title" className="text-xl font-bold text-white mb-2">Easter Egg Found!</h3>
              <p id="easter-egg-description" className="text-gray-300 mb-4">
                You found the hidden cyber turtle! Thanks for exploring my portfolio.
              </p>
              <button
                onClick={() => setShowEasterEgg(false)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Close easter egg dialog"
              >
                Cool!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 