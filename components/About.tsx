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
    <section id="o-firmie" className="py-12 sm:py-16 lg:py-20 bg-primary-dark flex items-center justify-center">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto flex flex-col justify-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.8)]">
              O firmie
            </h2>
            <img 
              src="/ofirmie.gif" 
              alt="O firmie" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </div>
          <div className="p-6 sm:p-8">
            <div className="prose prose-xl max-w-none text-gray-100 space-y-4 whitespace-pre-line text-lg sm:text-xl [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.8)]">
              {content || 'LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

