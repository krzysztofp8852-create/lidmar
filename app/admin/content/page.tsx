'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getSiteContentSync, getSiteContent, saveSiteContent, type SiteContent } from '@/lib/data'

export default function ContentAdmin() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }
    
    if (status === 'authenticated') {
      // Load from localStorage immediately (sync)
      setContent(getSiteContentSync())
      
      // Sync with API in background
      getSiteContent().then(apiContent => {
        setContent(apiContent)
      }).catch(console.error)
    }
  }, [status, router])

  const handleSave = async () => {
    if (content) {
      setIsSaving(true)
      try {
        await saveSiteContent(content)
        alert('Treść została zapisana!')
      } catch (error) {
        console.error('Błąd podczas zapisywania:', error)
        alert('Wystąpił błąd podczas zapisywania. Spróbuj ponownie.')
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>
  }

  if (status === 'unauthenticated' || !content) return null

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
              <h1 className="text-2xl font-bold">Edytuj treść strony</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
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
          <div className="space-y-4">
            {content.applications.map((app, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nazwa zastosowania</label>
                <input
                  type="text"
                  value={typeof app === 'string' ? app : (app.title || '')}
                  onChange={(e) => {
                    const newApps = [...content.applications]
                    if (typeof newApps[index] === 'string') {
                      newApps[index] = { title: e.target.value, description: '' }
                    } else {
                      newApps[index] = { ...newApps[index], title: e.target.value }
                    }
                    setContent({ ...content, applications: newApps })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Nazwa zastosowania"
                />
                <label className="block text-sm font-semibold text-gray-900 mb-2">Opis zastosowania</label>
                <textarea
                  value={typeof app === 'string' ? '' : (app.description || '')}
                  onChange={(e) => {
                    const newApps = [...content.applications]
                    if (typeof newApps[index] === 'string') {
                      newApps[index] = { title: newApps[index] as string, description: e.target.value }
                    } else {
                      newApps[index] = { ...newApps[index], description: e.target.value }
                    }
                    setContent({ ...content, applications: newApps })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                  placeholder="Opis zastosowania"
                />
              </div>
            ))}
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

        {/* Przycisk Zapisz na dole strony */}
        <div className="flex justify-center pt-6 pb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-4 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
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
