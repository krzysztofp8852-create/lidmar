'use client'

import { useSiteContent } from '@/lib/useSiteData'

export default function Why() {
  const siteContent = useSiteContent()
  const benefits = siteContent.why

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

  const benefitsToShow = benefits && benefits.length > 0 ? benefits : defaultBenefits

  return (
    <section id="dlaczego-lidmar" className="py-16 sm:py-20 lg:py-24 bg-primary-dark">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
              Dlaczego LiD-MAR
            </h2>
            <img 
              src="/dlaczego.gif" 
              alt="Dlaczego LiD-MAR" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </div>
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

