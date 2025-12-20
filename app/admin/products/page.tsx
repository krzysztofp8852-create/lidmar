'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProducts, saveProducts, type Product } from '@/lib/data'

export default function ProductsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      setProducts(getProducts())
    } else {
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  const handleSave = (product: Product) => {
    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? product : p)
      setProducts(updated)
      saveProducts(updated)
      setEditingProduct(null)
    } else {
      const newProduct = { ...product, id: Date.now().toString() }
      const updated = [...products, newProduct]
      setProducts(updated)
      saveProducts(updated)
      setIsAdding(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      saveProducts(updated)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsAdding(false)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-dark text-white shadow">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-primary hover:bg-primary-light rounded-lg transition-colors"
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
            className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
          >
            + Dodaj produkt
          </button>
        </div>

        {(isAdding || editingProduct) && (
          <ProductForm
            product={editingProduct || { id: '', title: '', description: '', features: [''], image: '' }}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false)
              setEditingProduct(null)
            }}
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
                    className="px-4 py-2 bg-primary-dark text-white rounded hover:bg-primary transition-colors text-sm"
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

function ProductForm({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(product)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null)

  useEffect(() => {
    setFormData(product)
    setImagePreview(product.image || null)
  }, [product])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Proszę wybrać plik obrazu')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Plik jest zbyt duży. Maksymalny rozmiar to 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, image: base64String })
        setImagePreview(base64String)
      }
      reader.onerror = () => {
        alert('Błąd podczas wczytywania pliku')
      }
      reader.readAsDataURL(file)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
    })
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
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
            {/* Upload from computer */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Prześlij zdjęcie z komputera:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark file:cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Maksymalny rozmiar: 5MB</p>
            </div>

            {/* Or enter URL */}
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

            {/* Preview */}
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
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Cechy produktu</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Cecha produktu"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            + Dodaj cechę
          </button>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
          >
            Zapisz
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

