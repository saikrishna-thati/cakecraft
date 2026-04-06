import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = await db.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: parseInt(body.price),
        category: body.category,
        image: body.image || '/products/default.png',
        eggless: body.eggless || false,
        bestseller: body.bestseller || false,
        weight: body.weight || '1kg',
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
