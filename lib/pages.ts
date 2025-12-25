import sql from '@/lib/db'

/**
 * Page model type definition
 */
export interface Page {
  id: string
  title: string
  content: string
  ownerId: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Fetch a page by ID
 * Returns null if not found or database not configured
 */
export async function getPageById(id: string): Promise<Page | null> {
  if (!sql) {
    console.error('Database not configured')
    return null
  }

  try {
    const result = await sql`
      SELECT 
        id,
        title,
        content,
        owner_id,
        created_at,
        updated_at
      FROM pages
      WHERE id = ${parseInt(id)}
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return {
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      ownerId: row.owner_id.toString(),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

/**
 * Fetch all pages owned by a specific user
 */
export async function getPagesByOwner(ownerId: string): Promise<Page[]> {
  if (!sql) {
    console.error('Database not configured')
    return []
  }

  try {
    const result = await sql`
      SELECT 
        id,
        title,
        content,
        owner_id,
        created_at,
        updated_at
      FROM pages
      WHERE owner_id = ${parseInt(ownerId)}
      ORDER BY updated_at DESC
    `

    return result.map((row: any) => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      ownerId: row.owner_id.toString(),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }))
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

/**
 * Update a page
 * NOTE: This function does NOT check ownership - that must be done by the caller
 */
export async function updatePage(
  id: string,
  data: { title?: string; content?: string }
): Promise<boolean> {
  if (!sql) {
    console.error('Database not configured')
    return false
  }

  try {
    await sql`
      UPDATE pages
      SET
        title = COALESCE(${data.title}, title),
        content = COALESCE(${data.content}, content),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `
    return true
  } catch (error) {
    console.error('Error updating page:', error)
    return false
  }
}

/**
 * Check if a user is the owner of a page
 * CRITICAL: This function is used for authorization
 */
export async function isPageOwner(pageId: string, userId: string): Promise<boolean> {
  if (!sql) {
    return false
  }

  try {
    const result = await sql`
      SELECT 1 FROM pages
      WHERE id = ${parseInt(pageId)} AND owner_id = ${parseInt(userId)}
      LIMIT 1
    `
    return result.length > 0
  } catch (error) {
    console.error('Error checking page ownership:', error)
    return false
  }
}

/**
 * Create a new page
 * Returns the created page or null on error
 */
export async function createPage(
  ownerId: string,
  data: { title: string; content?: string }
): Promise<Page | null> {
  if (!sql) {
    console.error('Database not configured')
    return null
  }

  try {
    const result = await sql`
      INSERT INTO pages (title, content, owner_id)
      VALUES (${data.title}, ${data.content || ''}, ${parseInt(ownerId)})
      RETURNING id, title, content, owner_id, created_at, updated_at
    `

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return {
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      ownerId: row.owner_id.toString(),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }
  } catch (error) {
    console.error('Error creating page:', error)
    return null
  }
}

/**
 * Delete a page
 * NOTE: This function does NOT check ownership - that must be done by the caller
 */
export async function deletePage(id: string): Promise<boolean> {
  if (!sql) {
    console.error('Database not configured')
    return false
  }

  try {
    await sql`
      DELETE FROM pages
      WHERE id = ${parseInt(id)}
    `
    return true
  } catch (error) {
    console.error('Error deleting page:', error)
    return false
  }
}

