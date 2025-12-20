'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/data'

export default function Hero() {
  const [content, setContent] = useState({ title: '', subtitle: '' })

  useEffect(() => {
    const siteContent = getSiteContent()
    setContent(siteContent.hero)
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setContent(getSiteContent().hero)
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Check periodically for changes
    const interval = setInterval(() => {
      const newContent = getSiteContent().hero
      if (JSON.stringify(newContent) !== JSON.stringify(content)) {
        setContent(newContent)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [content])

  return (
    <section className="relative pt-36 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/zlogiem.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: '55% 65%' }}
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Gradient transition to carousel at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-primary-dark/90 via-primary-dark/70 via-primary-dark/50 via-primary-dark/30 via-primary-dark/15 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative z-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.8)]">
            {content.title || 'LiD-MAR – producent pasty BHP do mycia rąk'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-100 mb-8 leading-relaxed drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.8)]">
            {content.subtitle || 'Produkujemy skuteczne pasty BHP do zastosowań przemysłowych – dla zakładów pracy, warsztatów i firm produkcyjnych.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
            >
              Zapytaj o ofertę
            </a>
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
            >
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

