'use client'

import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/data'

export default function Applications() {
  const [applications, setApplications] = useState<string[]>([])

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

  return (
    <section id="zastosowania" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-12">
          Zastosowania
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {appsToShow.map((app, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-accent transition-colors duration-200"
            >
              <div className="text-lg font-semibold text-primary-dark">
                {app}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

