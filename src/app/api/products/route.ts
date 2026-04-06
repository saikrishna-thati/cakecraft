import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const maxPrice = searchParams.get('maxPrice')
    const eggless = searchParams.get('eggless')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = { active: true }

    if (category && category !== 'All') {
      where.category = category
    }

    if (maxPrice) {
      where.price = { lte: parseInt(maxPrice) }
    }

    if (eggless === 'true') {
      where.eggless = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
