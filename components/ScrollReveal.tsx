'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
}

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(true) // Start visible to avoid content hiding
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only apply animation after mount
    setIsVisible(false)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.05, // Lower threshold
        rootMargin: '50px 0px', // Start animation earlier
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    // Fallback - show content after 500ms if not visible yet
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  )
}
