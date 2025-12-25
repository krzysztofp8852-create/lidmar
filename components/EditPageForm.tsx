'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface EditPageFormProps {
  pageId: string
  initialTitle: string
  initialContent: string
}

/**
 * Edit Page Form - Client Component
 * 
 * Handles the form UI and submission.
 * NOTE: Actual authorization is checked on the server (API route).
 * This is just a form - security is enforced server-side.
 */
export default function EditPageForm({
  pageId,
  initialTitle,
  initialContent,
}: EditPageFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) {
        const data = await response.json()
        
        if (response.status === 401) {
          // Not authenticated - redirect to login
          router.push('/admin/login')
          return
        }
        
        if (response.status === 403) {
          // Not authorized (not owner)
          setError('Brak uprawnień do edycji tej strony.')
          return
        }
        
        setError(data.error || 'Wystąpił błąd podczas zapisywania.')
        return
      }

      setSuccess(true)
      
      // Optionally refresh the page data
      router.refresh()
    } catch (err) {
      console.error('Error saving page:', err)
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tytuł
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
          placeholder="Wpisz tytuł strony..."
          required
        />
      </div>

      {/* Content field */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Treść
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow resize-y"
          placeholder="Wpisz treść strony..."
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Strona została zapisana!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <a
          href={`/pages/${pageId}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Wróć do strony
        </a>
        
        <button
          type="submit"
          disabled={isSaving}
          className={`
            px-6 py-2 text-white font-medium rounded-lg transition-colors
            ${isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
            }
          `}
        >
          {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </div>
    </form>
  )
}

