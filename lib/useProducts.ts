'use client'

import { useEffect, useState } from 'react'
import { getProductsSync, defaultProducts, type Product } from '@/lib/data'

// Global cache for products
let productsCache: Product[] | null = null
let lastFetchTime = 0
let isFetching = false
const CACHE_DURATION = 10000 // 10 seconds
const FETCH_INTERVAL = 30000 // Check for updates every 30 seconds (less load on server)

export function useProducts() {
  // Initialize with defaultProducts for SSR compatibility
  const [products, setProducts] = useState<Product[]>(defaultProducts)

  useEffect(() => {
    // Load from localStorage or use defaults on mount
    const loadInitialProducts = () => {
      try {
        const stored = localStorage.getItem('products')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed)
            return parsed
          }
        }
      } catch (e) {
        console.warn('Failed to load products from localStorage:', e)
      }
      setProducts(defaultProducts)
      return defaultProducts
    }

    loadInitialProducts()

    // Sync with API
    const syncData = async () => {
      if (isFetching) return
      
      const now = Date.now()
      if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
        setProducts(productsCache)
        return
      }

      try {
        isFetching = true
        
        const response = await fetch(`/api/products?t=${now}`, {
          cache: 'no-store',
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Check if API returned an error
          if (data.error) {
            console.warn('API error, using fallback:', data.error)
            return
          }
          
          // Validate products array
          if (Array.isArray(data) && data.length > 0) {
            // Remove metadata
            const productsData = data.map((p: any) => {
              const { _updatedAt, ...product } = p
              return product
            })
            
            productsCache = productsData
            lastFetchTime = now
            localStorage.setItem('products', JSON.stringify(productsData))
            setProducts(productsData)
          }
        } else if (response.status === 404 || response.status === 503) {
          // Database not ready - use current products
          console.log('Database not ready, using fallback products')
        }
      } catch (error) {
        console.error('Error syncing products:', error)
      } finally {
        isFetching = false
      }
    }

    // Initial sync after a short delay
    const initialTimeout = setTimeout(syncData, 100)
    
    // Poll for updates only when page is visible
    let interval: NodeJS.Timeout | null = null
    
    const startPolling = () => {
      if (!interval) {
        interval = setInterval(syncData, FETCH_INTERVAL)
      }
    }
    
    const stopPolling = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else {
        syncData() // Sync immediately when page becomes visible
        startPolling()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    startPolling()

    // Listen for storage events
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('products')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed)
          }
        }
      } catch (e) {
        console.warn('Error reading products storage:', e)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearTimeout(initialTimeout)
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return products
}
