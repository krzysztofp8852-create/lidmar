'use client'

import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/data'

export default function Cooperation() {
  const [content, setContent] = useState('')

  useEffect(() => {
    const siteContent = getSiteContent()
    setContent(siteContent.cooperation.content)
    
    const handleStorageChange = () => {
      setContent(getSiteContent().cooperation.content)
    }
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const newContent = getSiteContent().cooperation.content
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
    <section id="wspolpraca" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-6">
            Współpraca
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4 whitespace-pre-line">
            {content || 'Oferujemy współpracę hurtową z firmami poszukującymi niezawodnego partnera w zakresie produktów BHP.'}
          </div>
        </div>
      </div>
    </section>
  )
}

