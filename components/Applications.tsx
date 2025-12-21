'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSiteContent } from '@/lib/data'

export default function Applications() {
  const [applications, setApplications] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    const siteContent = getSiteContent()
    setApplications(siteContent.applications)
    
    const handleStorageChange = () => {
      setApplications(getSiteContent().applications)
    }
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const newApps = getSiteContent().applications
      if (JSON.stringify(newApps) !== JSON.stringify(applications)) {
        setApplications(newApps)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [applications])

  const defaultApps = [
    'zakłady produkcyjne',
    'warsztaty mechaniczne',
    'serwisy techniczne',
    'przemysł ciężki i lekki',
  ]

  const appsToShow = applications.length > 0 ? applications : defaultApps

  const backgroundImages = [
    '/zaklady_prod.jpg',
    '/mechanik.jpg',
    '/serwis.jpg',
    '/ciezki.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex)
      setCurrentIndex((prev) => (prev + 1) % appsToShow.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [appsToShow.length, currentIndex])

  const goToNext = () => {
    setPrevIndex(currentIndex)
    setCurrentIndex((prev) => (prev + 1) % appsToShow.length)
  }

  const goToPrev = () => {
    setPrevIndex(currentIndex)
    setCurrentIndex((prev) => (prev - 1 + appsToShow.length) % appsToShow.length)
  }

  const currentApp = appsToShow[currentIndex]
  const currentBg = backgroundImages[currentIndex] || backgroundImages[0]
  const prevBg = backgroundImages[prevIndex] || backgroundImages[0]

  return (
    <section id="zastosowania" className="py-16 sm:py-20 lg:py-24 bg-primary-dark relative overflow-hidden min-h-[40vh] flex items-center justify-center">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        {/* Base image layer */}
        <Image
          key={`base-${currentIndex}`}
          src={currentBg}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Fading out previous image */}
        {prevIndex !== currentIndex && (
          <Image
            key={`fade-${prevIndex}`}
            src={prevBg}
            alt=""
            fill
            className="object-cover animate-fade-out"
            priority
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 drop-shadow-lg [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.8)]">
            Zastosowania
          </h2>
          
          <div className="glass-card rounded-lg p-8 sm:p-12 inline-block mb-8">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.8)] relative z-10">
              {currentApp}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={goToPrev}
              className="glass-button p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent relative z-10"
              aria-label="Poprzednie zastosowanie"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="glass-button p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent relative z-10"
              aria-label="Następne zastosowanie"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

