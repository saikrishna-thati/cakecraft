#!/bin/bash
# Generate all product images in parallel batches
cd /home/z/my-project/public/products

generate() {
  local name="$1"
  local file="$2"
  local prompt="$3"
  if [ -f "$file" ]; then
    echo "SKIP: $file exists"
    return
  fi
  z-ai-generate -p "$prompt" -o "$file" -s 1024x1024 2>&1 | tail -1
}

# ===== UNIQUE PRIMARY IMAGES for products that share =====
# 1. Photo Print Cake (shares chocolate-birthday-cake)
generate "Photo Print Cake" "photo-print-cake.png" "Professional food photography of a custom photo print cake, edible photo image on white cream frosting, birthday celebration cake on white marble plate, studio lighting, top-down angle, premium bakery style, 8k quality" &

# 2. Tier Wedding Cake (shares vanilla-rose)
generate "Tier Wedding Cake" "tier-wedding-cake.png" "Professional food photography of an elegant 3-tier wedding cake with white buttercream roses, pearl accents, gold leaf details, on a crystal cake stand, soft romantic lighting, luxury bakery, 8k quality" &

# 3. Number Shape Cake (shares butterscotch)
generate "Number Shape Cake" "number-shape-cake.png" "Professional food photography of a number 25 birthday cake shaped like the number 25, colorful sprinkles, butterscotch cream frosting, birthday candles, festive celebration, studio lighting, 8k quality" &

# 4. Eggless Vanilla Bliss (shares pineapple)
generate "Eggless Vanilla Bliss" "eggless-vanilla-bliss.png" "Professional food photography of a moist eggless vanilla cake, layered with vanilla buttercream, topped with fresh berries, on a pastel plate, soft lighting, artisan bakery style, 8k quality" &

# 5. Eggless Chocolate Fudge (shares chocolate-birthday)
generate "Eggless Chocolate Fudge" "eggless-chocolate-fudge.png" "Professional food photography of a rich eggless chocolate fudge cake, dark ganache dripping, chocolate shavings, on a dark slate plate, moody lighting, premium bakery, 8k quality" &

# 6. Mango Passion Cake (shares fruit-cake)
generate "Mango Passion Cake" "mango-passion-cake.png" "Professional food photography of a tropical mango passion fruit cake, yellow mango glaze dripping, fresh mango slices on top, green mint leaves, bright sunny lighting, 8k quality" &

# 7. Strawberry Shortcake (shares vanilla-rose)
generate "Strawberry Shortcake" "strawberry-shortcake.png" "Professional food photography of a classic strawberry shortcake, fluffy vanilla sponge, whipped cream layers, fresh red strawberries, on a vintage cake stand, warm lighting, 8k quality" &

# 8. Eggless Pineapple Cake (shares pineapple)
generate "Eggless Pineapple Cake" "eggless-pineapple-cake.png" "Professional food photography of an eggless pineapple cake, pineapple cream frosting, cherry on top, tropical pineapple slices, on a white plate, bright lighting, bakery style, 8k quality" &

# 9. Walnut Brownies (shares chocolate-brownies)
generate "Walnut Brownies" "walnut-brownies.png" "Professional food photography of walnut brownies, dark chocolate with walnut pieces, cross section showing fudgy center, on a wooden board, warm lighting, bakery style, 8k quality" &

# 10. Blondie Bars (shares chocolate-brownies)
generate "Blondie Bars" "blondie-bars.png" "Professional food photography of golden blondie bars, white chocolate chunks, stacked on a rustic wooden board, warm amber lighting, artisan bakery style, 8k quality" &

# 11. Garlic Focaccia (shares sourdough)
generate "Garlic Focaccia" "garlic-focaccia.png" "Professional food photography of garlic herb focaccia bread, golden crust, rosemary and garlic on top, olive oil drizzle, on a rustic cutting board, warm lighting, Italian bakery style, 8k quality" &

