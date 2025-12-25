import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import type { Product } from '@/lib/data'

// Type guard for sql
const ensureDb = () => {
  if (!sql) {
    throw new Error('Database not configured')
  }
  return sql
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const db = ensureDb()
    const product: Product = await request.json()
    
    await db`
      UPDATE products 
      SET 
        title = ${product.title},
        description = ${product.description},
        features = ${JSON.stringify(product.features)}::jsonb,
        image = ${product.image || ''},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(params.id)}
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const db = ensureDb()
    await db`
      DELETE FROM products 
      WHERE id = ${parseInt(params.id)}
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
