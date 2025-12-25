import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPageById, updatePage, isPageOwner } from '@/lib/pages'

/**
 * GET /api/pages/[id]
 * Public endpoint - returns page data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await getPageById(params.id)

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/pages/[id]
 * Protected endpoint - updates page data
 * 
 * SECURITY FLOW:
 * 1. Check authentication (session exists)
 * 2. Verify ownership (page.ownerId === session.user.id)
 * 3. Only then update the page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // === AUTHORIZATION CHECK 1: Authentication ===
    // CRITICAL: Validate session on the server
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      // Not authenticated
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // === AUTHORIZATION CHECK 2: Ownership ===
    // CRITICAL: Never trust client-side ownership checks
    // Always verify ownership on the server
    const page = await getPageById(params.id)

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check if the authenticated user is the owner of this page
    if (page.ownerId !== session.user.id) {
      // User is not the owner - forbidden
      console.warn(
        `Unauthorized edit attempt: user ${session.user.id} tried to edit page ${params.id} owned by ${page.ownerId}`
      )
      return NextResponse.json(
        { error: 'You do not have permission to edit this page' },
        { status: 403 }
      )
    }

    // === USER IS AUTHORIZED - PROCEED WITH UPDATE ===
    const body = await request.json()
    const { title, content } = body

    // Validate input
    if (typeof title !== 'string' && typeof content !== 'string') {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update the page
    const success = await updatePage(params.id, {
      title: typeof title === 'string' ? title : undefined,
      content: typeof content === 'string' ? content : undefined,
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update page' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

