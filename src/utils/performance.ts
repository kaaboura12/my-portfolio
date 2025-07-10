// Performance utilities for optimal portfolio experience

import { useEffect, useRef, useCallback, useState } from 'react'

// Throttle utility for high-frequency events
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

// Debounce utility for delayed execution
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | null
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }) as T
}

// Intersection Observer hook for viewport-based animations
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Disconnect after first intersection for performance
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}

// Lazy loading hook for images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image()
          img.onload = () => {
            setImageSrc(src)
            setIsLoaded(true)
            observer.disconnect()
          }
          img.onerror = () => {
            setIsError(true)
            observer.disconnect()
          }
          img.src = src
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [src])

  return { imgRef, imageSrc, isLoaded, isError }
}

// Reduced motion preference detection
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return shouldReduceMotion
}

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0)
  const startTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current++
    const endTime = performance.now()
    const renderTime = endTime - startTime.current

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(
          2
        )}ms`
      )
    }

    startTime.current = endTime
  })

  return renderCount.current
}

// Smooth scroll utility
export const smoothScrollTo = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}

// CSS animation utilities
export const ANIMATION_VARIANTS = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  },
  slideInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  },
  slideInDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  // Stagger animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }
}

// Common transition settings
export const TRANSITIONS = {
  smooth: { duration: 0.3, ease: 'easeInOut' },
  bouncy: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 100, damping: 15 },
  fast: { duration: 0.15, ease: 'easeInOut' }
}

// Browser capability detection
export const getBrowserCapabilities = () => {
  const supports = {
    webp: false,
    avif: false,
    modernFonts: false,
    smoothScrolling: false
  }

  // Check WebP support
  const webpCanvas = document.createElement('canvas')
  webpCanvas.width = 1
  webpCanvas.height = 1
  supports.webp = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0

  // Check AVIF support
  const avifCanvas = document.createElement('canvas')
  avifCanvas.width = 1
  avifCanvas.height = 1
  supports.avif = avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0

  // Check font-display support
  supports.modernFonts = CSS.supports('font-display', 'swap')

  // Check smooth scrolling
  supports.smoothScrolling = 'scrollBehavior' in document.documentElement.style

  return supports
}

// Memory cleanup utility
export const useMemoryCleanup = (dependencies: any[] = []) => {
  const cleanup = useRef<(() => void)[]>([])

  const addCleanup = useCallback((cleanupFunction: () => void) => {
    cleanup.current.push(cleanupFunction)
  }, [])

  useEffect(() => {
    return () => {
      cleanup.current.forEach(fn => fn())
      cleanup.current = []
    }
  }, dependencies)

  return addCleanup
}

// Resource preloading
export const preloadResource = (url: string, type: 'image' | 'font' | 'script') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  
  switch (type) {
    case 'image':
      link.as = 'image'
      break
    case 'font':
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      break
    case 'script':
      link.as = 'script'
      break
  }
  
  document.head.appendChild(link)
}

// Error boundary utility
export const logError = (error: Error, errorInfo: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Portfolio Error:', error, errorInfo)
  }
  // In production, send to error reporting service
} 