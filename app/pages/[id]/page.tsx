import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { getPageById } from '@/lib/pages'

interface PageViewProps {
  params: { id: string }
}

/**
 * Public Page View - Server Component
 * 
 * Shows the page content publicly.
 * Shows "Edit" button ONLY if the logged-in user is the owner.
 */
export default async function PageView({ params }: PageViewProps) {
  // Get session (may be null if not logged in)
  const session = await getServerSession(authOptions)

  // Fetch page data
  const page = await getPageById(params.id)

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Strona nie została znaleziona.</p>
        </div>
      </div>
    )
  }

  // Check if logged-in user is the owner
  const isOwner = session?.user?.id === page.ownerId

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with edit button for owner */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Strona główna
            </Link>
            
            {/* SHOW EDIT BUTTON ONLY IF USER IS THE OWNER */}
            {isOwner && (
              <Link
                href={`/pages/${page.id}/edit`}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Edytuj stronę
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="container-custom py-8">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
            {page.content || <span className="text-gray-400 italic">Brak treści</span>}
          </div>
          
          {page.updatedAt && (
            <p className="mt-8 text-sm text-gray-400">
              Ostatnia aktualizacja: {new Date(page.updatedAt).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </article>
      </main>
    </div>
  )
}

