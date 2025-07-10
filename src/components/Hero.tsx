'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Sparkles, Code, Zap, Download, Mail, ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

const typingTexts = [
  'Full-Stack Developer',
  'Computer Science Student',
  'Problem Solver',
  'Innovation Enthusiast',
  'Tech Explorer'
]

interface Particle {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

export default function Hero() {
  const { scrollY } = useScroll()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const y = useTransform(scrollY, [0, 500], [0, isMobile ? 100 : 250])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Set mounted state and detect mobile
  useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])

  // Generate particles only on client side and not on mobile
  useEffect(() => {
    if (isMounted && !isMobile) {
      const generatedParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
      }))
      setParticles(generatedParticles)
    }
  }, [isMounted, isMobile])

  useEffect(() => {
    if (isMobile) return // Disable mouse tracking on mobile
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  // Typing animation effect
  useEffect(() => {
    const currentText = typingTexts[currentTextIndex]
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, 100)
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, currentTextIndex])

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Floating Elements - Only on desktop */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-xl"
            animate={{
              x: mousePosition.x * 40,
              y: mousePosition.y * 40,
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              x: { duration: 0.8 },
              y: { duration: 0.8 },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            }}
          />
          
          <motion.div
            className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-lg"
            animate={{
              x: mousePosition.x * -30,
              y: mousePosition.y * -30,
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              x: { duration: 1 },
              y: { duration: 1 },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            }}
          />
          
          <motion.div
            className="absolute bottom-32 left-40 w-24 h-24 bg-gradient-to-r from-secondary-500/20 to-accent-500/20 rounded-full blur-2xl"
            animate={{
              x: mousePosition.x * 35,
              y: mousePosition.y * 35,
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              x: { duration: 1.2 },
              y: { duration: 1.2 },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            }}
          />
        </>
      )}

      {/* Enhanced Floating Icons - Only on desktop */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-32 left-1/4 text-primary-400/30"
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Code className="w-8 h-8" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/4 right-1/4 text-secondary-400/30"
            animate={{
              y: [20, -20, 20],
              rotate: [0, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Zap className="w-7 h-7" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 right-1/3 text-accent-400/30"
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 180, 360],
              scale: [1, 1.08, 1],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
        </>
      )}

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.span 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-primary-400 text-sm font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Welcome to my digital universe
              <motion.div
                className="w-2 h-2 bg-primary-400 rounded-full ml-2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.span>
          </motion.div>

          {/* Enhanced Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-none"
          >
            <span className="block">
              Sayari{' '}
              <motion.span 
                className="gradient-text inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Mohamed
              </motion.span>
            </span>
            <motion.span 
              className="gradient-text block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Amin
            </motion.span>
          </motion.h1>

          {/* Enhanced Dynamic Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10"
          >
            <div className="glass-light rounded-2xl px-8 py-6 inline-block border border-white/20 backdrop-blur-md">
              <div className="flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                  {displayText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-primary-400 ml-1"
                  >
                    |
                  </motion.span>
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            I'm a computer engineering student passionate about{' '}
            <motion.span 
              className="text-primary-400 font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              innovative development
            </motion.span>
            . As a self-driven learner, I'm seeking opportunities to gain hands-on experience, 
            enhance my skills, and contribute to{' '}
            <motion.span 
              className="text-secondary-400 font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              cutting-edge projects
            </motion.span>
            {' '}within collaborative environments.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              onClick={scrollToProjects}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/25 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Explore My Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              />
            </motion.button>
            
            <motion.button
              onClick={scrollToContact}
              className="group relative px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-400/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Get In Touch
                <motion.div
                  className="w-2 h-2 bg-primary-400 rounded-full ml-2 opacity-0 group-hover:opacity-100"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              />
            </motion.button>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={scrollToProjects}
            >
              <span className="text-gray-400 text-sm font-medium">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Floating Particles - Only render on client and desktop */}
      {isMounted && !isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
} 