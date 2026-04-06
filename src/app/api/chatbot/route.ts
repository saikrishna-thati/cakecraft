import ZAI from 'z-ai-web-dev-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful bakery assistant for CakeCraft, an Indian bakery based in India. Help users find cakes, suggest options based on budget, answer questions about eggless options, delivery, pricing, and customization. Keep responses concise and friendly (under 3 sentences when possible). Products are priced ₹150-₹2500. We deliver across India. Payment via UPI/Card or Cash on Delivery. We offer Birthday, Anniversary, Custom, Eggless, Brownies, Breads, Desserts, Cupcakes, and Cookies categories. Popular items: Chocolate Birthday Cake (₹850), Black Forest Gateau (₹900), Gulab Jamun (₹250), Chocolate Brownies (₹350). Use emojis occasionally to be friendly. Always mention prices in ₹.`
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that. Could you try again?"

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ reply: "I'm having trouble right now. Please try again or call us at +91 98765 43210 for immediate help! 🙏" })
  }
}
