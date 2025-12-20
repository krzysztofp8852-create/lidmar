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
  applications: string[]
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
  }
}

const defaultProducts: Product[] = [
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

const defaultContent: SiteContent = {
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
    'zakłady produkcyjne',
    'warsztaty mechaniczne',
    'serwisy techniczne',
    'przemysł ciężki i lekki',
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
  },
}

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts
  const stored = localStorage.getItem('products')
  if (!stored) {
    localStorage.setItem('products', JSON.stringify(defaultProducts))
    return defaultProducts
  }
  return JSON.parse(stored)
}

export const saveProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('products', JSON.stringify(products))
}

export const getSiteContent = (): SiteContent => {
  if (typeof window === 'undefined') return defaultContent
  const stored = localStorage.getItem('siteContent')
  if (!stored) {
    localStorage.setItem('siteContent', JSON.stringify(defaultContent))
    return defaultContent
  }
  return JSON.parse(stored)
}

export const saveSiteContent = (content: SiteContent): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('siteContent', JSON.stringify(content))
}

