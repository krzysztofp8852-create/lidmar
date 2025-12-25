'use client'

import { useEffect, useState } from 'react'

export default function LoadingSpinner() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ukryj spinner po załadowaniu strony
    const handleLoad = () => {
      setIsLoading(false)
    }

    // Sprawdź czy strona jest już załadowana
    if (document.readyState === 'complete') {
      // Małe opóźnienie dla płynniejszego przejścia
      setTimeout(() => setIsLoading(false), 300)
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

