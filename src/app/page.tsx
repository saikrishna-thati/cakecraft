'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Cake, ShoppingBag, MessageCircle, Phone, MapPin, Clock, Filter,
  Search, X, Plus, Minus, Trash2, Edit, Star, Leaf, ChevronRight,
  ArrowRight, Truck, Check, Send, Menu, Heart, Package, CreditCard,
  Banknote, Loader2, Sparkles, Gift, Award, ChefHat
} from 'lucide-react'

// ====== Types ======
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  image: string
  eggless: boolean
  bestseller: boolean
  weight: string
  active: boolean
}

interface CartItem {
  id: string
  product: Product
  quantity: number
  eggless: boolean
  extraCream: boolean
  message: string
  price: number
}

interface OrderData {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  address: string
  city: string
  pincode: string
  deliveryDate: string
  deliveryTime: string
  paymentMethod: string
  totalAmount: number
  notes?: string
  items: {
    id?: string
    name: string
    quantity: number
    price: number
    eggless?: boolean
    extraCream?: boolean
    message?: string
  }[]
}

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
}

// ====== Constants ======
const CATEGORIES = ['All', 'Birthday', 'Anniversary', 'Custom', 'Brownies', 'Breads', 'Desserts', 'Cupcakes', 'Cookies']

const CATEGORY_ICONS: Record<string, string> = {
  All: '🎂',
  Birthday: '🎈',
  Anniversary: '💝',
  Custom: '🎨',
  Brownies: '🍫',
  Breads: '🍞',
  Desserts: '🍮',
  Cupcakes: '🧁',
  Cookies: '🍪',
}

const QUICK_ACTIONS = [
  { label: 'Suggest cakes under ₹500', message: 'Suggest some delicious cakes under ₹500' },
  { label: 'Eggless options?', message: 'What eggless options do you have?' },
  { label: 'Delivery info?', message: 'What are the delivery options and charges?' },
  { label: 'Best sellers?', message: 'What are your best selling items?' },
]

const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
  '7:00 PM - 9:00 PM',
]

const ORDER_STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

// ====== Animation Variants ======
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const slideIn = {
  hidden: { x: 300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: 300, opacity: 0, transition: { duration: 0.2 } }
}

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
}

// ====== Helper ======
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

function getTomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ====== Main Component ======
export default function Home() {
  // ---- Navigation State ----
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ---- View State ----
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'confirmation' | 'admin'>('home')

  // ---- Products State ----
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('all')
  const [filterEggless, setFilterEggless] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // ---- Cart State ----
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  // ---- Product Detail ----
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailEggless, setDetailEggless] = useState(false)
  const [detailExtraCream, setDetailExtraCream] = useState(false)
  const [detailMessage, setDetailMessage] = useState('')
  const [detailQuantity, setDetailQuantity] = useState(1)

  // ---- Checkout State ----
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    pincode: '',
    deliveryDate: getTomorrowDate(),
    deliveryTime: '',
    paymentMethod: 'cod',
    notes: '',
  })
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  // ---- Confirmation State ----
  const [confirmedOrder, setConfirmedOrder] = useState<OrderData | null>(null)

  // ---- Admin State ----
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products')
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'Birthday',
    image: '', eggless: false, bestseller: false, weight: '1kg',
  })

  // ---- Chat State ----
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Hi! 👋 Welcome to CakeCraft! I can help you find the perfect cake. What are you looking for today?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // ---- Refs ----
  const menuRef = useRef<HTMLDivElement>(null)

  // ====== EFFECTS ======
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // ====== PRODUCT FETCHING ======
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const params = new URLSearchParams()
      if (filterCategory !== 'All') params.set('category', filterCategory)
      if (filterMaxPrice !== 'all') params.set('maxPrice', filterMaxPrice)
      if (filterEggless) params.set('eggless', 'true')
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }, [filterCategory, filterMaxPrice, filterEggless, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ====== CART FUNCTIONS ======
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0)
  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = (product: Product, eggless: boolean, extraCream: boolean, message: string, quantity: number) => {
    let price = product.price
    if (extraCream) price += 100

    setCart(prev => {
      const existing = prev.find(item =>
        item.product.id === product.id && item.eggless === eggless && item.extraCream === extraCream && item.message === message
      )
      if (existing) {
        return prev.map(item =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, {
        id: `${product.id}-${Date.now()}`,
        product, quantity, eggless, extraCream, message, price
      }]
    })
    toast.success(`${product.name} added to cart!`)
  }

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
    toast('Item removed from cart')
  }

  // ====== PRODUCT DETAIL ======
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product)
    setDetailEggless(product.eggless)
    setDetailExtraCream(false)
    setDetailMessage('')
    setDetailQuantity(1)
  }

  const handleAddToCartFromDetail = () => {
    if (!selectedProduct) return
    addToCart(selectedProduct, detailEggless, detailExtraCream, detailMessage, detailQuantity)
    setSelectedProduct(null)
  }

  // ====== CHECKOUT ======
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    setCurrentView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    const { customerName, customerPhone, address, city, pincode, deliveryDate, deliveryTime, paymentMethod, notes } = checkoutForm
    if (!customerName || !customerPhone || !address || !city || !pincode || !deliveryDate || !deliveryTime) {
      toast.error('Please fill all required fields')
      return
    }
    if (paymentMethod === 'razorpay') {
      setShowPaymentModal(true)
      return
    }
    await submitOrder()
  }

  const processPayment = async () => {
    setProcessingPayment(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProcessingPayment(false)
    setShowPaymentModal(false)
    await submitOrder()
  }

  const submitOrder = async () => {
    setPlacingOrder(true)
    try {
      const orderPayload = {
        ...checkoutForm,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          eggless: item.eggless,
          extraCream: item.extraCream,
          message: item.message,
        })),
        totalAmount: getCartTotal(),
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const order = await res.json()
      if (!res.ok) throw new Error('Failed to place order')

      // Send WhatsApp
      try {
        await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: { ...orderPayload, id: order.id } }),
        })
      } catch { /* whatsapp failure is non-critical */ }

      setConfirmedOrder({ ...orderPayload, id: order.id })
      setCart([])
      setCurrentView('confirmation')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success('Order placed successfully! 🎉')
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  // ====== CHATBOT ======
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return
    setChatMessages(prev => [...prev, { role: 'user', content: text }])
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'bot', content: data.reply }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting. Please try again! 🙏" }])
    } finally {
      setChatLoading(false)
    }
  }

  // ====== ADMIN ======
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setAdminLoggedIn(true)
      fetchAllOrders()
      toast.success('Admin login successful')
    } else {
      toast.error('Incorrect password')
    }
  }

  const fetchAllOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setAllOrders(data)
    } catch {
      toast.error('Failed to fetch orders')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      toast.success(`Order status updated to ${status}`)
      fetchAllOrders()
    } catch {
      toast.error('Failed to update order status')
    }
  }

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        })
        toast.success('Product updated')
      } else {
        await fetch('/api/products/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        })
        toast.success('Product created')
      }
      setShowAddProduct(false)
      setEditingProduct(null)
      resetProductForm()
      fetchProducts()
    } catch {
      toast.error('Failed to save product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const resetProductForm = () => {
    setProductForm({ name: '', description: '', price: '', category: 'Birthday', image: '', eggless: false, bestseller: false, weight: '1kg' })
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image,
      eggless: product.eggless,
      bestseller: product.bestseller,
      weight: product.weight,
    })
    setShowAddProduct(true)
  }

  // ====== CATEGORY SCROLL ======
  const scrollToMenu = (category: string) => {
    setFilterCategory(category)
    setCurrentView('home')
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // ====== FILTERED PRODUCTS ======
  const filteredProducts = products

  // ====== RENDER: NAVIGATION ======
  const renderNav = () => (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg shadow-orange-100/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <span className="font-playfair text-2xl font-bold text-amber-900">CakeCraft</span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Menu', 'About', 'Contact'].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Home') { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
                    else if (item === 'Menu') { scrollToMenu('All') }
                    else if (item === 'About' || item === 'Contact') {
                      document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="text-xs text-stone-400 hover:text-orange-600 transition-colors hidden sm:block"
              >
                Admin
              </button>

              {/* Cart button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {getCartCount()}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-orange-50 text-stone-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-t border-orange-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {['Home', 'Menu', 'About', 'Contact', 'Admin'].map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      if (item === 'Home') { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
                      else if (item === 'Menu') scrollToMenu('All')
                      else if (item === 'Admin') { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
                      else document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* WhatsApp floating badge */}
      <a
        href="https://wa.me/919876543210?text=Hi%20CakeCraft!%20I%20want%20to%20order%20a%20cake"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-24 right-4 z-40 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 hover:scale-110 transition-all active:scale-95"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </>
  )

  // ====== RENDER: HERO SECTION ======
  const renderHero = () => (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-cream to-amber-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text content - asymmetric offset */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:pl-8 space-y-6 lg:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Handcrafted with Love in India
            </motion.div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-stone-900 leading-[1.1]">
              Every Celebration
              <br />
              Deserves a{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-orange-600">Perfect Cake</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-2 left-0 h-3 bg-orange-200/60 -z-0 rounded-sm"
                />
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-500 max-w-lg leading-relaxed">
              From classic chocolate to exotic Indian flavors — we craft cakes that turn moments into memories. Fresh, eggless options available.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => scrollToMenu('All')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-base font-semibold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all hover:scale-105 active:scale-95"
              >
                Explore Our Menu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50 px-8 py-6 text-base font-semibold rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                About Us
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {[
                { icon: Truck, text: 'Pan-India Delivery' },
                { icon: Leaf, text: 'Eggless Available' },
                { icon: Star, text: '4.9★ Rated' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-stone-500">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-orange-600" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Hero Image - asymmetric stack */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:pr-8 hidden md:block"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-200/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/hero-cakes.png"
                  alt="Beautiful artisan cakes"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-stone-200/50 border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">50,000+</p>
                    <p className="text-xs text-stone-500">Happy Customers</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-stone-200/50 border border-orange-100"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 border-2 border-white" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">4.9 Rating</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )

  // ====== RENDER: CATEGORY SHOWCASE ======
  const renderCategoryShowcase = () => (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900">Browse by Category</h2>
          <p className="text-stone-500 mt-2">Find exactly what you're craving</p>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.filter(c => c !== 'All').map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => scrollToMenu(cat)}
              className="flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border-2 border-transparent hover:border-orange-200 transition-all hover:scale-105 active:scale-95 group min-w-[150px]"
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
              <span className="font-semibold text-stone-700 text-sm whitespace-nowrap">{cat}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )

  // ====== RENDER: PRODUCT CATALOG ======
  const renderProductCatalog = () => (
    <section ref={menuRef} id="menu" className="py-12 sm:py-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900">Our Menu</h2>
          <p className="text-stone-500 mt-2">Handcrafted with premium ingredients, baked fresh daily</p>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-orange-100 mb-8 space-y-4"
        >
          {/* Search and filters row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                placeholder="Search cakes, brownies, cookies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400 rounded-xl h-11"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                </button>
              )}
            </div>

            {/* Price filter */}
            <Select value={filterMaxPrice} onValueChange={setFilterMaxPrice}>
              <SelectTrigger className="w-full sm:w-48 border-orange-200 rounded-xl h-11">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="300">Under ₹300</SelectItem>
                <SelectItem value="500">Under ₹500</SelectItem>
                <SelectItem value="1000">Under ₹1000</SelectItem>
              </SelectContent>
            </Select>

            {/* Eggless toggle */}
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-50 transition-colors whitespace-nowrap">
              <Checkbox
                checked={filterEggless}
                onCheckedChange={(checked) => setFilterEggless(checked === true)}
              />
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-stone-700">Eggless</span>
            </label>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-orange-50 text-stone-600 hover:bg-orange-100'
                }`}
              >
                {cat === 'All' ? '🌟 All' : `${CATEGORY_ICONS[cat]} ${cat}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-orange-100 animate-pulse">
                <div className="w-full h-48 bg-orange-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-orange-100 rounded w-3/4" />
                  <div className="h-3 bg-orange-50 rounded w-full" />
                  <div className="h-3 bg-orange-50 rounded w-1/2" />
                  <div className="h-10 bg-orange-100 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🍰</p>
            <h3 className="font-playfair text-2xl font-bold text-stone-800 mb-2">No cakes found</h3>
            <p className="text-stone-500 mb-6">Try adjusting your filters or search query</p>
            <Button onClick={() => { setFilterCategory('All'); setSearchQuery(''); setFilterMaxPrice('all'); setFilterEggless(false) }} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} custom={i} variants={fadeInUp}>
                <Card
                  className="group bg-white rounded-2xl overflow-hidden border border-orange-100 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  onClick={() => openProductDetail(product)}
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-orange-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.bestseller && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md">
                          <Award className="w-3 h-3 mr-1" /> Bestseller
                        </Badge>
                      )}
                      {product.eggless && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold shadow-md">
                          <Leaf className="w-3 h-3 mr-1" /> Eggless
                        </Badge>
                      )}
                    </div>
                    {/* Quick add */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button
                          size="sm"
                          className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg rounded-xl font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product, product.eggless, false, '', 1)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Quick Add
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-stone-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-600 mb-3">{product.category}</Badge>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
                      <span>{product.weight}</span>
                      <span>•</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">{formatPrice(product.price)}</span>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-200 hover:shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          openProductDetail(product)
                        }}
                      >
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )

  // ====== RENDER: ABOUT SECTION ======
  const renderAbout = () => (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="/hero-cakes.png"
              alt="Our bakery"
              className="rounded-3xl shadow-2xl shadow-orange-100/50 w-full h-[350px] object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Badge className="bg-orange-100 text-orange-700 text-sm px-4 py-1">Our Story</Badge>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900">
              Baking Joy Since 2015
            </h2>
            <p className="text-stone-500 leading-relaxed">
              CakeCraft started as a small home bakery in Mumbai with a simple mission: to make every celebration sweeter. Today, we serve thousands of happy customers across India with our handcrafted cakes, brownies, and Indian mithai.
            </p>
            <p className="text-stone-500 leading-relaxed">
              Every product is made fresh with premium ingredients — Belgian chocolate, fresh cream, real fruits, and pure ghee. No preservatives, no shortcuts, just pure baking love.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { num: '50K+', label: 'Cakes Delivered' },
                { num: '4.9★', label: 'Customer Rating' },
                { num: '200+', label: 'Cities Served' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 rounded-2xl bg-orange-50">
                  <p className="text-2xl font-bold text-orange-600">{item.num}</p>
                  <p className="text-xs text-stone-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )

  // ====== RENDER: CONTACT SECTION ======
  const renderContact = () => (
    <section id="contact" className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900">Get in Touch</h2>
          <p className="text-stone-500 mt-2">We'd love to hear from you!</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Phone, title: 'Call Us', info: '+91 98765 43210', sub: 'Mon-Sat, 9AM-9PM' },
            { icon: MessageCircle, title: 'WhatsApp', info: '+91 98765 43210', sub: 'Quick replies guaranteed' },
            { icon: MapPin, title: 'Visit Us', info: '123 Baker Street, Mumbai', sub: 'Maharashtra, India' },
            { icon: Clock, title: 'Working Hours', info: '9:00 AM - 9:00 PM', sub: 'All days of the week' },
          ].map(item => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">{item.title}</h3>
              <p className="text-sm text-orange-600 font-medium">{item.info}</p>
              <p className="text-xs text-stone-400 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )

  // ====== RENDER: FOOTER ======
  const renderFooter = () => (
    <footer className="bg-stone-900 text-stone-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Cake className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair text-xl font-bold text-white">CakeCraft</span>
            </div>
            <p className="text-sm text-stone-400">Premium cakes and bakery items handcrafted with love. Making celebrations sweeter since 2015.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <div className="space-y-2">
              {['Birthday Cakes', 'Anniversary Cakes', 'Custom Cakes', 'Eggless Cakes', 'Brownies', 'Desserts'].map(item => (
                <button key={item} onClick={() => scrollToMenu(item.replace(' Cakes', '').replace(' ', ''))} className="block text-sm text-stone-400 hover:text-orange-400 transition-colors">{item}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'FAQs'].map(item => (
                <button key={item} className="block text-sm text-stone-400 hover:text-orange-400 transition-colors">{item}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-3">Get updates on new flavors and special offers!</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 rounded-xl h-10 text-sm" />
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 rounded-xl px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator className="bg-stone-800 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>© 2025 CakeCraft Bakery. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  )

  // ====== RENDER: PRODUCT DETAIL MODAL ======
  const renderProductDetailModal = () => (
    <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
        {selectedProduct && (
          <>
            {/* Image */}
            <div className="relative h-64 sm:h-80 bg-orange-50">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {selectedProduct.bestseller && (
                  <Badge className="bg-amber-500 text-white"><Award className="w-3 h-3 mr-1" /> Bestseller</Badge>
                )}
                {selectedProduct.eggless && (
                  <Badge className="bg-green-500 text-white"><Leaf className="w-3 h-3 mr-1" /> Eggless</Badge>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900">{selectedProduct.name}</h2>
                    <p className="text-stone-500 text-sm mt-1">{selectedProduct.category} • {selectedProduct.weight}</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{formatPrice(selectedProduct.price)}</p>
                </div>
                <p className="text-stone-600 mt-4 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-stone-800">Customize Your Order</h3>

                {/* Eggless toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-stone-700 text-sm">Eggless Option</p>
                      <p className="text-xs text-stone-500">Made without eggs</p>
                    </div>
                  </div>
                  <Switch checked={detailEggless} onCheckedChange={setDetailEggless} />
                </div>

                {/* Extra cream */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50">
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-stone-700 text-sm">Extra Cream</p>
                      <p className="text-xs text-stone-500">+₹100 - Additional creamy layer</p>
                    </div>
                  </div>
                  <Switch checked={detailExtraCream} onCheckedChange={setDetailExtraCream} />
                </div>

                {/* Custom message */}
                {(selectedProduct.category === 'Birthday' || selectedProduct.category === 'Anniversary' || selectedProduct.category === 'Custom') && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-stone-700">Custom Message on Cake</Label>
                    <Input
                      placeholder='e.g., "Happy Birthday Rahul!"'
                      value={detailMessage}
                      onChange={e => setDetailMessage(e.target.value)}
                      maxLength={50}
                      className="border-orange-200 focus:border-orange-400 rounded-xl"
                    />
                    <p className="text-xs text-stone-400">{detailMessage.length}/50 characters</p>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50">
                  <p className="font-medium text-stone-700 text-sm">Quantity</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-9 h-9 rounded-lg border-orange-200 hover:bg-orange-100"
                      onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg">{detailQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-9 h-9 rounded-lg border-orange-200 hover:bg-orange-100"
                      onClick={() => setDetailQuantity(Math.min(10, detailQuantity + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>{selectedProduct.name} × {detailQuantity}</span>
                  <span>{formatPrice(selectedProduct.price * detailQuantity)}</span>
                </div>
                {detailExtraCream && (
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Extra Cream × {detailQuantity}</span>
                    <span>{formatPrice(100 * detailQuantity)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-stone-800">Total</span>
                  <span className="text-orange-600">{formatPrice((selectedProduct.price + (detailExtraCream ? 100 : 0)) * detailQuantity)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCartFromDetail}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    handleAddToCartFromDetail()
                    setShowCart(true)
                  }}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-200"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  // ====== RENDER: CART DRAWER ======
  const renderCartDrawer = () => (
    <Sheet open={showCart} onOpenChange={setShowCart}>
      <SheetContent className="w-full sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-orange-100">
          <SheetTitle className="flex items-center gap-2 font-playfair text-xl">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            Your Cart
            {getCartCount() > 0 && (
              <Badge className="bg-orange-100 text-orange-700">{getCartCount()} items</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-orange-300" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-stone-800 mb-2">Your cart is empty</h3>
            <p className="text-stone-500 text-sm mb-6">Browse our menu and add some delicious items!</p>
            <Button onClick={() => { setShowCart(false); scrollToMenu('All') }} className="bg-orange-500 hover:bg-orange-600 rounded-xl">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="flex gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100"
                  >
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.eggless && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-green-200 text-green-600">Eggless</Badge>}
                        {item.extraCream && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-orange-200 text-orange-600">Extra Cream</Badge>}
                        {item.message && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-200 text-amber-600">✉️ {item.message}</Badge>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="w-7 h-7 rounded-lg border border-orange-200 flex items-center justify-center hover:bg-orange-100 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="w-7 h-7 rounded-lg border border-orange-200 flex items-center justify-center hover:bg-orange-100 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-orange-600 text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-orange-100 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-orange-600">{formatPrice(getCartTotal())}</span>
              </div>
              <p className="text-xs text-stone-400">Delivery charges calculated at checkout</p>
              <Button
                onClick={() => { setShowCart(false); handleCheckout() }}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-orange-200"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )

  // ====== RENDER: CHECKOUT ======
  const renderCheckout = () => (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-orange-50/50 to-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-stone-500 hover:text-orange-600 mb-6 transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Menu
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900 mb-8">Checkout</h1>

          <div className="space-y-6">
            {/* Customer Details */}
            <Card className="p-6 border-orange-100">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">1</div>
                Customer Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={checkoutForm.customerName}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={checkoutForm.customerPhone}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Email (Optional)</Label>
                  <Input
                    type="email"
                    value={checkoutForm.customerEmail}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="rahul@example.com"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6 border-orange-100">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">2</div>
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-3">
                  <Label>Address *</Label>
                  <Input
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123, Baker Street, Andheri West"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={checkoutForm.city}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Mumbai"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode *</Label>
                  <Input
                    value={checkoutForm.pincode}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="400053"
                    className="border-orange-200 rounded-xl"
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Schedule */}
            <Card className="p-6 border-orange-100">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">3</div>
                Delivery Schedule
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Date *</Label>
                  <Input
                    type="date"
                    value={checkoutForm.deliveryDate}
                    min={getTomorrowDate()}
                    onChange={e => setCheckoutForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="border-orange-200 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot *</Label>
                  <Select value={checkoutForm.deliveryTime} onValueChange={v => setCheckoutForm(prev => ({ ...prev, deliveryTime: v }))}>
                    <SelectTrigger className="border-orange-200 rounded-xl">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 border-orange-100">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">4</div>
                Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setCheckoutForm(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    checkoutForm.paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-stone-200 hover:border-orange-200'
                  }`}
                >
                  <Banknote className={`w-6 h-6 ${checkoutForm.paymentMethod === 'cod' ? 'text-orange-600' : 'text-stone-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-stone-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-stone-400">Pay when you receive</p>
                  </div>
                </button>
                <button
                  onClick={() => setCheckoutForm(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    checkoutForm.paymentMethod === 'razorpay'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-stone-200 hover:border-orange-200'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${checkoutForm.paymentMethod === 'razorpay' ? 'text-orange-600' : 'text-stone-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-stone-800 text-sm">Online Payment</p>
                    <p className="text-xs text-stone-400">UPI / Credit Card / Debit Card</p>
                  </div>
                </button>
              </div>
            </Card>

            {/* Special Instructions */}
            <Card className="p-6 border-orange-100">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Gift className="w-4 h-4 text-orange-600" />
                Special Instructions (Optional)
              </h2>
              <Textarea
                value={checkoutForm.notes}
                onChange={e => setCheckoutForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests, dietary requirements, or delivery instructions..."
                className="border-orange-200 rounded-xl min-h-[100px]"
              />
            </Card>

            {/* Order Summary */}
            <Card className="p-6 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
              <h2 className="font-semibold text-stone-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      {item.product.name} × {item.quantity}
                      {item.eggless ? ' 🌱' : ''}
                      {item.extraCream ? ' 🧁' : ''}
                    </span>
                    <span className="font-medium text-stone-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="bg-orange-200 mb-4" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-800 text-lg">Total</span>
                <span className="text-2xl font-bold text-orange-600">{formatPrice(getCartTotal())}</span>
              </div>
            </Card>

            {/* Place Order */}
            <Button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold text-lg shadow-xl shadow-orange-200 disabled:opacity-50"
            >
              {placingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Placing Order...
                </>
              ) : (
                <>
                  Place Order • {formatPrice(getCartTotal())}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )

  // ====== RENDER: PAYMENT MODAL ======
  const renderPaymentModal = () => (
    <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
      <DialogContent className="max-w-sm p-6 text-center">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">Complete Payment</DialogTitle>
          <DialogDescription>Secure payment via Razorpay</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-stone-900 mb-2">{formatPrice(getCartTotal())}</p>
          <p className="text-sm text-stone-500 mb-6">Total amount to pay</p>
          {processingPayment ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-sm text-stone-500">Processing payment...</p>
            </div>
          ) : (
            <Button
              onClick={processPayment}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold"
            >
              Pay Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  // ====== RENDER: ORDER CONFIRMATION ======
  const renderConfirmation = () => (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-orange-50/50 to-cream flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 sm:px-6 text-center"
      >
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-stone-500 mb-6">Thank you for your order. We&apos;re already preparing your delicious treats!</p>

          {confirmedOrder && (
            <Card className="p-6 text-left border-orange-100 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Order ID</span>
                  <span className="font-mono font-medium text-stone-800">{confirmedOrder.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Name</span>
                  <span className="text-stone-800">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Delivery</span>
                  <span className="text-stone-800">{confirmedOrder.deliveryDate} • {confirmedOrder.deliveryTime}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  {confirmedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-stone-600">{item.name} × {item.quantity}</span>
                      <span className="text-stone-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(confirmedOrder.totalAmount)}</span>
                </div>
              </div>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I just placed an order (ID: ${confirmedOrder?.id?.slice(0, 8).toUpperCase()}). I'd like to track my order.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold h-12">
                <MessageCircle className="w-5 h-5 mr-2" /> Track on WhatsApp
              </Button>
            </a>
            <Button
              onClick={() => { setCurrentView('home'); setConfirmedOrder(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              variant="outline"
              className="w-full sm:w-auto border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl font-semibold h-12"
            >
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )

  // ====== RENDER: ADMIN PANEL ======
  const renderAdmin = () => (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-stone-50 to-orange-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {!adminLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mx-auto pt-12 text-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Cake className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-stone-900 mb-2">Admin Login</h1>
            <p className="text-stone-500 mb-6 text-sm">Enter the admin password to access the dashboard</p>
            <div className="space-y-4">
              <Input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Enter password"
                className="border-orange-200 rounded-xl text-center"
              />
              <Button onClick={handleAdminLogin} className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold">
                Login
              </Button>
            </div>
            <button onClick={() => setCurrentView('home')} className="mt-6 text-sm text-stone-400 hover:text-orange-600 transition-colors">
              ← Back to Store
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-stone-900">Admin Dashboard</h1>
                <p className="text-stone-500 text-sm mt-1">Manage products and orders</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setCurrentView('home')} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl">
                  ← Back to Store
                </Button>
                <Button onClick={() => setAdminLoggedIn(false)} variant="outline" className="border-stone-200 text-stone-500 hover:bg-stone-50 rounded-xl">
                  Logout
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {(['products', 'orders'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setAdminTab(tab); if (tab === 'orders') fetchAllOrders() }}
                  className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    adminTab === tab
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'bg-white text-stone-600 hover:bg-orange-50 border border-stone-200'
                  }`}
                >
                  {tab === 'products' ? `📦 Products (${products.length})` : `🛒 Orders (${allOrders.length})`}
                </button>
              ))}
            </div>

            {/* Products Tab */}
            {adminTab === 'products' && (
              <div className="space-y-4">
                <Button onClick={() => { resetProductForm(); setEditingProduct(null); setShowAddProduct(true) }} className="bg-orange-500 hover:bg-orange-600 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>

                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-stone-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-stone-600">Product</th>
                          <th className="text-left px-4 py-3 font-semibold text-stone-600">Category</th>
                          <th className="text-left px-4 py-3 font-semibold text-stone-600">Price</th>
                          <th className="text-left px-4 py-3 font-semibold text-stone-600">Tags</th>
                          <th className="text-right px-4 py-3 font-semibold text-stone-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-t border-stone-100 hover:bg-orange-50/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                  <p className="font-medium text-stone-800">{product.name}</p>
                                  <p className="text-xs text-stone-400">{product.weight}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3"><Badge variant="outline" className="border-orange-200 text-orange-600">{product.category}</Badge></td>
                            <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {product.bestseller && <Badge className="bg-amber-100 text-amber-700 text-xs">Bestseller</Badge>}
                                {product.eggless && <Badge className="bg-green-100 text-green-700 text-xs">Eggless</Badge>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="h-8 border-orange-200 hover:bg-orange-50" onClick={() => startEditProduct(product)}>
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-red-200 text-red-500 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {adminTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Order ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Customer</th>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Total</th>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-stone-600">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map(order => (
                        <tr key={order.id} className="border-t border-stone-100 hover:bg-orange-50/50">
                          <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-stone-800">{order.customerName}</p>
                              <p className="text-xs text-stone-400">{order.customerPhone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-stone-500">
                            {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                          <td className="px-4 py-3">
                            <Badge className={`text-xs ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                              order.orderStatus === 'baking' ? 'bg-amber-100 text-amber-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.orderStatus.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Select value={order.orderStatus} onValueChange={v => updateOrderStatus(order.id, v)}>
                              <SelectTrigger className="w-36 h-8 text-xs rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map(s => (
                                  <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, ' ')}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                      {allOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-stone-400">No orders yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add/Edit Product Modal */}
            <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} className="border-orange-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} className="border-orange-200 rounded-xl min-h-[80px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (₹) *</Label>
                      <Input type="number" value={productForm.price} onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))} className="border-orange-200 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight *</Label>
                      <Input value={productForm.weight} onChange={e => setProductForm(prev => ({ ...prev, weight: e.target.value }))} className="border-orange-200 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={productForm.category} onValueChange={v => setProductForm(prev => ({ ...prev, category: v }))}>
                      <SelectTrigger className="border-orange-200 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input value={productForm.image} onChange={e => setProductForm(prev => ({ ...prev, image: e.target.value }))} className="border-orange-200 rounded-xl" placeholder="/products/filename.png" />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={productForm.eggless} onCheckedChange={c => setProductForm(prev => ({ ...prev, eggless: c === true }))} />
                      <span className="text-sm text-stone-700">Eggless</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={productForm.bestseller} onCheckedChange={c => setProductForm(prev => ({ ...prev, bestseller: c === true }))} />
                      <span className="text-sm text-stone-700">Bestseller</span>
                    </label>
                  </div>
                  <Button onClick={handleSaveProduct} className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </div>
    </div>
  )

  // ====== RENDER: AI CHATBOT ======
  const renderChatbot = () => (
    <>
      {/* Floating chat button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          showChat ? 'bg-stone-800 hover:bg-stone-900' : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-300'
        }`}
      >
        {showChat ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            variants={slideIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(600px, calc(100vh - 140px))' }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Cake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">CakeCraft Assistant</h3>
                  <p className="text-xs text-orange-100">Ask me anything about our cakes!</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-orange-50 text-stone-700 rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-orange-50 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            {chatMessages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.label}
                    onClick={() => sendChatMessage(action.message)}
                    className="text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors border border-orange-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-orange-100">
              <form onSubmit={e => { e.preventDefault(); sendChatMessage(chatInput) }} className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={chatLoading}
                  className="flex-1 border-orange-200 rounded-xl h-10 text-sm"
                />
                <Button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  size="icon"
                  className="h-10 w-10 bg-orange-500 hover:bg-orange-600 rounded-xl flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  // ====== MAIN RENDER ======
  return (
    <main className="min-h-screen bg-[#FFFBF5]">
      {renderNav()}

      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderHero()}
            {renderCategoryShowcase()}
            {renderProductCatalog()}
            {renderAbout()}
            {renderContact()}
            {renderFooter()}
          </motion.div>
        )}

        {currentView === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
            {renderCheckout()}
          </motion.div>
        )}

        {currentView === 'confirmation' && (
          <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderConfirmation()}
          </motion.div>
        )}

        {currentView === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
            {renderAdmin()}
          </motion.div>
        )}
      </AnimatePresence>

      {renderProductDetailModal()}
      {renderCartDrawer()}
      {renderPaymentModal()}
      {renderChatbot()}
    </main>
  )
}
