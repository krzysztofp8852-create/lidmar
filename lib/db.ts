import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Database features will not work.')
}

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export default sql
