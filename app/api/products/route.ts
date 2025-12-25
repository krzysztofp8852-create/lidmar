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

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const db = ensureDb()
    const { searchParams } = new URL(request.url)
    const checkTimestamp = searchParams.get('checkTimestamp') === 'true'
    
    // If only checking timestamp, return minimal data
    if (checkTimestamp) {
      const result = await db`
        SELECT MAX(updated_at) as last_updated, COUNT(*) as count
        FROM products
      `
      
      return NextResponse.json({
        _updatedAt: result[0].last_updated ? new Date(result[0].last_updated).toISOString() : undefined,
        _count: result[0].count || 0,
      }, {
        headers: {
          'Cache-Control': 'private, max-age=1',
        },
      })
    }
    
    const products = await db`
      SELECT id, title, description, features, image, updated_at
      FROM products 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json(products.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      description: p.description,
      features: p.features || [],
      image: p.image || '',
      _updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
    })), {
      headers: {
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const db = ensureDb()
    const product: Product = await request.json()
    
    const result = await db`
      INSERT INTO products (title, description, features, image)
      VALUES (${product.title}, ${product.description}, ${JSON.stringify(product.features)}::jsonb, ${product.image || ''})
      RETURNING id
    `
    
    return NextResponse.json({
      ...product,
      id: result[0].id.toString(),
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
