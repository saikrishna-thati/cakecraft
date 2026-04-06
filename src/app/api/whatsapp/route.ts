import { NextRequest, NextResponse } from 'next/server'

// This endpoint sends WhatsApp notification to OWNER when order is placed
// For production, integrate with:
// - Twilio WhatsApp API
// - WhatsApp Cloud API
// - Third-party services (MessageBird, Vonage, WATI, etc.)

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

    // OPTION 1: Using Twilio WhatsApp API (Recommended for production)
    // Uncomment and add your Twilio credentials to .env
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER // e.g., 'whatsapp:+14155238886'
    const ownerWhatsAppNumber = process.env.OWNER_WHATSAPP_NUMBER // e.g., 'whatsapp:+918886633523'

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioWhatsAppNumber,
        To: ownerWhatsAppNumber,
        Body: message,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message via Twilio')
    }
    */

    // OPTION 2: Using WhatsApp Cloud API (Free but requires Meta Business verification)
    // Uncomment and add your credentials to .env
    /*
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const ownerPhone = process.env.OWNER_PHONE_NUMBER // e.g., '918886633523' (without +)

    const whatsappUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`
    
    const response = await fetch(whatsappUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: ownerPhone,
        type: 'text',
        text: { body: message },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message via Cloud API')
    }
    */

    // OPTION 3: Using third-party service (WATI, MessageBird, etc.)
    // Example with generic webhook
    /*
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '918886633523',
        message: message,
      }),
    })
    */

    // TEMPORARY SOLUTION: Generate WhatsApp link for manual sending
    // This opens WhatsApp for the customer to send to owner
    // Replace this with one of the above options for automatic sending
    const encoded = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918886633523?text=${encoded}`

    console.log('📱 WhatsApp notification prepared for order:', order.id)
    console.log('Message:', message)

    return NextResponse.json({ 
      success: true,
      url: whatsappUrl, 
      message,
      note: 'Using manual WhatsApp link. For automatic sending, configure Twilio or WhatsApp Cloud API in environment variables.'
    })
  } catch (error) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate WhatsApp notification' 
    }, { status: 500 })
  }
}

