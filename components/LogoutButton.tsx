'use client'

import { signOut } from 'next-auth/react'

/**
 * Logout Button - Client Component
 * Uses NextAuth signOut for secure logout
 */
export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
    >
      Wyloguj się
    </button>
  )
}