# 12. Multigrain Loaf (shares sourdough)
generate "Multigrain Loaf" "multigrain-loaf.png" "Professional food photography of a multigrain bread loaf, sliced showing seeds and grains, on a linen cloth, warm rustic lighting, artisan bakery style, 8k quality" &

# 13. Chocolate Chip Cookies (shares cookies-box)
generate "Chocolate Chip Cookies" "choc-chip-cookies.png" "Professional food photography of freshly baked chocolate chip cookies, melting chocolate chips, stacked on a plate, warm golden lighting, milk and cookies setup, 8k quality" &

# 14. Nankhatai (shares cookies-box)
generate "Nankhatai" "nankhatai.png" "Professional food photography of traditional Indian nankhatai cookies, golden brown, topped with pistachios and cardamom, on a brass plate, warm lighting, Indian bakery style, 8k quality" &

wait
echo "=== PRIMARY IMAGES DONE ==="

# ===== GALLERY ANGLES for each unique product =====
mkdir -p gallery

generate_angle() {
  local file="$1"
  local prompt="$2"
  if [ -f "gallery/$file" ]; then
    echo "SKIP: gallery/$file exists"
    return
  fi
  z-ai-generate -p "$prompt" -o "gallery/$file" -s 1024x1024 2>&1 | tail -1
}

# Chocolate Birthday Cake - angle 2 & 3
generate_angle "chocolate-birthday-cake-2.png" "Close-up food photography of chocolate birthday cake, chocolate ganache drip, candle lit, side angle, dark moody background, premium bakery" &
generate_angle "chocolate-birthday-cake-3.png" "Slice of chocolate birthday cake on a plate, showing layers, chocolate shavings, fork ready, warm lighting, top-down food photography" &

# Vanilla Rose Cake
generate_angle "vanilla-rose-cake-2.png" "Side angle food photography of vanilla rose cake, buttercream roses detail, pastel background, soft romantic lighting, premium bakery" &
generate_angle "vanilla-rose-cake-3.png" "Slice of vanilla rose cake on a cake stand, showing rose details inside, elegant tea party setting, warm lighting" &

# Butterscotch Cake
generate_angle "butterscotch-cake-2.png" "Close-up of butterscotch delight cake, caramel drizzle, butterscotch chips, golden lighting, side angle, artisan bakery photography" &
generate_angle "butterscotch-cake-3.png" "Butterscotch cake slice on a plate, caramel sauce dripping, praline crunch topping, top-down angle, warm amber lighting" &

# Pineapple Cake
generate_angle "pineapple-cake-2.png" "Side angle of pineapple party cake, pineapple cream swirls, cherry decoration, tropical vibes, bright cheerful lighting, bakery photography" &
generate_angle "pineapple-cake-3.png" "Pineapple cake slice showing layers, pineapple chunks inside, whipped cream, on a pastel plate, sunny lighting" &

# Red Velvet
generate_angle "red-velvet-cake-2.png" "Close-up of red velvet dream cake, cream cheese frosting swirl, red velvet texture detail, moody lighting, premium bakery" &
generate_angle "red-velvet-cake-3.png" "Red velvet cake slice, showing red layers and white cream cheese filling, on a dark plate, dramatic lighting" &

# Black Forest
generate_angle "black-forest-cake-2.png" "Side angle of black forest gateau, chocolate shavings, cherries on top, whipped cream layers, German bakery style, dark lighting" &
generate_angle "black-forest-cake-3.png" "Black forest cake slice, showing chocolate sponge layers, cherry filling, cream, on a plate with fork, moody photography" &

# Fruit Overload Cake
generate_angle "fruit-cake-2.png" "Top angle of fruit overload cake, colorful fresh fruits arrangement, kiwi, strawberry, blueberry, orange segments, bright lighting, fruit paradise" &
generate_angle "fruit-cake-3.png" "Fruit cake slice showing fruit layers inside, mixed berries, cream, on a white plate, fresh and vibrant, sunny lighting" &

