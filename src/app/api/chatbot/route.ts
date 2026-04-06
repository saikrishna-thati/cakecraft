import { NextRequest, NextResponse } from 'next/server'

// Rule-based chatbot for CakeCraft
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const msg = message.toLowerCase().trim()

    let reply = ''

    // Greetings
    if (msg.match(/^(hi|hello|hey|hii|helo|namaste|good morning|good evening)/)) {
      reply = "Hi there! 👋 Welcome to CakeCraft! I'm here to help you find the perfect cake or bakery item. What are you looking for today? 🎂"
    }
    
    // Birthday cakes
    else if (msg.match(/birthday|bday|b'day/)) {
      reply = "Perfect! 🎉 Our birthday cakes are super popular! We have:\n• Chocolate Birthday Cake (₹850)\n• Vanilla Rose Cake (₹950)\n• Butterscotch Delight (₹750)\n• Pineapple Party Cake (₹650)\n• Red Velvet Dream (₹1100)\n\nAll available in 1kg. Want to see more details or add one to cart? 🎂"
    }
    
    // Anniversary cakes
    else if (msg.match(/anniversary|wedding/)) {
      reply = "Lovely! 💕 Our anniversary cakes are elegant and delicious:\n• Black Forest Gateau (₹900) - Classic favorite!\n• Fruit Overload Cake (₹1050)\n• Chocolate Truffle Royale (₹1400) - Premium choice\n\nAll come in 1.5kg. Which one catches your eye? 🎂"
    }
    
    // Eggless options
    else if (msg.match(/eggless|egg free|no egg|without egg|vegetarian/)) {
      reply = "Great choice! 🌱 We have amazing eggless options:\n• Eggless Vanilla Bliss (₹800)\n• Eggless Chocolate Fudge (₹900)\n• Eggless Pineapple Cake (₹700)\n• Plus most of our breads, cookies, and desserts!\n\nLook for the green leaf badge 🌿 on products. What would you like to try?"
    }
    
    // Chocolate
    else if (msg.match(/chocolate|choco|cocoa/)) {
      reply = "Chocolate lover! 🍫 You'll love these:\n• Chocolate Birthday Cake (₹850)\n• Chocolate Truffle Royale (₹1400)\n• Eggless Chocolate Fudge (₹900)\n• Chocolate Brownies (₹350 for 500g)\n\nAll made with premium Belgian chocolate! Which one tempts you? 😋"
    }
    
    // Brownies
    else if (msg.match(/brownie|brownies/)) {
      reply = "Yum! 🤤 Our brownies are super fudgy:\n• Classic Chocolate Brownies (₹350/500g) - Bestseller!\n• Walnut Brownies (₹400/500g)\n• Blondie Bars (₹300/500g)\n\nFresh baked daily! Want to add some to your cart? 🍫"
    }
    
    // Breads
    else if (msg.match(/bread|loaf|sourdough|focaccia/)) {
      reply = "Fresh breads! 🍞 We bake daily:\n• Sourdough Bread (₹250/500g) - Bestseller!\n• Garlic Focaccia (₹200/400g)\n• Multigrain Loaf (₹180/500g)\n\nAll artisan-style, no preservatives! Which one would you like? 🥖"
    }
    
    // Indian desserts
    else if (msg.match(/gulab jamun|rasmalai|indian sweet|mithai|dessert/)) {
      reply = "Traditional treats! 🪔 Our Indian desserts:\n• Gulab Jamun - 6 pcs (₹250)\n• Rasmalai - 6 pcs (₹300)\n\nMade fresh with authentic recipes! Want to order? 🍮"
    }
    
    // Cookies
    else if (msg.match(/cookie|cookies|biscuit/)) {
      reply = "Cookie time! 🍪 We have:\n• Cookie Gift Box (₹500/400g) - Assorted flavors!\n• Chocolate Chip Cookies (₹200/200g)\n• Nankhatai (₹150/200g) - Traditional Indian cookies\n\nPerfect for gifting or snacking! Which one? 😊"
    }
    
    // Cupcakes
    else if (msg.match(/cupcake|muffin/)) {
      reply = "Cute treats! 🧁 Check out:\n• Assorted Cupcakes - 6 pcs (₹450)\n• Blueberry Muffins - 4 pcs (₹280)\n\nPerfect for parties or gifts! Want to add them? 🎉"
    }
    
    // Price/Budget queries
    else if (msg.match(/price|cost|budget|cheap|expensive|affordable|how much/)) {
      if (msg.match(/under|below|less than|within/) && msg.match(/500|₹500/)) {
        reply = "Budget-friendly options under ₹500! 💰\n• Chocolate Brownies (₹350)\n• Blondie Bars (₹300)\n• Gulab Jamun (₹250)\n• Sourdough Bread (₹250)\n• Chocolate Chip Cookies (₹200)\n\nAll delicious and affordable! What would you like? 😊"
      } else if (msg.match(/under|below|less than|within/) && msg.match(/1000|₹1000/)) {
        reply = "Great options under ₹1000! 🎂\n• Pineapple Party Cake (₹650)\n• Butterscotch Delight (₹750)\n• Chocolate Birthday Cake (₹850)\n• Black Forest Gateau (₹900)\n\nPlus all our brownies, breads, and desserts! Which one interests you? 😊"
      } else {
        reply = "Our prices range from ₹150 to ₹2500! 💰\n• Budget: ₹150-₹500 (Breads, cookies, brownies)\n• Mid-range: ₹650-₹1100 (Most cakes)\n• Premium: ₹1200+ (Custom & specialty cakes)\n\nWhat's your budget? I can suggest the perfect item! 😊"
      }
    }
    
    // Delivery
    else if (msg.match(/deliver|delivery|shipping|ship|courier/)) {
      reply = "We deliver across India! 🚚\n• FREE delivery on orders above ₹499\n• ₹49 delivery fee for orders under ₹499\n• Same-day delivery for orders before 2 PM\n• Next-day delivery otherwise\n\nReady to place your order? 📦"
    }
    
    // Payment
    else if (msg.match(/payment|pay|cod|cash|card|upi|online/)) {
      reply = "We accept all payment methods! 💳\n• Cash on Delivery (COD)\n• UPI / PhonePe / GPay\n• Credit/Debit Cards\n• Net Banking\n\nSecure checkout guaranteed! Ready to order? 🛒"
    }
    
    // Custom cakes
    else if (msg.match(/custom|personalize|photo|design|special/)) {
      reply = "We love custom orders! 🎨\n• Photo Print Cake (₹1200)\n• Number Shape Cake (₹1000)\n• Tier Wedding Cake (₹2500)\n\nYou can add custom messages on any cake! Want to discuss your design? Call us at +91 88866 33523 📞"
    }
    
    // Contact/Help
    else if (msg.match(/contact|call|phone|whatsapp|help|support|talk|speak/)) {
      reply = "Happy to help! 📞\n• Call/WhatsApp: +91 88866 33523\n• Working Hours: 9 AM - 9 PM (All days)\n• Quick replies guaranteed!\n\nOr continue chatting with me here! What do you need help with? 😊"
    }
    
    // Order/Cart
    else if (msg.match(/order|buy|purchase|cart|checkout/)) {
      reply = "Awesome! 🛒 To place an order:\n1. Browse our products above\n2. Click on any item you like\n3. Add to cart\n4. Proceed to checkout\n\nNeed help choosing? Just ask me! What type of cake or item are you looking for? 🎂"
    }
    
    // Weight/Size
    else if (msg.match(/weight|size|kg|gram|how big|how large/)) {
      reply = "Our sizes! 📏\n• Cakes: 1kg, 1.5kg, 2kg, 3kg available\n• Brownies: 500g packs\n• Breads: 400-500g loaves\n• Desserts: 6-12 pieces\n\nMost cakes serve 8-10 people per kg. Need a specific size? Let me know! 🎂"
    }
    
    // Bestsellers
    else if (msg.match(/bestseller|best seller|popular|recommend|suggest|famous/)) {
      reply = "Our bestsellers! ⭐\n• Chocolate Birthday Cake (₹850)\n• Black Forest Gateau (₹900)\n• Red Velvet Dream (₹1100)\n• Chocolate Brownies (₹350)\n• Sourdough Bread (₹250)\n\nThese are customer favorites! Which one would you like to try? 😊"
    }
    
    // Thanks
    else if (msg.match(/thank|thanks|thx|appreciate/)) {
      reply = "You're very welcome! 😊 Is there anything else I can help you with? Feel free to browse our products above or ask me anything! 🎂"
    }
    
    // Default response
    else {
      reply = "I'd love to help! 😊 I can assist you with:\n• Birthday & Anniversary cakes 🎂\n• Eggless options 🌱\n• Brownies, breads & cookies 🍪\n• Prices & delivery info 💰\n• Custom orders 🎨\n\nWhat are you looking for today?"
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ 
      reply: "I'm having trouble right now. Please try again or call us at +91 88866 33523 for immediate help! 🙏" 
    })
  }
}
