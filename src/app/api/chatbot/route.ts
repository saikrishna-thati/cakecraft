import { NextRequest, NextResponse } from 'next/server'

// Enhanced rule-based chatbot for CakeCraft with fuzzy matching and better responses
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const msg = message.toLowerCase().trim()

    let reply = ''
    let quickActions: { label: string; action: string; productSlug?: string }[] = []

    // Helper function for fuzzy keyword matching
    const contains = (...keywords: string[]) => 
      keywords.some(kw => msg.includes(kw))

    // Greetings
    if (msg.match(/^(hi|hello|hey|hii|helo|namaste|good morning|good evening|sup|yo)/)) {
      reply = "Hi there! 👋 Welcome to CakeCraft! I'm here to help you find the perfect cake or bakery item. What are you looking for today? 🎂"
      quickActions = [
        { label: '🎂 Birthday Cakes', action: 'birthday' },
        { label: '💝 Anniversary Cakes', action: 'anniversary' },
        { label: '🌱 Eggless Options', action: 'eggless' },
        { label: '💰 Budget Options', action: 'budget' }
      ]
    }
    
    // Birthday cakes
    else if (contains('birthday', 'bday', "b'day", 'b day', 'bithday')) {
      reply = "Perfect! 🎉 Our birthday cakes are super popular! We have:\n\n• Chocolate Birthday Cake (₹850) ⭐ Bestseller\n• Vanilla Rose Cake (₹950) 🌱 Eggless\n• Butterscotch Delight (₹750) ⭐\n• Pineapple Party Cake (₹650) 🌱\n• Red Velvet Dream (₹1100) ⭐\n• Mango Passion Cake (₹1000)\n\nAll available in 1kg. Which one catches your eye? 🎂"
      quickActions = [
        { label: '🍫 View Chocolate Cake', action: 'view', productSlug: 'chocolate-birthday-cake' },
        { label: '❤️ View Red Velvet', action: 'view', productSlug: 'red-velvet-cake' },
        { label: '🌱 Show Eggless Only', action: 'eggless' }
      ]
    }
    
    // Anniversary cakes
    else if (contains('anniversary', 'wedding', 'marriage', 'aniversary')) {
      reply = "Lovely! 💕 Our anniversary cakes are elegant and delicious:\n\n• Black Forest Gateau (₹900) ⭐ Classic!\n• Fruit Overload Cake (₹1050) 🌱\n• Chocolate Truffle Royale (₹1400) ⭐ Premium\n• Strawberry Shortcake (₹1150)\n\nAll come in 1.5kg. Perfect for celebrations! Which one interests you? 🎂"
      quickActions = [
        { label: '🍒 View Black Forest', action: 'view', productSlug: 'black-forest-cake' },
        { label: '🍫 View Chocolate Truffle', action: 'view', productSlug: 'chocolate-truffle-cake' },
        { label: '🍓 View Strawberry', action: 'view', productSlug: 'strawberry-shortcake' }
      ]
    }
    
    // Eggless options
    else if (contains('eggless', 'egg free', 'no egg', 'without egg', 'vegetarian', 'veg', 'egless')) {
      reply = "Great choice! 🌱 We have amazing eggless options:\n\n• Eggless Vanilla Bliss (₹800) ⭐\n• Eggless Chocolate Fudge (₹900)\n• Eggless Pineapple Cake (₹700)\n• Plus: Vanilla Rose, Pineapple Party, Fruit Cake, and more!\n\nLook for the green leaf badge 🌿 on products. What would you like to try?"
      quickActions = [
        { label: '🌱 View All Eggless', action: 'category-eggless' },
        { label: '🍫 Eggless Chocolate', action: 'view', productSlug: 'eggless-chocolate-fudge' }
      ]
    }
    
    // Chocolate
    else if (contains('chocolate', 'choco', 'cocoa', 'choclate', 'chocolat')) {
      reply = "Chocolate lover! 🍫 You'll love these:\n\n• Chocolate Birthday Cake (₹850) ⭐\n• Chocolate Truffle Royale (₹1400) ⭐ Premium\n• Eggless Chocolate Fudge (₹900) 🌱\n• Chocolate Brownies (₹350/500g) ⭐\n\nAll made with premium Belgian chocolate! Which one tempts you? 😋"
      quickActions = [
        { label: '🎂 Birthday Chocolate', action: 'view', productSlug: 'chocolate-birthday-cake' },
        { label: '🍫 Chocolate Brownies', action: 'view', productSlug: 'chocolate-brownies' },
        { label: '🌱 Eggless Chocolate', action: 'view', productSlug: 'eggless-chocolate-fudge' }
      ]
    }
    
    // Brownies
    else if (contains('brownie', 'brownies', 'browny')) {
      reply = "Yum! 🤤 Our brownies are super fudgy:\n\n• Classic Chocolate Brownies (₹350/500g) ⭐ Bestseller!\n• Walnut Brownies (₹400/500g)\n• Blondie Bars (₹300/500g) 🌱\n\nFresh baked daily! Want to add some to your cart? 🍫"
      quickActions = [
        { label: '🍫 View Chocolate Brownies', action: 'view', productSlug: 'chocolate-brownies' },
        { label: '🥜 View Walnut Brownies', action: 'view', productSlug: 'walnut-brownies' }
      ]
    }
    
    // Breads
    else if (contains('bread', 'loaf', 'sourdough', 'focaccia', 'bred')) {
      reply = "Fresh breads! 🍞 We bake daily:\n\n• Sourdough Bread (₹250/500g) ⭐ Bestseller!\n• Garlic Focaccia (₹200/400g)\n• Multigrain Loaf (₹180/500g) 🌱\n\nAll artisan-style, no preservatives! Which one would you like? 🥖"
      quickActions = [
        { label: '🍞 View Sourdough', action: 'view', productSlug: 'sourdough-bread' },
        { label: '🧄 View Focaccia', action: 'view', productSlug: 'garlic-focaccia' }
      ]
    }
    
    // Indian desserts
    else if (contains('gulab jamun', 'rasmalai', 'indian sweet', 'mithai', 'dessert', 'sweet', 'gulam', 'rasmali')) {
      reply = "Traditional treats! 🪔 Our Indian desserts:\n\n• Gulab Jamun - 6 pcs (₹250) ⭐\n• Rasmalai - 6 pcs (₹300) ⭐\n\nMade fresh with authentic recipes! Want to order? 🍮"
      quickActions = [
        { label: '🍯 View Gulab Jamun', action: 'view', productSlug: 'gulab-jamun' },
        { label: '🥛 View Rasmalai', action: 'view', productSlug: 'rasmalai' }
      ]
    }
    
    // Cookies
    else if (contains('cookie', 'cookies', 'biscuit', 'cooky')) {
      reply = "Cookie time! 🍪 We have:\n\n• Cookie Gift Box (₹500/400g) ⭐ Assorted!\n• Chocolate Chip Cookies (₹200/200g)\n• Nankhatai (₹150/200g) 🌱 Traditional Indian\n\nPerfect for gifting or snacking! Which one? 😊"
      quickActions = [
        { label: '🎁 View Gift Box', action: 'view', productSlug: 'cookies-box' },
        { label: '🍪 View Choc Chip', action: 'view', productSlug: 'choc-chip-cookies' }
      ]
    }
    
    // Cupcakes
    else if (contains('cupcake', 'muffin', 'cup cake')) {
      reply = "Cute treats! 🧁 Check out:\n\n• Assorted Cupcakes - 6 pcs (₹450) ⭐\n• Blueberry Muffins - 4 pcs (₹280)\n\nPerfect for parties or gifts! Want to add them? 🎉"
      quickActions = [
        { label: '🧁 View Cupcakes', action: 'view', productSlug: 'cupcakes' },
        { label: '🫐 View Muffins', action: 'view', productSlug: 'blueberry-muffins' }
      ]
    }
    
    // Price/Budget queries
    else if (contains('price', 'cost', 'budget', 'cheap', 'expensive', 'affordable', 'how much', 'rate')) {
      if (msg.match(/under|below|less than|within|upto|up to/) && msg.match(/500|₹500|rs 500|rs500/)) {
        reply = "Budget-friendly options under ₹500! 💰\n\n• Chocolate Brownies (₹350)\n• Blondie Bars (₹300)\n• Rasmalai (₹300)\n• Gulab Jamun (₹250)\n• Sourdough Bread (₹250)\n• Chocolate Chip Cookies (₹200)\n\nAll delicious and affordable! What would you like? 😊"
        quickActions = [
          { label: '🍫 View Brownies', action: 'view', productSlug: 'chocolate-brownies' },
          { label: '🍞 View Sourdough', action: 'view', productSlug: 'sourdough-bread' }
        ]
      } else if (msg.match(/under|below|less than|within|upto|up to/) && msg.match(/1000|₹1000|rs 1000|rs1000/)) {
        reply = "Great options under ₹1000! 🎂\n\n• Pineapple Party Cake (₹650)\n• Butterscotch Delight (₹750)\n• Eggless Vanilla Bliss (₹800)\n• Chocolate Birthday Cake (₹850)\n• Black Forest Gateau (₹900)\n• Eggless Chocolate Fudge (₹900)\n\nPlus all our brownies, breads, and desserts! Which one interests you? 😊"
        quickActions = [
          { label: '🎂 View Birthday Cakes', action: 'birthday' },
          { label: '🌱 View Eggless', action: 'eggless' }
        ]
      } else {
        reply = "Our prices range from ₹150 to ₹2500! 💰\n\n• Budget: ₹150-₹500 (Breads, cookies, brownies)\n• Mid-range: ₹650-₹1100 (Most cakes)\n• Premium: ₹1200+ (Custom & specialty cakes)\n\nWhat's your budget? I can suggest the perfect item! 😊"
        quickActions = [
          { label: '💰 Under ₹500', action: 'budget-500' },
          { label: '🎂 Under ₹1000', action: 'budget-1000' }
        ]
      }
    }
    
    // Delivery
    else if (contains('deliver', 'delivery', 'shipping', 'ship', 'courier', 'send')) {
      reply = "We deliver across India! 🚚\n\n• FREE delivery on orders above ₹499\n• ₹49 delivery fee for orders under ₹499\n• Same-day delivery for orders before 2 PM\n• Next-day delivery otherwise\n\nReady to place your order? 📦"
      quickActions = [
        { label: '🛒 Browse Products', action: 'browse' },
        { label: '📞 Contact Us', action: 'contact' }
      ]
    }
    
    // Payment
    else if (contains('payment', 'pay', 'cod', 'cash', 'card', 'upi', 'online', 'paytm', 'phonepe', 'gpay')) {
      reply = "We accept all payment methods! 💳\n\n• Cash on Delivery (COD)\n• UPI / PhonePe / GPay / Paytm\n• Credit/Debit Cards\n• Net Banking\n\nSecure checkout guaranteed! Ready to order? 🛒"
      quickActions = [
        { label: '🛒 Start Shopping', action: 'browse' }
      ]
    }
    
    // Custom cakes
    else if (contains('custom', 'personalize', 'photo', 'design', 'special', 'customize')) {
      reply = "We love custom orders! 🎨\n\n• Photo Print Cake (₹1200)\n• Number Shape Cake (₹1000) 🌱\n• Tier Wedding Cake (₹2500)\n\nYou can add custom messages on any cake! Want to discuss your design? Call us at +91 88866 33523 📞"
      quickActions = [
        { label: '📸 View Photo Cake', action: 'view', productSlug: 'photo-print-cake' },
        { label: '📞 Call Us', action: 'contact' }
      ]
    }
    
    // Contact/Help
    else if (contains('contact', 'call', 'phone', 'whatsapp', 'help', 'support', 'talk', 'speak', 'number')) {
      reply = "Happy to help! 📞\n\n• Call/WhatsApp: +91 88866 33523\n• Working Hours: 9 AM - 9 PM (All days)\n• Quick replies guaranteed!\n\nOr continue chatting with me here! What do you need help with? 😊"
      quickActions = [
        { label: '📞 Call Now', action: 'call' },
        { label: '💬 WhatsApp', action: 'whatsapp' }
      ]
    }
    
    // Order/Cart
    else if (contains('order', 'buy', 'purchase', 'cart', 'checkout', 'want to order')) {
      reply = "Awesome! 🛒 To place an order:\n\n1. Browse our products above\n2. Click on any item you like\n3. Customize and add to cart\n4. Proceed to checkout\n\nNeed help choosing? Just ask me! What type of cake or item are you looking for? 🎂"
      quickActions = [
        { label: '🎂 Birthday Cakes', action: 'birthday' },
        { label: '🍫 Brownies', action: 'brownies' },
        { label: '🌱 Eggless Options', action: 'eggless' }
      ]
    }
    
    // Weight/Size
    else if (contains('weight', 'size', 'kg', 'gram', 'how big', 'how large', 'how much kg')) {
      reply = "Our sizes! 📏\n\n• Cakes: 1kg, 1.5kg, 2kg, 3kg available\n• Brownies: 500g packs\n• Breads: 400-500g loaves\n• Desserts: 6-12 pieces\n\nMost cakes serve 8-10 people per kg. Need a specific size? Let me know! 🎂"
    }
    
    // Bestsellers
    else if (contains('bestseller', 'best seller', 'popular', 'recommend', 'suggest', 'famous', 'top', 'best')) {
      reply = "Our bestsellers! ⭐\n\n• Chocolate Birthday Cake (₹850)\n• Black Forest Gateau (₹900)\n• Red Velvet Dream (₹1100)\n• Chocolate Brownies (₹350)\n• Sourdough Bread (₹250)\n• Eggless Vanilla Bliss (₹800)\n\nThese are customer favorites! Which one would you like to try? 😊"
      quickActions = [
        { label: '🍫 View Chocolate Cake', action: 'view', productSlug: 'chocolate-birthday-cake' },
        { label: '🍒 View Black Forest', action: 'view', productSlug: 'black-forest-cake' }
      ]
    }
    
    // Thanks
    else if (contains('thank', 'thanks', 'thx', 'appreciate', 'thnx')) {
      reply = "You're very welcome! 😊 Is there anything else I can help you with? Feel free to browse our products above or ask me anything! 🎂"
      quickActions = [
        { label: '🛒 Browse Products', action: 'browse' },
        { label: '🎂 View Bestsellers', action: 'bestsellers' }
      ]
    }
    
    // Default response
    else {
      reply = "I'd love to help! 😊 I can assist you with:\n\n• Birthday & Anniversary cakes 🎂\n• Eggless options 🌱\n• Brownies, breads & cookies 🍪\n• Prices & delivery info 💰\n• Custom orders 🎨\n\nWhat are you looking for today?"
      quickActions = [
        { label: '🎂 Birthday Cakes', action: 'birthday' },
        { label: '💝 Anniversary Cakes', action: 'anniversary' },
        { label: '🌱 Eggless Options', action: 'eggless' },
        { label: '💰 Budget Options', action: 'budget' }
      ]
    }

    return NextResponse.json({ reply, quickActions })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ 
      reply: "I'm having trouble right now. Please try again or call us at +91 88866 33523 for immediate help! 🙏",
      quickActions: []
    })
  }
}
