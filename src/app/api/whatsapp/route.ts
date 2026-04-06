import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order } = body

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioWhatsAppNumber = 'whatsapp:+14155238886'
    const ownerWhatsAppNumber = 'whatsapp:+918886633523'

    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured')
      return NextResponse.json({ success: false, error: 'WhatsApp not configured' }, { status: 500 })
    }

    // Format items for message
    const itemsList = order.items.map((item: any, idx: number) => 
      `${idx + 1}. ${item.name} x${item.quantity} - ₹${item.price}${item.eggless ? ' 🌱' : ''}${item.extraCream ? ' 🧁' : ''}`
    ).join('\n')

    // Professional WhatsApp message
    const message = `🎂 *NEW ORDER RECEIVED*

━━━━━━━━━━━━━━━━━━━━
📋 *Order #${order.id.slice(-8).toUpperCase()}*

👤 *Customer Details*
Name: ${order.customerName}
Phone: ${order.customerPhone}
${order.customerEmail ? `Email: ${order.customerEmail}\n` : ''}
📍 *Delivery Address*
${order.address}
${order.city} - ${order.pincode}

📅 *Delivery Schedule*
Date: ${order.deliveryDate}
Time: ${order.deliveryTime}

🛍️ *Order Items*
${itemsList}

💰 *Payment*
Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery 💵' : 'Online Payment ✅'}
Total: ₹${order.totalAmount}
${order.notes ? `\n💬 *Special Notes*\n${order.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
🧁 *CakeCraft Bakery*`

    // Send via Twilio
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

    const data = await response.json()

    if (!response.ok) {
      console.error('Twilio error:', data)
      throw new Error('Failed to send WhatsApp message')
    }

    console.log('✅ WhatsApp sent successfully:', data.sid)

    return NextResponse.json({ 
      success: true,
      messageSid: data.sid,
      message: 'WhatsApp notification sent to owner'
    })
  } catch (error) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send WhatsApp notification' 
    }, { status: 500 })
  }
}

