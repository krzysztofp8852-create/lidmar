'use client'

import { useSiteContent } from '@/lib/useSiteData'

export default function Products() {
  const siteContent = useSiteContent()
  const productContent = siteContent.products

  const featuresToShow = productContent.features.length > 0 ? productContent.features : [
    'Skuteczne usuwanie zabrudzeń przemysłowych',
    'Bezpieczna dla skóry',
    'Zastosowanie w przemyśle i warsztatach',
  ]

  return (
    <section id="produkty" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-dark mb-12 text-center">
            Produkty
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-10 border border-gray-200">
            <h3 className="text-2xl sm:text-3xl font-semibold text-primary-dark mb-6">
              {productContent.title || 'Pasta BHP do mycia rąk'}
            </h3>
            {productContent.description && (
              <p className="text-gray-700 mb-6">
                {productContent.description}
              </p>
            )}
            <div className="space-y-6">
              {featuresToShow.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Kluczowe cechy:
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    {featuresToShow.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent mr-3 font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: productContent.title || 'Pasta BHP do mycia rąk',
              description: productContent.description || 'Skuteczna pasta BHP do mycia rąk dla zastosowań przemysłowych',
              manufacturer: {
                '@type': 'Organization',
                name: 'LiD-MAR',
              },
            }),
          }}
        />
      </div>
    </section>
  )
}

