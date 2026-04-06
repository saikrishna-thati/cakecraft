#!/bin/bash
cd /home/z/my-project/public/products/gallery

gen() {
  local f="$1" p="$2"
  [ -f "$f" ] && echo "SKIP $f" && return
  z-ai-generate -p "$p" -o "$f" -s 1024x1024 2>&1 | tail -1
  echo "DONE $f"
  sleep 2
}

gen "chocolate-birthday-cake-2.png" "Close-up food photography of chocolate birthday cake, chocolate ganache drip, candle lit, side angle, dark moody background, premium bakery"
gen "chocolate-birthday-cake-3.png" "Slice of chocolate birthday cake on a plate, showing layers, chocolate shavings, fork ready, warm lighting, top-down food photography"

gen "vanilla-rose-cake-2.png" "Side angle food photography of vanilla rose cake, buttercream roses detail, pastel background, soft romantic lighting, premium bakery"
gen "vanilla-rose-cake-3.png" "Slice of vanilla rose cake on a cake stand, showing rose details inside, elegant tea party setting, warm lighting"

gen "butterscotch-cake-2.png" "Close-up of butterscotch delight cake, caramel drizzle, butterscotch chips, golden lighting, side angle, artisan bakery photography"
gen "butterscotch-cake-3.png" "Butterscotch cake slice on a plate, caramel sauce dripping, praline crunch topping, top-down angle, warm amber lighting"

gen "pineapple-cake-2.png" "Side angle of pineapple party cake, pineapple cream swirls, cherry decoration, tropical vibes, bright cheerful lighting, bakery photography"
gen "pineapple-cake-3.png" "Pineapple cake slice showing layers, pineapple chunks inside, whipped cream, pastel plate, sunny lighting"

gen "red-velvet-cake-2.png" "Close-up of red velvet dream cake, cream cheese frosting swirl, red velvet texture detail, moody lighting, premium bakery"
gen "red-velvet-cake-3.png" "Red velvet cake slice, showing red layers and white cream cheese filling, dark plate, dramatic lighting"

gen "black-forest-cake-2.png" "Side angle of black forest gateau, chocolate shavings, cherries on top, whipped cream layers, German bakery style, dark lighting"
gen "black-forest-cake-3.png" "Black forest cake slice, showing chocolate sponge layers, cherry filling, cream, on a plate with fork, moody photography"

gen "fruit-cake-3.png" "Fruit cake slice showing fruit layers inside, mixed berries, cream, on a white plate, fresh and vibrant, sunny lighting"

gen "chocolate-truffle-cake-2.png" "Close-up of chocolate truffle royale cake, dark ganache mirror glaze, gold leaf accents, luxury chocolate, moody dramatic lighting"
gen "chocolate-truffle-cake-3.png" "Chocolate truffle cake slice with molten center, raspberry coulis drizzle, on a black slate plate, fine dining photography"

gen "chocolate-brownies-2.png" "Box of chocolate brownies, gift packaging, ribbon, parchment paper, warm lighting, artisan bakery gift style photography"
gen "chocolate-brownies-3.png" "Chocolate brownie square with ice cream, chocolate sauce drizzle, nuts, on a dark background, dessert photography"

gen "cupcakes-2.png" "Close-up of assorted cupcakes in a row, colorful frosting, sprinkles, pastel background, bright cheerful bakery lighting"
gen "cupcakes-3.png" "Assorted cupcakes in a gift box, ribbons, birthday party setup, festive confetti, colorful and fun photography"

gen "blueberry-muffins-2.png" "Blueberry muffins in a basket, fresh from oven, steam rising, blueberry burst, rustic bakery style, warm morning lighting"
gen "blueberry-muffins-3.png" "Torn blueberry muffin showing purple blueberry inside, crumb texture, on a linen napkin, food photography close-up"

gen "sourdough-bread-2.png" "Sliced sourdough bread, golden crust crumb texture, cutting board with butter and knife, rustic kitchen setting, warm lighting"
gen "sourdough-bread-3.png" "Sourdough bread loaf on banneton cloth, flour dusted, artisan bakery, ear pattern on crust, overhead photography"

gen "gulab-jamun-2.png" "Gulab jamun in a decorative copper bowl, sugar syrup, rose petals, saffron strands, Indian sweet shop, warm golden lighting"
gen "gulab-jamun-3.png" "Gulab jamun served on a plate with rabdi, pistachio garnish, silver foil, traditional Indian dessert, festive photography"

