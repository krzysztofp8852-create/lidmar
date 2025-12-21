'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Ładowanie...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-dark text-white shadow">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Panel Administratora - LiD-MAR</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-accent hover:bg-accent-dark rounded-lg transition-colors duration-200"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary-dark mb-4">
            Witaj w panelu administratora
          </h2>
          <p className="text-gray-700">
            Tutaj możesz zarządzać produktami i ustawieniami.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Produkty
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Zarządzaj produktami i ich opisami
            </p>
            <button 
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 bg-primary-dark text-white rounded hover:bg-primary transition-colors"
            >
              Edytuj produkty
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

