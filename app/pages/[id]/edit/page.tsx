import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getPageById } from '@/lib/pages'
import EditPageForm from '@/components/EditPageForm'

interface EditPageProps {
  params: { id: string }
}

/**
 * Edit Page - Server Component with server-side authorization
 * 
 * SECURITY FLOW:
 * 1. Check if user is authenticated (redirect to login if not)
 * 2. Fetch the page from database
 * 3. Verify ownership (page.ownerId === session.user.id)
 * 4. If not owner, return 403 Forbidden
 * 5. If owner, render the edit form
 */
export default async function EditPage({ params }: EditPageProps) {
  // === AUTHORIZATION CHECK 1: Authentication ===
  // Get session on the server side
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    // User not authenticated - redirect to login
    redirect('/admin/login')
  }

  // === FETCH PAGE DATA ===
  const page = await getPageById(params.id)

  if (!page) {
    // Page not found
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Strona nie została znaleziona.</p>
        </div>
      </div>
    )
  }

  // === AUTHORIZATION CHECK 2: Ownership ===
  // CRITICAL: Only the owner can edit the page
  if (page.ownerId !== session.user.id) {
    // User is not the owner - forbidden
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <p className="text-gray-600 mb-4">Brak uprawnień do edycji tej strony.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Wróć do strony głównej
          </a>
        </div>
      </div>
    )
  }

  // === USER IS AUTHORIZED - RENDER EDIT FORM ===
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edytuj stronę
            </h1>
            <p className="text-sm text-gray-500">
              ID strony: {page.id}
            </p>
          </div>
          
          {/* Client component for the form */}
          <EditPageForm
            pageId={page.id}
            initialTitle={page.title}
            initialContent={page.content}
          />
        </div>
      </div>
    </div>
  )
}

