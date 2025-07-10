'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
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
  rotation: number
  color: string
  shape: 'circle' | 'square' | 'triangle'
  opacity: number
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

// Performance constants
const PARTICLE_COUNT = 12 // Reduced from 25
const NODE_COUNT = 8 // Reduced from 15
const MAX_CONNECTION_DISTANCE = 120 // Reduced from 150
const MOUSE_MOVE_THROTTLE = 16 // ~60fps
const ANIMATION_THROTTLE = 16 // ~60fps

export default function DynamicBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { ref, isVisible } = useIntersectionObserver(0.1)
  const addCleanup = useMemoryCleanup([])
  
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

  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate particles only after component mounts (client-side only)
  const generateParticles = useCallback(() => {
    if (shouldReduceMotion || !isMounted) return []
    
    const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6']
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // Reduced size
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 8, // Reduced duration
      delay: Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }))
  }, [shouldReduceMotion, isMounted])

  // Initialize particles only after mount
  useEffect(() => {
    if (isMounted) {
      setParticles(generateParticles())
    }
  }, [isMounted, generateParticles])

  // Throttled mouse move handler
  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (!isVisible || shouldReduceMotion) return
      
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
      }, 200)
    }, MOUSE_MOVE_THROTTLE),
    [isVisible, shouldReduceMotion]
  )

  // Mouse move event listener
  useEffect(() => {
    if (shouldReduceMotion) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    addCleanup(() => window.removeEventListener('mousemove', handleMouseMove))

    return () => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
    }
  }, [handleMouseMove, shouldReduceMotion, addCleanup])

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    addCleanup(() => document.removeEventListener('visibilitychange', handleVisibilityChange))
  }, [addCleanup])

  // Optimized canvas animation
  useEffect(() => {
    if (shouldReduceMotion || !isVisible || !isMounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
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
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))

    const animate = (currentTime: number) => {
      if (!isTabVisible || !isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle animation to ~60fps
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
            const opacity = (1 - distance / MAX_CONNECTION_DISTANCE) * 0.3
            ctx.globalAlpha = opacity
            ctx.strokeStyle = '#6366f1'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        }

        // Draw node
        ctx.globalAlpha = 0.8
        ctx.fillStyle = '#6366f1'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    const resizeHandler = throttle(resizeCanvas, 250)
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
  }, [shouldReduceMotion, isVisible, isMounted, isTabVisible, addCleanup])

  // Don't render expensive effects if motion is reduced
  if (shouldReduceMotion) {
    return (
      <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/10 via-transparent to-secondary-900/10" />
      </div>
    )
  }

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Optimized background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-900/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-secondary-900/20" />
      
      {/* Neural network canvas - only when visible */}
      {isVisible && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-40"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Simplified floating particles */}
      {isVisible && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            x: ['-20px', '20px', '-20px'],
            y: ['-25px', '25px', '-25px'],
            opacity: [0.1, 0.4, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Simplified mouse-following gradient */}
      {isVisible && (
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            background: isMouseMoving 
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
          }}
          animate={{
            scale: isMouseMoving ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: isMouseMoving ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Simplified glowing orbs */}
      {isVisible && (
        <>
          {/* Cyber Turtle Logo - Floating Element */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative w-full h-full">
              <img 
                src="/cyber-turtle-logo.jpg" 
                alt="Cyber Turtle Logo" 
                className="w-full h-full object-cover rounded-full shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-xl" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-secondary-500/20 to-accent-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </>
      )}

      {/* Simplified ambient light */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  )
} 