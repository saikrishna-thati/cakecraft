import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order } = body

    const itemLines = order.items.map(
      (item: { name: string; quantity: number; price: number; eggless?: boolean; extraCream?: boolean; message?: string }, idx: number) =>
        `${idx + 1}. ${item.name} x${item.quantity} - ₹${item.price}${item.eggless ? ' 🌱Eggless' : ''}${item.extraCream ? ' 🧁Extra Cream' : ''}${item.message ? ` ✉️"${item.message}"` : ''}`
    ).join('\n')

    const message = `🧁 *New Order - CakeCraft*
━━━━━━━━━━━━━━━
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}${order.customerEmail ? `\n📧 *Email:* ${order.customerEmail}` : ''}
📍 *Address:* ${order.address}, ${order.city} - ${order.pincode}
📅 *Delivery:* ${order.deliveryDate} at ${order.deliveryTime}
💳 *Payment:* ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Paid'}

📝 *Order Items:*
${itemLines}

💰 *Total: ₹${order.totalAmount}*
${order.notes ? `\n💬 *Notes:* ${order.notes}` : ''}

━━━━━━━━━━━━━━━
📋 *Order ID:* ${order.id}`

    const encoded = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`

    return NextResponse.json({ url: whatsappUrl, message })
  } catch (error) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ error: 'Failed to generate WhatsApp link' }, { status: 500 })
  }
}