gen "rasmalai-2.png" "Rasmalai in a traditional brass bowl, saffron milk, pistachios, cardamom pods, Indian sweet shop, warm lighting, cultural photography"
gen "rasmalai-3.png" "Single rasmalai on a spoon, soft paneer in saffron milk, close-up food photography, garnished with dry fruits, elegant"

gen "cookies-box-2.png" "Open cookie gift box, assortment of decorated cookies, ribbon, tissue paper, gift packaging, holiday photography, warm lighting"
gen "cookies-box-3.png" "Cookie gift box wrapped with ribbon, bow, gift tag, on a wooden table, festive celebration setup, product photography"

gen "photo-print-cake-2.png" "Side angle of photo print cake, edible photo clearly visible, smooth cream sides, birthday party background, cheerful lighting"
gen "photo-print-cake-3.png" "Photo print cake being cut, slice showing layers, birthday candles, confetti, celebration moment photography"

gen "tier-wedding-cake-2.png" "Detail of 3-tier wedding cake, sugar flowers, pearl border, close-up of decoration, soft dreamy lighting, luxury wedding"
gen "tier-wedding-cake-3.png" "Wedding cake on dessert table with champagne glasses, floral arrangement, romantic venue, soft bokeh background"

gen "number-shape-cake-2.png" "Number shape cake with colorful frosting, birthday party setup, balloons in background, festive celebration, bright lighting"
gen "number-shape-cake-3.png" "Close-up of number cake detail, sprinkles texture, frosting swirls, fun birthday vibes, colorful photography"

gen "eggless-vanilla-bliss-2.png" "Eggless vanilla cake with berry compote drizzle, side angle, on a pastel plate, soft natural lighting, bakery photography"
gen "eggless-vanilla-bliss-3.png" "Vanilla cake slice with berry topping, showing moist crumb, on a cake stand, afternoon tea setting, warm lighting"

gen "eggless-chocolate-fudge-2.png" "Eggless chocolate fudge cake dripping ganache, side angle, chocolate shavings, dark moody background, premium bakery"

gen "mango-passion-cake-2.png" "Mango passion cake side angle, tropical fruit decoration, passion fruit seeds, mango carving, bright tropical lighting"
gen "mango-passion-cake-3.png" "Mango passion cake slice, showing mango mousse layers, passion fruit curd, on a white plate, sunny vibrant photography"

gen "strawberry-shortcake-2.png" "Strawberry shortcake side angle, layers visible, strawberry decoration, whipped cream swirls, garden party setting"
gen "strawberry-shortcake-3.png" "Strawberry shortcake slice on a plate, fresh strawberry fan, dusted with powdered sugar, warm afternoon lighting"

gen "eggless-pineapple-cake-3.png" "Eggless pineapple cake slice, showing fluffy eggless texture, pineapple chunks, on a pastel plate, bakery photography"

gen "walnut-brownies-2.png" "Walnut brownies stacked, chocolate drizzle, walnut halves on top, on parchment paper, rustic dark background, bakery"
gen "walnut-brownies-3.png" "Walnut brownie cross section, showing walnuts inside, fudgy texture, with coffee cup, cozy cafe photography"

gen "blondie-bars-2.png" "Golden blondie bars arranged, white chocolate chunks visible, butter shine, on a marble surface, warm golden hour lighting"
gen "blondie-bars-3.png" "Blondie bar broken in half, showing gooey caramel center, on a wooden board, with vanilla ice cream, dessert photography"

gen "garlic-focaccia-2.png" "Torn garlic focaccia, showing airy crumb, rosemary, garlic cloves, olive oil glistening, wooden board, Italian kitchen"
gen "garlic-focaccia-3.png" "Garlic focaccia flat lay, whole loaf with herb toppings, sea salt, olive oil, rustic Italian bakery style, warm lighting"

gen "multigrain-loaf-2.png" "Multigrain bread slices fanned out, showing mixed seeds, flax, sunflower, on a linen cloth, whole grain bread photography"

gen "choc-chip-cookies-2.png" "Chocolate chip cookies cooling on rack, fresh from oven, chocolate melting, steam rising, cozy bakery photography"
gen "choc-chip-cookies-3.png" "Cookie dough ball and baked cookie side by side, chocolate chips, on a marble surface, baking process photography"

gen "nankhatai-2.png" "Nankhatai cookies on a brass tray, with chai tea, traditional Indian setup, festive diwali vibes, warm golden lighting"
gen "nankhatai-3.png" "Nankhatai broken showing crumbly texture, cardamom, ghee richness, on a banana leaf, traditional Indian sweet photography"

echo "=== ALL GALLERY DONE ==="
