'use client'

import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/data'

export default function About() {
  const [content, setContent] = useState('')

  useEffect(() => {
    const siteContent = getSiteContent()
    setContent(siteContent.about.content)
    
    const handleStorageChange = () => {
      setContent(getSiteContent().about.content)
    }
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const newContent = getSiteContent().about.content
      if (newContent !== content) {
        setContent(newContent)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [content])

  return (
    <section id="o-firmie" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-6">
            O firmie
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4 whitespace-pre-line">
            {content || 'LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.'}
          </div>
        </div>
      </div>
    </section>
  )
}

