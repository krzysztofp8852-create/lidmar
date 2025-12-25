'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getProductsSync, getProducts, type Product } from '@/lib/data'

export default function ProductsAdmin() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }
    
    if (status === 'authenticated') {
      // Load products
      setProducts(getProductsSync())
      
      // Synchronize with API in background
      getProducts().then(apiProducts => {
        if (apiProducts.length > 0) {
          setProducts(apiProducts)
        }
      }).catch(console.error)
    }
  }, [status, router])

  const handleSave = async (product: Product) => {
    setIsSaving(true)
    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
        
        if (response.ok) {
          const updated = products.map(p => p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p)
          setProducts(updated)
          setEditingProduct(null)
          alert('Produkt został zaktualizowany!')
        } else {
          throw new Error('Failed to update')
        }
      } else {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
        
        if (response.ok) {
          const newProduct = await response.json()
          setProducts([...products, newProduct])
          setIsAdding(false)
          alert('Produkt został dodany!')
        } else {
          throw new Error('Failed to create')
        }
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania produktu:', error)
      alert('Wystąpił błąd podczas zapisywania produktu')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
        
        if (response.ok) {
          setProducts(products.filter(p => p.id !== id))
          alert('Produkt został usunięty!')
        } else {
          throw new Error('Failed to delete')
        }
      } catch (error) {
        console.error('Błąd podczas usuwania produktu:', error)
        alert('Wystąpił błąd podczas usuwania produktu')
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsAdding(false)
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-dark text-white shadow">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                ← Powrót
              </button>
              <h1 className="text-2xl font-bold">Zarządzanie produktami</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary-dark">Lista produktów</h2>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingProduct(null)
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            + Dodaj produkt
          </button>
        </div>

        {(isAdding || editingProduct) && (
          <ProductForm
            product={editingProduct || { id: '', title: '', description: '', features: [], image: '' }}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false)
              setEditingProduct(null)
            }}
            isSaving={isSaving}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {product.image && (
                <div className="relative w-full h-48 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-dark mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductForm({ product, onSave, onCancel, isSaving }: { 
  product: Product
  onSave: (p: Product) => void
  onCancel: () => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState(product)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null)

  useEffect(() => {
    setFormData(product)
    setImagePreview(product.image || null)
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Proszę wypełnić wszystkie wymagane pola')
      return
    }
    onSave({
      ...formData,
      features: [],
    })
  }

  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Nie można utworzyć kontekstu canvas'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          resolve(compressedBase64)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Proszę wybrać plik obrazu')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Plik jest zbyt duży. Maksymalny rozmiar to 5MB')
        return
      }

      try {
        const compressedBase64 = await compressImage(file)
        setFormData({ ...formData, image: compressedBase64 })
        setImagePreview(compressedBase64)
      } catch (error) {
        console.error('Błąd podczas kompresji obrazu:', error)
        alert('Błąd podczas przetwarzania obrazu')
      }
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url })
    setImagePreview(url)
  }

  const removeImage = () => {
    setFormData({ ...formData, image: '' })
    setImagePreview(null)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-primary-dark mb-4">
        {product.id ? 'Edytuj produkt' : 'Nowy produkt'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Tytuł</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Opis</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Zdjęcie produktu</label>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Prześlij zdjęcie z komputera:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Maksymalny rozmiar: 5MB</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Lub wprowadź URL zdjęcia:</label>
              <input
                type="url"
                value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image.jpg lub /image.png"
              />
            </div>

            {imagePreview && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Podgląd:</p>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Usuń zdjęcie
                  </button>
                </div>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Podgląd"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">Błąd wczytywania obrazu</div>'
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Anuluj
          </button>
        </div>
      </div>
    </form>
  )
}
