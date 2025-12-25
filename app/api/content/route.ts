import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import type { SiteContent } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const checkTimestamp = searchParams.get('checkTimestamp') === 'true'
    
    // If only checking timestamp, return minimal data (optimized query)
    if (checkTimestamp) {
      const result = await sql`
        SELECT updated_at FROM site_content WHERE id = 1 LIMIT 1
      `
      
      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Site content not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        _updatedAt: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : undefined,
      }, {
        headers: {
          'Cache-Control': 'private, max-age=1',
        },
      })
    }
    
    const result = await sql`
      SELECT * FROM site_content WHERE id = 1
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      )
    }
    
    const row = result[0]
    
    const content: SiteContent & { _updatedAt?: string } = {
      hero: {
        title: row.hero_title,
        subtitle: row.hero_subtitle,
      },
      about: {
        content: row.about_content,
      },
      products: {
        title: row.products_title,
        description: row.products_description,
        features: row.products_features || [],
      },
      applications: row.applications || [],
      why: row.why_items || [],
      cooperation: {
        content: row.cooperation_content,
      },
      contact: {
        phone: row.contact_phone,
        email: row.contact_email,
        address: row.contact_address,
        message: row.contact_message || 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.',
      },
      footer: {
        companyName: row.footer_company_name || 'LiD-MAR',
        description: row.footer_description || 'Producent pasty BHP do mycia rąk',
      },
      _updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    }
    
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=30', // Cache for 10 seconds, revalidate in background
      },
    })
  } catch (error: any) {
    console.error('Error fetching site content:', error)
    
    // Check if it's a table not found error
    const errorMessage = error?.message || 'Unknown error'
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database tables not initialized. Run migrations from lib/migrations.sql' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch site content', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const content: SiteContent = await request.json()
    
    await sql`
      UPDATE site_content 
      SET 
        hero_title = ${content.hero.title},
        hero_subtitle = ${content.hero.subtitle},
        about_content = ${content.about.content},
        products_title = ${content.products.title},
        products_description = ${content.products.description},
        products_features = ${JSON.stringify(content.products.features)}::jsonb,
        applications = ${JSON.stringify(content.applications)}::jsonb,
        why_items = ${JSON.stringify(content.why)}::jsonb,
        cooperation_content = ${content.cooperation.content},
        contact_phone = ${content.contact.phone},
        contact_email = ${content.contact.email},
        contact_address = ${content.contact.address},
        contact_message = ${content.contact.message || 'Zapraszamy do kontaktu w sprawie współpracy B2B, wyceny zamówień hurtowych oraz indywidualnych warunków współpracy.'},
        footer_company_name = ${content.footer?.companyName || 'LiD-MAR'},
        footer_description = ${content.footer?.description || 'Producent pasty BHP do mycia rąk'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating site content:', error)
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    )
  }
}
