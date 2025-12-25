'use client'

import { useEffect, useState } from 'react'
import { getSiteContentSync, defaultContent, type SiteContent } from '@/lib/data'

// Global cache for site content to avoid duplicate requests
let siteContentCache: SiteContent | null = null
let lastFetchTime = 0
let isFetching = false
const CACHE_DURATION = 10000 // 10 seconds
const FETCH_INTERVAL = 30000 // Check for updates every 30 seconds (less load on server)

export function useSiteContent() {
  // Initialize with defaultContent for SSR compatibility
  const [content, setContent] = useState<SiteContent>(defaultContent)

  useEffect(() => {
    // Load from localStorage or use defaults on mount
    const loadInitialContent = () => {
      try {
        const stored = localStorage.getItem('siteContent')
        if (stored) {
          const parsed = JSON.parse(stored)
          // Validate that parsed content has required fields
          if (parsed && parsed.hero && parsed.about && parsed.contact) {
            setContent(parsed)
            return parsed
          }
        }
      } catch (e) {
        console.warn('Failed to load from localStorage:', e)
      }
      // If nothing in localStorage, use defaults
      setContent(defaultContent)
      return defaultContent
    }

    loadInitialContent()

    // Sync with API
    const syncData = async () => {
      if (isFetching) return
      
      const now = Date.now()
      if (siteContentCache && (now - lastFetchTime) < CACHE_DURATION) {
        setContent(siteContentCache)
        return
      }

      try {
        isFetching = true
        
        const response = await fetch(`/api/content?t=${now}`, {
          cache: 'no-store',
        })
        
        if (response.ok) {
          const data = await response.json()
          
          // Check if API returned an error
          if (data.error) {
            console.warn('API error, using fallback:', data.error)
            return
          }
          
          // Remove metadata and validate
          const { _updatedAt, ...contentData } = data
          
          // Validate content structure
          if (contentData.hero && contentData.about && contentData.contact) {
            siteContentCache = contentData
            lastFetchTime = now
            localStorage.setItem('siteContent', JSON.stringify(contentData))
            setContent(contentData)
          }
        } else if (response.status === 404 || response.status === 503) {
          // Database not ready - use current content (already set from localStorage or defaults)
          console.log('Database not ready, using fallback content')
        }
      } catch (error) {
        console.error('Error syncing content:', error)
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
        const stored = localStorage.getItem('siteContent')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && parsed.hero && parsed.about) {
            setContent(parsed)
          }
        }
      } catch (e) {
        console.warn('Error reading storage:', e)
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

  return content
}