# Chocolate Truffle
generate_angle "chocolate-truffle-cake-2.png" "Close-up of chocolate truffle royale cake, dark ganache mirror glaze, gold leaf accents, luxury chocolate, moody dramatic lighting" &
generate_angle "chocolate-truffle-cake-3.png" "Chocolate truffle cake slice with molten center, raspberry coulis drizzle, on a black slate plate, fine dining photography" &

# Classic Brownies
generate_angle "chocolate-brownies-2.png" "Box of chocolate brownies, gift packaging, ribbon, parchment paper, warm lighting, artisan bakery gift style photography" &
generate_angle "chocolate-brownies-3.png" "Chocolate brownie square with ice cream, chocolate sauce drizzle, nuts, on a dark background, dessert photography" &

# Cupcakes
generate_angle "cupcakes-2.png" "Close-up of assorted cupcakes in a row, colorful frosting, sprinkles, pastel background, bright cheerful bakery lighting" &
generate_angle "cupcakes-3.png" "Assorted cupcakes in a gift box, ribbons, birthday party setup, festive confetti, colorful and fun photography" &

# Blueberry Muffins
generate_angle "blueberry-muffins-2.png" "Blueberry muffins in a basket, fresh from oven, steam rising, blueberry burst, rustic bakery style, warm morning lighting" &
generate_angle "blueberry-muffins-3.png" "Torn blueberry muffin showing purple blueberry inside, crumb texture, on a linen napkin, food photography close-up" &

# Sourdough
generate_angle "sourdough-bread-2.png" "Sliced sourdough bread, golden crust crumb texture, on a cutting board with butter and knife, rustic kitchen setting, warm lighting" &
generate_angle "sourdough-bread-3.png" "Sourdough bread loaf on banneton cloth, flour dusted, artisan bakery, ear pattern on crust, overhead photography" &

# Gulab Jamun
generate_angle "gulab-jamun-2.png" "Gulab jamun in a decorative copper bowl, sugar syrup, rose petals, saffron strands, Indian sweet shop, warm golden lighting" &
generate_angle "gulab-jamun-3.png" "Gulab jamun served on a plate with rabdi, pistachio garnish, silver foil, traditional Indian dessert, festive photography" &

# Rasmalai
generate_angle "rasmalai-2.png" "Rasmalai in a traditional brass bowl, saffron milk, pistachios, cardamom pods, Indian sweet shop, warm lighting, cultural photography" &
generate_angle "rasmalai-3.png" "Single rasmalai on a spoon, soft paneer in saffron milk, close-up food photography, garnished with dry fruits, elegant" &

# Cookie Gift Box
generate_angle "cookies-box-2.png" "Open cookie gift box, assortment of decorated cookies, ribbon, tissue paper, gift packaging, holiday photography, warm lighting" &
generate_angle "cookies-box-3.png" "Cookie gift box wrapped with ribbon, bow, gift tag, on a wooden table, festive celebration setup, product photography" &

# Photo Print Cake
generate_angle "photo-print-cake-2.png" "Side angle of photo print cake, edible photo clearly visible, smooth cream sides, birthday party background, cheerful lighting" &
generate_angle "photo-print-cake-3.png" "Photo print cake being cut, slice showing layers, birthday candles, confetti, celebration moment photography" &

# Tier Wedding Cake
generate_angle "tier-wedding-cake-2.png" "Detail of 3-tier wedding cake, sugar flowers, pearl border, close-up of decoration, soft dreamy lighting, luxury wedding" &
generate_angle "tier-wedding-cake-3.png" "Wedding cake on dessert table with champagne glasses, floral arrangement, romantic venue, soft bokeh background" &

# Number Shape Cake
generate_angle "number-shape-cake-2.png" "Number shape cake with colorful frosting, birthday party setup, balloons in background, festive celebration, bright lighting" &
generate_angle "number-shape-cake-3.png" "Close-up of number cake detail, sprinkles texture, frosting swirls, fun birthday vibes, colorful photography" &

