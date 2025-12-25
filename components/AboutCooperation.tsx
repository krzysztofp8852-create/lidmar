'use client'

import { useSiteContent } from '@/lib/useSiteData'

export default function AboutCooperation() {
  const siteContent = useSiteContent()
  const aboutContent = siteContent.about.content
  const cooperationContent = siteContent.cooperation.content

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-primary-dark">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* O firmie */}
          <div id="o-firmie" className="flex flex-col">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                O firmie
              </h2>
              <img 
                src="/ofirmie.gif" 
                alt="O firmie" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </div>
            <div className="prose prose-lg max-w-none text-gray-100 space-y-4 whitespace-pre-line">
              {aboutContent || 'LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.'}
            </div>
          </div>

          {/* Współpraca */}
          <div id="wspolpraca" className="flex flex-col">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Współpraca
              </h2>
              <img 
                src="/wspolpraca1.gif" 
                alt="Współpraca" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </div>
            <div className="prose prose-lg max-w-none text-gray-100 space-y-4 whitespace-pre-line">
              {cooperationContent || 'Oferujemy współpracę hurtową z firmami poszukującymi niezawodnego partnera w zakresie produktów BHP.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

