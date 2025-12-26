export interface Product {
  id: string
  title: string
  description: string
  features: string[]
  image?: string
}

export interface SiteContent {
  hero: {
    title: string
    subtitle: string
  }
  about: {
    content: string
  }
  products: {
    title: string
    description: string
    features: string[]
  }
  applications: Array<{
    title: string
    description: string
  }>
  why: Array<{
    title: string
    description: string
  }>
  cooperation: {
    content: string
  }
  contact: {
    phone: string
    email: string
    address: string
    message: string
  }
  footer: {
    companyName: string
    description: string
  }
}

export const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Pasta BHP do mycia rąk',
    description: 'Skuteczna pasta BHP do zastosowań przemysłowych',
    features: [
      'Skuteczne usuwanie zabrudzeń przemysłowych',
      'Bezpieczna dla skóry',
      'Zastosowanie w przemyśle i warsztatach',
    ],
    image: '',
  },
]

export const defaultContent: SiteContent = {
  hero: {
    title: 'LiD-MAR – producent pasty BHP do mycia rąk',
    subtitle: 'Produkujemy skuteczne pasty BHP do zastosowań przemysłowych – dla zakładów pracy, warsztatów i firm produkcyjnych.',
  },
  about: {
    content: `LiD-MAR to polski producent specjalizujący się w wytwarzaniu pasty BHP do mycia rąk dla zastosowań przemysłowych.

Nasza działalność opiera się na trzech fundamentach: jakości, powtarzalności i doświadczeniu w produkcji przemysłowej. 
Skupiamy się na współpracy B2B, oferując produkty dostosowane do potrzeb zakładów produkcyjnych, warsztatów i firm przemysłowych.

Dzięki własnej produkcji i ścisłej kontroli jakości, zapewniamy naszym partnerom biznesowym niezawodne rozwiązania 
w zakresie higieny przemysłowej.`,
  },
  products: {
    title: 'Pasta BHP do mycia rąk',
    description: 'Skuteczna pasta BHP do zastosowań przemysłowych',
    features: [
      'Skuteczne usuwanie zabrudzeń przemysłowych',
      'Bezpieczna dla skóry',
      'Zastosowanie w przemyśle i warsztatach',
    ],
  },
  applications: [
    {
      title: 'zakłady produkcyjne',
      description: 'Nasze produkty znajdują zastosowanie w zakładach produkcyjnych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.',
    },
    {
      title: 'warsztaty mechaniczne',
      description: 'Nasze produkty znajdują zastosowanie w warsztatach mechanicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.',
    },
    {
      title: 'serwisy techniczne',
      description: 'Nasze produkty znajdują zastosowanie w serwisach technicznych, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.',
    },
    {
      title: 'przemysł ciężki i lekki',
      description: 'Nasze produkty znajdują zastosowanie w przemyśle ciężkim i lekkim, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.',
    },
  ],
  why: [
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
  ],
  cooperation: {
    content: `Oferujemy współpracę hurtową z firmami poszukującymi niezawodnego partnera w zakresie produktów BHP.

Specjalizujemy się w stałych dostawach dla zakładów produkcyjnych, warsztatów i dystrybutorów. 
Każdej firmie oferujemy indywidualne warunki współpracy dostosowane do potrzeb i skali działalności.

Skontaktuj się z nami, aby omówić szczegóły współpracy B2B.`,
  },
  contact: {
    phone: '[Numer telefonu]',
    email: '[Adres email]',
    address: '[Adres firmy]',
    message: 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.',
  },
  footer: {
    companyName: 'LiD-MAR',
    description: 'Producent pasty BHP do mycia rąk',
  },
}

export const getProducts = async (): Promise<Product[]> => {
  if (typeof window === 'undefined') return defaultProducts
  
  try {
    // Add cache busting to ensure fresh data
    const response = await fetch(`/api/products?t=${Date.now()}`, {
      cache: 'no-store',
    })
    if (response.ok) {
      const products = await response.json()
      // Remove _updatedAt before storing
      const productsWithoutMeta = products.map((p: any) => {
        const { _updatedAt, ...product } = p
        return product
      })
      // Cache in localStorage as fallback
      localStorage.setItem('products', JSON.stringify(productsWithoutMeta))
      return productsWithoutMeta
    }
  } catch (error) {
    console.error('Błąd podczas pobierania produktów z API:', error)
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('products')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Błąd podczas odczytywania produktów z localStorage:', error)
  }
  
  return defaultProducts
}