# Eggless Vanilla Bliss
generate_angle "eggless-vanilla-bliss-2.png" "Eggless vanilla cake with berry compote drizzle, side angle, on a pastel plate, soft natural lighting, bakery photography" &
generate_angle "eggless-vanilla-bliss-3.png" "Vanilla cake slice with berry topping, showing moist crumb, on a cake stand, afternoon tea setting, warm lighting" &

# Eggless Chocolate Fudge
generate_angle "eggless-chocolate-fudge-2.png" "Eggless chocolate fudge cake dripping ganache, side angle, chocolate shavings, dark moody background, premium bakery" &
generate_angle "eggless-chocolate-fudge-3.png" "Eggless chocolate fudge slice, showing dense fudgy texture, cocoa powder dust, on a dark plate, dramatic lighting" &

# Mango Passion
generate_angle "mango-passion-cake-2.png" "Mango passion cake side angle, tropical fruit decoration, passion fruit seeds, mango carving, bright tropical lighting" &
generate_angle "mango-passion-cake-3.png" "Mango passion cake slice, showing mango mousse layers, passion fruit curd, on a white plate, sunny vibrant photography" &

# Strawberry Shortcake
generate_angle "strawberry-shortcake-2.png" "Strawberry shortcake side angle, layers visible, strawberry decoration, whipped cream swirls, garden party setting" &
generate_angle "strawberry-shortcake-3.png" "Strawberry shortcake slice on a plate, fresh strawberry fan, dusted with powdered sugar, warm afternoon lighting" &

# Eggless Pineapple
generate_angle "eggless-pineapple-cake-2.png" "Eggless pineapple cake side view, pineapple frosting detail, tropical vibe, on a white cake stand, bright lighting" &
generate_angle "eggless-pineapple-cake-3.png" "Eggless pineapple cake slice, showing fluffy eggless texture, pineapple chunks, on a pastel plate, bakery photography" &

# Walnut Brownies
generate_angle "walnut-brownies-2.png" "Walnut brownies stacked, chocolate drizzle, walnut halves on top, on parchment paper, rustic dark background, bakery" &
generate_angle "walnut-brownies-3.png" "Walnut brownie cross section, showing walnuts inside, fudgy texture, with coffee cup, cozy cafe photography" &

# Blondie Bars
generate_angle "blondie-bars-2.png" "Golden blondie bars arranged, white chocolate chunks visible, butter shine, on a marble surface, warm golden hour lighting" &
generate_angle "blondie-bars-3.png" "Blondie bar broken in half, showing gooey caramel center, on a wooden board, with vanilla ice cream, dessert photography" &

# Garlic Focaccia
generate_angle "garlic-focaccia-2.png" "Torn garlic focaccia, showing airy crumb, rosemary, garlic cloves, olive oil glistening, on a wooden board, Italian kitchen" &
generate_angle "garlic-focaccia-3.png" "Garlic focaccia flat lay, whole loaf with herb toppings, sea salt, olive oil, rustic Italian bakery style, warm lighting" &

# Multigrain Loaf
generate_angle "multigrain-loaf-2.png" "Multigrain bread slices fanned out, showing mixed seeds, flax, sunflower, on a linen cloth, whole grain bread photography" &
generate_angle "multigrain-loaf-3.png" "Multigrain bread loaf whole, scored top, golden crust, on a bread board with butter, rustic farmhouse kitchen setting" &

# Chocolate Chip Cookies
generate_angle "choc-chip-cookies-2.png" "Chocolate chip cookies cooling on rack, fresh from oven, chocolate melting, steam rising, cozy bakery photography" &
generate_angle "choc-chip-cookies-3.png" "Cookie dough ball and baked cookie side by side, chocolate chips, on a marble surface, baking process photography" &

# Nankhatai
generate_angle "nankhatai-2.png" "Nankhatai cookies on a brass tray, with chai tea, traditional Indian setup, festive diwali vibes, warm golden lighting" &
generate_angle "nankhatai-3.png" "Nankhatai broken showing crumbly texture, cardamom, ghee richness, on a banana leaf, traditional Indian sweet photography" &

wait
echo "=== ALL GALLERY IMAGES DONE ==="
