'use client'

import { useSiteContent } from '@/lib/useSiteData'

export default function About() {
  const siteContent = useSiteContent()
  const content = siteContent.about.content

  return (
    <section id="o-firmie" className="py-16 sm:py-20 lg:py-24 bg-primary-dark flex items-center justify-center">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto flex flex-col justify-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
              O firmie
            </h2>
            <img 
              src="/ofirmie.gif" 
              alt="O firmie" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </div>
          <div className="prose prose-lg max-w-none text-gray-100 space-y-4 whitespace-pre-line">
            {content || 'LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.'}
          </div>
        </div>
      </div>
    </section>
  )
}

