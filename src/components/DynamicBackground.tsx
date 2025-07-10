'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntersectionObserver, throttle, useMemoryCleanup } from '../utils/performance'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  vx: number
  vy: number
}

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

// Mobile detection
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Performance constants - more aggressive for mobile
const PARTICLE_COUNT = isMobile() ? 3 : 8 // Drastically reduced for mobile
const NODE_COUNT = isMobile() ? 3 : 6 // Reduced for mobile
const MAX_CONNECTION_DISTANCE = isMobile() ? 80 : 100 // Reduced for mobile
const MOUSE_MOVE_THROTTLE = isMobile() ? 100 : 16 // Much slower on mobile
const ANIMATION_THROTTLE = isMobile() ? 100 : 16 // Much slower on mobile

export default function DynamicBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, isVisible } = useIntersectionObserver(0.1)
  const addCleanup = useMemoryCleanup([])
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  
  const [particles, setParticles] = useState<Particle[]>([])
  const [, setFloatingShapes] = useState<FloatingShape[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const nodesRef = useRef<Node[]>([])
  const lastFrameTimeRef = useRef(0)

  // Detect mobile device
  useEffect(() => {
    setIsMobileDevice(isMobile())
    setIsMounted(true)
  }, [])

  // Generate particles only after component mounts (client-side only)
  const generateParticles = useCallback(() => {
    if (shouldReduceMotion || !isMounted || isMobileDevice) return []
    
    const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5, // Smaller particles
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 8 + 6, // Shorter duration
      delay: Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }))
  }, [shouldReduceMotion, isMounted, isMobileDevice])

  // Initialize particles only after mount and if not mobile
  useEffect(() => {
    if (isMounted && !isMobileDevice) {
      setParticles(generateParticles())
    }
  }, [isMounted, generateParticles, isMobileDevice])

  // Throttled mouse move handler - disabled on mobile
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (!isVisible || shouldReduceMotion || isMobileDevice) return
      
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
      setIsMouseMoving(true)

      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }

      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false)
      }, 500)
    }, MOUSE_MOVE_THROTTLE),
    [isVisible, shouldReduceMotion, isMobileDevice]
  )

  // Mouse move event listener - disabled on mobile
  useEffect(() => {
    if (shouldReduceMotion || isMobileDevice) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    addCleanup(() => window.removeEventListener('mousemove', handleMouseMove))

    return () => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
    }
  }, [handleMouseMove, shouldReduceMotion, addCleanup, isMobileDevice])

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    addCleanup(() => document.removeEventListener('visibilitychange', handleVisibilityChange))
  }, [addCleanup])

  // Optimized canvas animation - disabled on mobile
  useEffect(() => {
    if (shouldReduceMotion || !isVisible || !isMounted || isMobileDevice) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Limit DPR for performance
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    
    // Initialize nodes (client-side only to avoid hydration issues)
    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }))

    const animate = (currentTime: number) => {
      if (!isTabVisible || !isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle animation
      if (currentTime - lastFrameTimeRef.current < ANIMATION_THROTTLE) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameTimeRef.current = currentTime

      // Clear canvas efficiently
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const nodes = nodesRef.current

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= window.innerWidth) node.vx *= -1
        if (node.y <= 0 || node.y >= window.innerHeight) node.vy *= -1

        // Draw connections (optimized)
        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j]
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < MAX_CONNECTION_DISTANCE) {
            const opacity = (1 - distance / MAX_CONNECTION_DISTANCE) * 0.2
            ctx.globalAlpha = opacity
            ctx.strokeStyle = '#6366f1'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        }

        // Draw node
        ctx.globalAlpha = 0.6
        ctx.fillStyle = '#6366f1'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    const resizeHandler = throttle(resizeCanvas, 500)
    window.addEventListener('resize', resizeHandler)
    
    addCleanup(() => {
      window.removeEventListener('resize', resizeHandler)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [shouldReduceMotion, isVisible, isMounted, isTabVisible, addCleanup, isMobileDevice])

  // Mobile-optimized simple background
  if (isMobileDevice || shouldReduceMotion) {
    return (
      <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-secondary-900/10" />
        {/* Simple static elements for mobile */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-500/5 rounded-full blur-3xl" />
      </div>
    )
  }

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Optimized background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-900/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-secondary-900/20" />
      
      {/* Neural network canvas - only when visible and not mobile */}
      {isVisible && !isMobileDevice && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-30"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Simplified floating particles - only for desktop */}
      {isVisible && !isMobileDevice && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-20 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            x: ['-15px', '15px', '-15px'],
            y: ['-20px', '20px', '-20px'],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Simplified mouse-following gradient - only for desktop */}
      {isVisible && !isMobileDevice && (
        <motion.div
          className="absolute w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            background: isMouseMoving 
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%)',
          }}
          animate={{
            scale: isMouseMoving ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isMouseMoving ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Simplified glowing orbs - only for desktop */}
      {isVisible && !isMobileDevice && (
        <>
          {/* Cyber Turtle Logo - Floating Element */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-24 h-24"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative w-full h-full">
              <img 
                src="/cyber-turtle-logo.jpg" 
                alt="Cyber Turtle Logo" 
                className="w-full h-full object-cover rounded-full shadow-xl"
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.3)) drop-shadow(0 0 30px rgba(99, 102, 241, 0.2))',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 blur-xl" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-3/4 right-1/4 w-16 h-16 bg-gradient-to-br from-secondary-500/10 to-accent-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          />
        </>
      )}

      {/* Simplified ambient light - only for desktop */}
      {isVisible && !isMobileDevice && (
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  )
} 