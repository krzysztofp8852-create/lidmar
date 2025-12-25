import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

/**
 * Admin Panel - Server Component with authentication check
 * Only authenticated users can access this page
 */
export default async function AdminPanel() {
  // === AUTHENTICATION CHECK ===
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-dark text-white shadow">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Panel Administratora - LiD-MAR</h1>
              <p className="text-sm text-gray-300">
                Zalogowany jako: {session.user.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary-dark mb-4">
            Witaj, {session.user.name || session.user.email}
          </h2>
          <p className="text-gray-700">
            Tutaj możesz zarządzać produktami i treścią strony.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Produkty
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Zarządzaj produktami i ich opisami
            </p>
            <Link 
              href="/admin/products"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Edytuj produkty
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Treść strony
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Edytuj treść sekcji strony (Hero, O firmie, Kontakt, itp.)
            </p>
            <Link 
              href="/admin/content"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Edytuj treść
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
