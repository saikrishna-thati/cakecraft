import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  // Birthday Cakes
  { name: 'Chocolate Birthday Cake', slug: 'chocolate-birthday-cake', description: 'Rich, moist chocolate cake layered with Belgian chocolate ganache. A classic favorite for birthdays of all ages.', price: 850, category: 'Birthday', image: '/products/chocolate-birthday-cake.png', images: '["/products/chocolate-birthday-cake.png","/products/gallery/chocolate-birthday-cake-2.png","/products/gallery/chocolate-birthday-cake-3.png"]', video: '', eggless: false, bestseller: true, weight: '1kg' },
  { name: 'Vanilla Rose Cake', slug: 'vanilla-rose-cake', description: 'Elegant vanilla sponge with rose cream frosting, adorned with edible flowers. Perfect for sophisticated celebrations.', price: 950, category: 'Birthday', image: '/products/vanilla-rose-cake.png', images: '["/products/vanilla-rose-cake.png","/products/gallery/vanilla-rose-cake-2.png","/products/gallery/vanilla-rose-cake-3.png"]', video: '', eggless: true, bestseller: false, weight: '1kg' },
  { name: 'Butterscotch Delight', slug: 'butterscotch-cake', description: 'Caramel-flavored butterscotch cake with crunchy praline topping. A crowd-pleasing birthday treat.', price: 750, category: 'Birthday', image: '/products/butterscotch-cake.png', images: '["/products/butterscotch-cake.png","/products/gallery/butterscotch-cake-2.png","/products/gallery/butterscotch-cake-3.png"]', video: '', eggless: false, bestseller: true, weight: '1kg' },
  { name: 'Pineapple Party Cake', slug: 'pineapple-cake', description: 'Tangy pineapple cake with whipped cream and cherry toppings. Light, refreshing, and perfect for summer birthdays.', price: 650, category: 'Birthday', image: '/products/pineapple-cake.png', images: '["/products/pineapple-cake.png","/products/gallery/pineapple-cake-2.png","/products/gallery/pineapple-cake-3.png"]', video: '', eggless: true, bestseller: false, weight: '1kg' },
  { name: 'Red Velvet Dream', slug: 'red-velvet-cake', description: 'Stunning red velvet layers with cream cheese frosting. The showstopper cake for memorable birthdays.', price: 1100, category: 'Birthday', image: '/products/red-velvet-cake.png', images: '["/products/red-velvet-cake.png","/products/gallery/red-velvet-cake-2.png","/products/gallery/red-velvet-cake-3.png"]', video: '', eggless: false, bestseller: true, weight: '1kg' },
  { name: 'Mango Passion Cake', slug: 'mango-passion-cake', description: 'Tropical mango cake with passion fruit curd layers. A seasonal favorite during Indian summers.', price: 1000, category: 'Birthday', image: '/products/mango-passion-cake.png', images: '["/products/mango-passion-cake.png","/products/gallery/mango-passion-cake-2.png","/products/gallery/mango-passion-cake-3.png"]', video: '', eggless: false, bestseller: false, weight: '1kg' },

  // Anniversary Cakes
  { name: 'Black Forest Gateau', slug: 'black-forest-cake', description: 'Classic Black Forest with layers of chocolate sponge, cherry compote, and fresh whipped cream. Timeless elegance.', price: 900, category: 'Anniversary', image: '/products/black-forest-cake.png', images: '["/products/black-forest-cake.png","/products/gallery/black-forest-cake-2.png","/products/gallery/black-forest-cake-3.png"]', video: '', eggless: false, bestseller: true, weight: '1.5kg' },
  { name: 'Fruit Overload Cake', slug: 'fruit-cake', description: 'Light sponge loaded with seasonal fresh fruits and glazed with apricot jelly. A healthy celebration choice.', price: 1050, category: 'Anniversary', image: '/products/fruit-cake.png', images: '["/products/fruit-cake.png","/products/gallery/fruit-cake-2.png","/products/gallery/fruit-cake-3.png"]', video: '', eggless: true, bestseller: false, weight: '1.5kg' },
  { name: 'Chocolate Truffle Royale', slug: 'chocolate-truffle-cake', description: 'Dense chocolate truffle cake with rich ganache and gold leaf decoration. For truly special celebrations.', price: 1400, category: 'Anniversary', image: '/products/chocolate-truffle-cake.png', images: '["/products/chocolate-truffle-cake.png","/products/gallery/chocolate-truffle-cake-2.png","/products/gallery/chocolate-truffle-cake-3.png"]', video: '', eggless: false, bestseller: true, weight: '1.5kg' },
  { name: 'Strawberry Shortcake', slug: 'strawberry-shortcake', description: 'Light vanilla sponge with fresh strawberry cream and whole berries. A romantic choice for anniversaries.', price: 1150, category: 'Anniversary', image: '/products/strawberry-shortcake.png', images: '["/products/strawberry-shortcake.png","/products/gallery/strawberry-shortcake-2.png","/products/gallery/strawberry-shortcake-3.png"]', video: '', eggless: false, bestseller: false, weight: '1.5kg' },

  // Custom Cakes
  { name: 'Photo Print Cake', slug: 'photo-print-cake', description: 'Custom cake with your favorite photo printed on edible icing sheet. Personalize your celebration!', price: 1200, category: 'Custom', image: '/products/photo-print-cake.png', images: '["/products/photo-print-cake.png","/products/gallery/photo-print-cake-2.png","/products/gallery/photo-print-cake-3.png"]', video: '', eggless: false, bestseller: false, weight: '2kg' },
  { name: 'Tier Wedding Cake', slug: 'tier-wedding-cake', description: 'Multi-tier wedding cake with hand-crafted fondant details. Consult us for custom designs and flavors.', price: 2500, category: 'Custom', image: '/products/tier-wedding-cake.png', images: '["/products/tier-wedding-cake.png","/products/gallery/tier-wedding-cake-2.png","/products/gallery/tier-wedding-cake-3.png"]', video: '', eggless: false, bestseller: false, weight: '3kg' },
  { name: 'Number Shape Cake', slug: 'number-shape-cake', description: 'Cake shaped as your special number! Available in any flavor with custom decorations.', price: 1000, category: 'Custom', image: '/products/number-shape-cake.png', images: '["/products/number-shape-cake.png","/products/gallery/number-shape-cake-2.png","/products/gallery/number-shape-cake-3.png"]', video: '', eggless: true, bestseller: false, weight: '1.5kg' },

  // Eggless Collection
  { name: 'Eggless Vanilla Bliss', slug: 'eggless-vanilla-bliss', description: 'Fluffy vanilla cake made entirely without eggs. Soft, moist, and absolutely delicious for eggless lovers.', price: 800, category: 'Eggless', image: '/products/eggless-vanilla-bliss.png', images: '["/products/eggless-vanilla-bliss.png","/products/gallery/eggless-vanilla-bliss-2.png","/products/gallery/eggless-vanilla-bliss-3.png"]', video: '', eggless: true, bestseller: true, weight: '1kg' },
  { name: 'Eggless Chocolate Fudge', slug: 'eggless-chocolate-fudge', description: 'Decadent chocolate fudge cake without a single egg. Rich cocoa flavor that melts in your mouth.', price: 900, category: 'Eggless', image: '/products/eggless-chocolate-fudge.png', images: '["/products/eggless-chocolate-fudge.png","/products/gallery/eggless-chocolate-fudge-2.png","/products/gallery/eggless-chocolate-fudge-3.png"]', video: '', eggless: true, bestseller: false, weight: '1kg' },
  { name: 'Eggless Pineapple Cake', slug: 'eggless-pineapple-cake', description: 'The classic pineapple cake now in eggless version. Same great taste, suitable for everyone.', price: 700, category: 'Eggless', image: '/products/eggless-pineapple-cake.png', images: '["/products/eggless-pineapple-cake.png","/products/gallery/eggless-pineapple-cake-2.png","/products/gallery/eggless-pineapple-cake-3.png"]', video: '', eggless: true, bestseller: false, weight: '1kg' },

  // Brownies
  { name: 'Classic Chocolate Brownies', slug: 'chocolate-brownies', description: 'Fudgy, gooey chocolate brownies with a crackly top. Baked fresh with premium Belgian chocolate.', price: 350, category: 'Brownies', image: '/products/chocolate-brownies.png', images: '["/products/chocolate-brownies.png","/products/gallery/chocolate-brownies-2.png","/products/gallery/chocolate-brownies-3.png"]', video: '', eggless: false, bestseller: true, weight: '500g' },
  { name: 'Walnut Brownies', slug: 'walnut-brownies', description: 'Chocolate brownies studded with crunchy California walnuts. The perfect nutty-chocolate combo.', price: 400, category: 'Brownies', image: '/products/walnut-brownies.png', images: '["/products/walnut-brownies.png","/products/gallery/walnut-brownies-2.png","/products/gallery/walnut-brownies-3.png"]', video: '', eggless: false, bestseller: false, weight: '500g' },
  { name: 'Blondie Bars', slug: 'blondie-bars', description: 'Buttery blondie bars with white chocolate chips and a hint of vanilla. A lighter alternative to brownies.', price: 300, category: 'Brownies', image: '/products/blondie-bars.png', images: '["/products/blondie-bars.png","/products/gallery/blondie-bars-2.png","/products/gallery/blondie-bars-3.png"]', video: '', eggless: true, bestseller: false, weight: '500g' },

  // Breads
  { name: 'Sourdough Bread', slug: 'sourdough-bread', description: 'Artisan sourdough with a crispy crust and tangy, airy crumb. 24-hour fermented for maximum flavor.', price: 250, category: 'Breads', image: '/products/sourdough-bread.png', images: '["/products/sourdough-bread.png","/products/gallery/sourdough-bread-2.png","/products/gallery/sourdough-bread-3.png"]', video: '', eggless: true, bestseller: true, weight: '500g' },
  { name: 'Garlic Focaccia', slug: 'garlic-focaccia', description: 'Italian-style focaccia topped with roasted garlic, rosemary, and olive oil. Perfect as a side or snack.', price: 200, category: 'Breads', image: '/products/garlic-focaccia.png', images: '["/products/garlic-focaccia.png","/products/gallery/garlic-focaccia-2.png","/products/gallery/garlic-focaccia-3.png"]', video: '', eggless: true, bestseller: false, weight: '400g' },
  { name: 'Multigrain Loaf', slug: 'multigrain-loaf', description: 'Healthy multigrain bread packed with seeds and whole grains. Nutritious and delicious for daily use.', price: 180, category: 'Breads', image: '/products/multigrain-loaf.png', images: '["/products/multigrain-loaf.png","/products/gallery/multigrain-loaf-2.png","/products/gallery/multigrain-loaf-3.png"]', video: '', eggless: true, bestseller: false, weight: '500g' },

  // Desserts
  { name: 'Gulab Jamun (6 pcs)', slug: 'gulab-jamun', description: 'Soft, melt-in-your-mouth gulab jamuns soaked in fragrant rose-cardamom sugar syrup. Traditional Indian sweet.', price: 250, category: 'Desserts', image: '/products/gulab-jamun.png', images: '["/products/gulab-jamun.png","/products/gallery/gulab-jamun-2.png","/products/gallery/gulab-jamun-3.png"]', video: '', eggless: true, bestseller: true, weight: '300g' },
  { name: 'Rasmalai (6 pcs)', slug: 'rasmalai', description: 'Delicate cottage cheese patties soaked in saffron-infused sweet milk with pistachios. Royal Indian dessert.', price: 300, category: 'Desserts', image: '/products/rasmalai.png', images: '["/products/rasmalai.png","/products/gallery/rasmalai-2.png","/products/gallery/rasmalai-3.png"]', video: '', eggless: true, bestseller: true, weight: '350g' },

  // Cupcakes
  { name: 'Assorted Cupcakes (6 pcs)', slug: 'cupcakes', description: 'A box of 6 assorted cupcakes in chocolate, vanilla, red velvet, and butterscotch flavors. Perfect for gifting!', price: 450, category: 'Cupcakes', image: '/products/cupcakes.png', images: '["/products/cupcakes.png","/products/gallery/cupcakes-2.png","/products/gallery/cupcakes-3.png"]', video: '', eggless: false, bestseller: true, weight: '6 pcs' },
  { name: 'Blueberry Muffins (4 pcs)', slug: 'blueberry-muffins', description: 'Fluffy muffins bursting with fresh blueberries and topped with a crumbly streusel. Great for breakfast!', price: 280, category: 'Cupcakes', image: '/products/blueberry-muffins.png', images: '["/products/blueberry-muffins.png","/products/gallery/blueberry-muffins-2.png","/products/gallery/blueberry-muffins-3.png"]', video: '', eggless: false, bestseller: false, weight: '4 pcs' },

  // Cookies
  { name: 'Cookie Gift Box', slug: 'cookies-box', description: 'Premium assorted cookie box with chocolate chip, oatmeal raisin, butter cookies, and almond cookies.', price: 500, category: 'Cookies', image: '/products/cookies-box.png', images: '["/products/cookies-box.png","/products/gallery/cookies-box-2.png","/products/gallery/cookies-box-3.png"]', video: '', eggless: true, bestseller: true, weight: '400g' },
  { name: 'Chocolate Chip Cookies', slug: 'choc-chip-cookies', description: 'Crispy on the outside, chewy on the inside chocolate chip cookies made with premium dark chocolate.', price: 200, category: 'Cookies', image: '/products/choc-chip-cookies.png', images: '["/products/choc-chip-cookies.png","/products/gallery/choc-chip-cookies-2.png","/products/gallery/choc-chip-cookies-3.png"]', video: '', eggless: false, bestseller: false, weight: '200g' },
  { name: 'Nankhatai (Indian Cookies)', slug: 'nankhatai', description: 'Traditional Indian shortbread cookies with ghee and cardamom. A nostalgic bite of Indian bakery heritage.', price: 150, category: 'Cookies', image: '/products/nankhatai.png', images: '["/products/nankhatai.png","/products/gallery/nankhatai-2.png","/products/gallery/nankhatai-3.png"]', video: '', eggless: true, bestseller: false, weight: '200g' },
]

async function main() {
  console.log('Seeding database...')
  
  // Clear existing products
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log(`Seeded ${products.length} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
