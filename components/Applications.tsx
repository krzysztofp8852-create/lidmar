'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSiteContent } from '@/lib/useSiteData'

export default function Applications() {
  const siteContent = useSiteContent()
  const applications = siteContent.applications
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  const defaultApps = [
    { title: 'zakłady produkcyjne', description: 'Nasze produkty znajdują zastosowanie w zakładach produkcyjnych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.' },
    { title: 'warsztaty mechaniczne', description: 'Nasze produkty znajdują zastosowanie w warsztatach mechanicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.' },
    { title: 'serwisy techniczne', description: 'Nasze produkty znajdują zastosowanie w serwisach technicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.' },
    { title: 'przemysł ciężki i lekki', description: 'Nasze produkty znajdują zastosowanie w przemyśle ciężkim i lekkim, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.' },
  ]

  const appsToShow = applications && applications.length > 0 ? applications : defaultApps

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
    <section id="zastosowania" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden shadow-2xl">
      <div className="container-custom relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-dark mb-12 text-center">
          Zastosowania
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Description and Navigation */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-primary-dark rounded-lg p-6 sm:p-8 lg:p-10 shadow-lg">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
                {currentApp?.title || ''}
              </div>
              <p className="text-white/90 text-lg sm:text-xl leading-relaxed">
                {currentApp?.description || ''}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPrev}
                className="bg-primary-dark p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-transparent hover:scale-110 shadow-md"
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

              <div className="flex gap-2">
                {appsToShow.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPrevIndex(currentIndex)
                      setCurrentIndex(index)
                    }}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-primary-dark w-8'
                        : 'bg-primary-dark/50 w-2 hover:bg-primary-dark/75'
                    }`}
                    aria-label={`Przejdź do ${appsToShow[index]}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="bg-primary-dark p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-transparent hover:scale-110 shadow-md"
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

            {/* Right side - Images */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            {/* Base image layer */}
            <Image
              key={`base-${currentIndex}`}
              src={currentBg}
              alt={currentApp?.title || ''}
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />
            {/* Fading out previous image */}
            {prevIndex !== currentIndex && (
              <Image
                key={`fade-${prevIndex}`}
                src={prevBg}
                alt=""
                fill
                className="object-cover animate-fade-out absolute inset-0"
                priority
              />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

