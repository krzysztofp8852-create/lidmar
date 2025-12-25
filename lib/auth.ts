import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import sql from '@/lib/db'

/**
 * NextAuth configuration with Credentials provider
 * Uses database for user authentication
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Hasło', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[Auth] Attempting login for:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Missing email or password')
          return null
        }

        if (!sql) {
          console.error('[Auth] Database not configured - check DATABASE_URL')
          return null
        }

        try {
          // Find user by email
          console.log('[Auth] Looking up user in database...')
          const result = await sql`
            SELECT id, email, password_hash, name, role
            FROM users
            WHERE email = ${credentials.email}
            LIMIT 1
          `

          if (result.length === 0) {
            console.log('[Auth] User not found:', credentials.email)
            return null
          }

          const user = result[0]
          console.log('[Auth] User found:', user.email, 'ID:', user.id)

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password_hash)
          console.log('[Auth] Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('[Auth] Invalid password for user:', credentials.email)
            return null
          }

          console.log('[Auth] Login successful for:', credentials.email)
          // Return user object (will be available in session)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error: any) {
          console.error('[Auth] Error:', error?.message || error)
          // Check if users table doesn't exist
          if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
            console.error('[Auth] Users table does not exist! Run migrations-auth.sql')
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Add user.id to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Add user.id to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