export const saveProducts = async (products: Product[]): Promise<void> => {
  if (typeof window === 'undefined') return
  
  // Save to localStorage first for immediate feedback
  try {
    localStorage.setItem('products', JSON.stringify(products))
  } catch (error) {
    console.error('Błąd podczas zapisywania produktów do localStorage:', error)
  }
  
  // Then sync with API
  try {
    // Delete all existing products and create new ones
    const existingResponse = await fetch('/api/products')
    if (existingResponse.ok) {
      const existing = await existingResponse.json()
      for (const product of existing) {
        await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      }
    }
    
    // Create new products
    for (const product of products) {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
    }
  } catch (error) {
    console.error('Błąd podczas zapisywania produktów do API:', error)
  }
}

export const getSiteContent = async (): Promise<SiteContent> => {
  if (typeof window === 'undefined') return defaultContent
  
  try {
    // Add cache busting to ensure fresh data
    const response = await fetch(`/api/content?t=${Date.now()}`, {
      cache: 'no-store',
    })
    if (response.ok) {
      const content = await response.json()
      // Remove _updatedAt before storing
      const { _updatedAt, ...contentWithoutMeta } = content
      // Cache in localStorage as fallback
      localStorage.setItem('siteContent', JSON.stringify(contentWithoutMeta))
      localStorage.setItem('siteContentUpdatedAt', _updatedAt || Date.now().toString())
      return contentWithoutMeta
    }
  } catch (error) {
    console.error('Błąd podczas pobierania treści z API:', error)
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('siteContent')
    if (stored) {
      const content = JSON.parse(stored)
      
      // Migracja: jeśli applications to tablica stringów, konwertuj na obiekty
      if (content.applications && Array.isArray(content.applications) && content.applications.length > 0) {
        if (typeof content.applications[0] === 'string') {
          content.applications = content.applications.map((app: string) => ({
            title: app,
            description: `Nasze produkty znajdują zastosowanie w ${app}, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.`,
          }))
        }
      }
      
      // Migracja: dodaj footer jeśli nie istnieje
      if (!content.footer) {
        content.footer = {
          companyName: 'LiD-MAR',
          description: 'Producent pasty BHP do mycia rąk',
        }
      }
      
      // Migracja: dodaj contact.message jeśli nie istnieje
      if (content.contact && !content.contact.message) {
        content.contact.message = 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.'
      }
      
      localStorage.setItem('siteContent', JSON.stringify(content))
      return content
    }
  } catch (error) {
    console.error('Błąd podczas odczytywania treści z localStorage:', error)
  }
  
  return defaultContent
}

export const saveSiteContent = async (content: SiteContent): Promise<void> => {
  if (typeof window === 'undefined') return
  
  // Save to localStorage first for immediate feedback
  try {
    localStorage.setItem('siteContent', JSON.stringify(content))
  } catch (error) {
    console.error('Błąd podczas zapisywania treści do localStorage:', error)
  }
  
  // Then sync with API
  try {
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
  } catch (error) {
    console.error('Błąd podczas zapisywania treści do API:', error)
  }
}

// Synchronous versions for backward compatibility (use localStorage only)
export const getSiteContentSync = (): SiteContent => {
  if (typeof window === 'undefined') return defaultContent
  try {
    const stored = localStorage.getItem('siteContent')
    if (!stored) {
      localStorage.setItem('siteContent', JSON.stringify(defaultContent))
      return defaultContent
    }
    const content = JSON.parse(stored)
    
    // Migracja: jeśli applications to tablica stringów, konwertuj na obiekty
    if (content.applications && Array.isArray(content.applications) && content.applications.length > 0) {
      if (typeof content.applications[0] === 'string') {
        content.applications = content.applications.map((app: string) => ({
          title: app,
          description: `Nasze produkty znajdują zastosowanie w ${app}, zapewniając skuteczne i bezpieczne rozwiązania do mycia rąk w środowisku przemysłowym.`,
        }))
      }
    }
    
    // Migracja: dodaj footer jeśli nie istnieje
    if (!content.footer) {
      content.footer = {
        companyName: 'LiD-MAR',
        description: 'Producent pasty BHP do mycia rąk',
      }
    }
    
    // Migracja: dodaj contact.message jeśli nie istnieje
    if (content.contact && !content.contact.message) {
      content.contact.message = 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.'
    }
    
    // Zapisz zaktualizowane dane
    localStorage.setItem('siteContent', JSON.stringify(content))
    
    return content
  } catch (error) {
    console.error('Błąd podczas odczytywania treści:', error)
    return defaultContent
  }
}

export const getProductsSync = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts
  try {
    const stored = localStorage.getItem('products')
    if (!stored) {
      localStorage.setItem('products', JSON.stringify(defaultProducts))
      return defaultProducts
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Błąd podczas odczytywania produktów:', error)
    return defaultProducts
  }
}


