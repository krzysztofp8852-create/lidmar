'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSiteContent, saveSiteContent, type SiteContent } from '@/lib/data'

export default function ContentAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<SiteContent | null>(null)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      setContent(getSiteContent())
    } else {
      router.push('/admin/login')
    }
    setIsLoading(false)
  }, [router])

  const handleSave = () => {
    if (content) {
      saveSiteContent(content)
      alert('Treść została zapisana!')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>
  }

  if (!isAuthenticated || !content) return null

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
              <h1 className="text-2xl font-bold">Edytuj treść strony</h1>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-accent hover:bg-accent-dark rounded-lg transition-colors"
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 space-y-6">
        <ContentSection
          title="Sekcja Hero"
          content={content}
          onChange={setContent}
          fields={[
            { key: 'hero.title', label: 'Tytuł' },
            { key: 'hero.subtitle', label: 'Podtytuł' },
          ]}
        />

        <ContentSection
          title="O firmie"
          content={content}
          onChange={setContent}
          fields={[
            { key: 'about.content', label: 'Treść', type: 'textarea' },
          ]}
        />

        <ContentSection
          title="Współpraca"
          content={content}
          onChange={setContent}
          fields={[
            { key: 'cooperation.content', label: 'Treść', type: 'textarea' },
          ]}
        />

        <ContentSection
          title="Dane kontaktowe"
          content={content}
          onChange={setContent}
          fields={[
            { key: 'contact.phone', label: 'Telefon' },
            { key: 'contact.email', label: 'Email' },
            { key: 'contact.address', label: 'Adres' },
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-dark mb-4">Zastosowania</h3>
          <div className="space-y-2">
            {content.applications.map((app, index) => (
              <input
                key={index}
                type="text"
                value={app}
                onChange={(e) => {
                  const newApps = [...content.applications]
                  newApps[index] = e.target.value
                  setContent({ ...content, applications: newApps })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ))}
            <button
              type="button"
              onClick={() => setContent({ ...content, applications: [...content.applications, ''] })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              + Dodaj zastosowanie
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-dark mb-4">Dlaczego LiD-MAR</h3>
          <div className="space-y-4">
            {content.why.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newWhy = [...content.why]
                    newWhy[index] = { ...newWhy[index], title: e.target.value }
                    setContent({ ...content, why: newWhy })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Tytuł"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newWhy = [...content.why]
                    newWhy[index] = { ...newWhy[index], description: e.target.value }
                    setContent({ ...content, why: newWhy })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={2}
                  placeholder="Opis"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentSection({ title, content, onChange, fields }: { title: string; content: SiteContent; onChange: (c: SiteContent) => void; fields: Array<{ key: string; label: string; type?: string }> }) {
  const updateField = (key: string, value: string) => {
    const keys = key.split('.')
    const newContent = { ...content } as any
    let current = newContent
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    onChange(newContent)
  }

  const getFieldValue = (key: string) => {
    const keys = key.split('.')
    let current = content as any
    for (const k of keys) {
      current = current[k]
    }
    return current
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-primary-dark mb-4">{title}</h3>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={getFieldValue(field.key)}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={6}
              />
            ) : (
              <input
                type="text"
                value={getFieldValue(field.key)}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

