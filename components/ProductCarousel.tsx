'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getProducts, type Product } from '@/lib/data'

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setProducts(getProducts())
    
    // Listen for storage changes to update products
    const handleStorageChange = () => {
      setProducts(getProducts())
      if (currentIndex >= getProducts().length) {
        setCurrentIndex(0)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for changes (for same-tab updates)
    const interval = setInterval(() => {
      const newProducts = getProducts()
      if (JSON.stringify(newProducts) !== JSON.stringify(products)) {
        setProducts(newProducts)
        if (currentIndex >= newProducts.length) {
          setCurrentIndex(0)
        }
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [currentIndex, products])

  useEffect(() => {
    if (isAutoPlaying && products.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length)
      }, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, products.length])

  const goToNext = () => {
    if (products.length === 0) return
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const next = (prev + 1) % products.length
      return next
    })
  }

  const goToPrev = () => {
    if (products.length === 0) return
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + products.length) % products.length
      return prevIndex
    })
  }

  const getProductPosition = (index: number) => {
    if (products.length === 0) return 'center'
    if (products.length === 1) return 'center'
    
    const diff = (index - currentIndex + products.length) % products.length
    
    if (diff === 0) return 'center'
    if (diff === 1) return 'right1'
    if (diff === 2) return 'right2'
    if (diff === products.length - 1) return 'left1'
    if (diff === products.length - 2) return 'left2'
    
    // Hide products that are too far
    return 'hidden'
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="pt-0 sm:pt-2 lg:pt-4 pb-16 sm:pb-20 lg:pb-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/podbusem.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Gradient transition from Hero at top */}
        <div className="absolute top-0 left-0 right-0 h-64 sm:h-80 lg:h-96 bg-gradient-to-b from-primary-dark/95 via-primary-dark/85 via-primary-dark/70 via-primary-dark/55 via-primary-dark/40 via-primary-dark/25 via-primary-dark/10 to-transparent"></div>
        {/* Gradient transition to About section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 lg:h-64 bg-gradient-to-t from-primary-dark via-primary-dark/95 via-primary-dark/85 via-primary-dark/70 via-primary-dark/55 via-primary-dark/40 via-primary-dark/25 via-primary-dark/10 to-transparent"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div 
          className="relative h-[400px] sm:h-[500px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {products.map((product, index) => {
            const position = getProductPosition(index)
            
            let transformStyle = ''
            let opacity = 1
            let scale = 1
            let zIndex = 20
            let display = 'block'
            
            if (position === 'center') {
              transformStyle = 'translate3d(0, 0, 0) scale(1)'
              opacity = 1
              scale = 1
              zIndex = 30
              display = 'block'
            } else if (position === 'right1') {
              transformStyle = 'translate3d(50%, 0, -200px) scale(0.75)'
              opacity = 0.7
              scale = 0.75
              zIndex = 20
              display = 'block'
            } else if (position === 'right2') {
              transformStyle = 'translate3d(90%, 0, -350px) scale(0.55)'
              opacity = 0.4
              scale = 0.55
              zIndex = 10
              display = 'block'
            } else if (position === 'left1') {
              transformStyle = 'translate3d(-50%, 0, -200px) scale(0.75)'
              opacity = 0.7
              scale = 0.75
              zIndex = 20
              display = 'block'
            } else if (position === 'left2') {
              transformStyle = 'translate3d(-90%, 0, -350px) scale(0.55)'
              opacity = 0.4
              scale = 0.55
              zIndex = 10
              display = 'block'
            } else {
              display = 'none'
            }
            
            return (
              <div
                key={product.id}
                className="absolute transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  width: '70%',
                  maxWidth: '450px',
                  transform: transformStyle,
                  opacity: opacity,
                  zIndex: zIndex,
                  display: display,
                }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col" style={{ height: '100%', minHeight: '400px' }}>
                  <div className="relative w-full bg-gray-200 overflow-hidden" style={{ height: '280px', minHeight: '280px' }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-center"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                          const parent = (e.target as HTMLImageElement).parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Błąd wczytywania</div>'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400" style={{ height: '280px' }}>
                        <span>Brak zdjęcia</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center" style={{ minHeight: '120px' }}>
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary-dark mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="p-3 bg-primary-dark text-white rounded-full hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Poprzedni produkt"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="p-3 bg-primary-dark text-white rounded-full hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Następny produkt"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-64 sm:h-96 bg-gray-200">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                    const parent = (e.target as HTMLImageElement).parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Błąd wczytywania</div>'
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span>Brak zdjęcia</span>
                </div>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Zamknij"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-3xl sm:text-4xl font-semibold text-primary-dark mb-4">
                {selectedProduct.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

