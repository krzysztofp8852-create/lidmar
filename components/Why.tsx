'use client'

import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/data'

export default function Why() {
  const [benefits, setBenefits] = useState<Array<{ title: string; description: string }>>([])

  useEffect(() => {
    const siteContent = getSiteContent()
    setBenefits(siteContent.why)
    
    const handleStorageChange = () => {
      setBenefits(getSiteContent().why)
    }
    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const newBenefits = getSiteContent().why
      if (JSON.stringify(newBenefits) !== JSON.stringify(benefits)) {
        setBenefits(newBenefits)
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [benefits])

  const defaultBenefits = [
    {
      title: 'Własna produkcja',
      description: 'Pełna kontrola nad procesem wytwarzania i jakością produktów.',
    },
    {
      title: 'Kontrola jakości',
      description: 'Ścisłe standardy zapewniające powtarzalność i niezawodność.',
    },
    {
      title: 'Elastyczność współpracy B2B',
      description: 'Dostosowanie warunków współpracy do potrzeb partnerów biznesowych.',
    },
    {
      title: 'Terminowe dostawy',
      description: 'Rzetelność w realizacji zamówień dla firm produkcyjnych.',
    },
  ]

  const benefitsToShow = benefits.length > 0 ? benefits : defaultBenefits

  return (
    <section id="dlaczego-lidmar" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-12 text-center">
            Dlaczego LiD-MAR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefitsToShow.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-primary-dark mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

