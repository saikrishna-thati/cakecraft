import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, customerEmail, address, city, pincode, deliveryDate, deliveryTime, paymentMethod, items, notes } = body

    // Calculate total
    let totalAmount = 0
    for (const item of items) {
      let itemPrice = item.price
      if (item.extraCream) itemPrice += 100
      totalAmount += itemPrice * item.quantity
    }

    const order = await db.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        address,
        city,
        pincode,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        totalAmount,
        notes: notes || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number; eggless: boolean; extraCream: boolean; message?: string }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            eggless: item.eggless || false,
            extraCream: item.extraCream || false,
            message: item.message || null,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
