const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const products = await p.product.findMany({ select: { id: true, name: true, image: true } });
  
  // Map product name -> [primary image, gallery images]
  const imageMap = {
    "Chocolate Birthday Cake": { primary: "/products/chocolate-birthday-cake.png", gallery: ["/products/gallery/chocolate-birthday-cake-2.png", "/products/gallery/chocolate-birthday-cake-3.png"] },
    "Vanilla Rose Cake": { primary: "/products/vanilla-rose-cake.png", gallery: ["/products/gallery/vanilla-rose-cake-2.png", "/products/gallery/vanilla-rose-cake-3.png"] },
    "Butterscotch Delight": { primary: "/products/butterscotch-cake.png", gallery: ["/products/gallery/butterscotch-cake-2.png", "/products/gallery/butterscotch-cake-3.png"] },
    "Pineapple Party Cake": { primary: "/products/pineapple-cake.png", gallery: ["/products/gallery/pineapple-cake-2.png", "/products/gallery/pineapple-cake-3.png"] },
    "Red Velvet Dream": { primary: "/products/red-velvet-cake.png", gallery: ["/products/gallery/red-velvet-cake-2.png", "/products/gallery/red-velvet-cake-3.png"] },
    "Black Forest Gateau": { primary: "/products/black-forest-cake.png", gallery: ["/products/gallery/black-forest-cake-2.png", "/products/gallery/black-forest-cake-3.png"] },
    "Fruit Overload Cake": { primary: "/products/fruit-cake.png", gallery: ["/products/gallery/fruit-cake-2.png", "/products/gallery/fruit-cake-3.png"] },
    "Chocolate Truffle Royale": { primary: "/products/chocolate-truffle-cake.png", gallery: ["/products/gallery/chocolate-truffle-cake-2.png", "/products/gallery/chocolate-truffle-cake-3.png"] },
    "Photo Print Cake": { primary: "/products/photo-print-cake.png", gallery: ["/products/gallery/photo-print-cake-2.png", "/products/gallery/photo-print-cake-3.png"] },
    "Tier Wedding Cake": { primary: "/products/tier-wedding-cake.png", gallery: ["/products/gallery/tier-wedding-cake-2.png", "/products/gallery/tier-wedding-cake-3.png"] },
    "Number Shape Cake": { primary: "/products/number-shape-cake.png", gallery: ["/products/gallery/number-shape-cake-2.png", "/products/gallery/number-shape-cake-3.png"] },
    "Eggless Vanilla Bliss": { primary: "/products/eggless-vanilla-bliss.png", gallery: ["/products/gallery/eggless-vanilla-bliss-2.png", "/products/gallery/eggless-vanilla-bliss-3.png"] },
    "Eggless Chocolate Fudge": { primary: "/products/eggless-chocolate-fudge.png", gallery: ["/products/gallery/eggless-chocolate-fudge-2.png", "/products/gallery/eggless-chocolate-fudge-3.png"] },
    "Eggless Pineapple Cake": { primary: "/products/eggless-pineapple-cake.png", gallery: ["/products/gallery/eggless-pineapple-cake-2.png", "/products/gallery/eggless-pineapple-cake-3.png"] },
    "Classic Chocolate Brownies": { primary: "/products/chocolate-brownies.png", gallery: ["/products/gallery/chocolate-brownies-2.png", "/products/gallery/chocolate-brownies-3.png"] },
    "Walnut Brownies": { primary: "/products/walnut-brownies.png", gallery: ["/products/gallery/walnut-brownies-2.png", "/products/gallery/walnut-brownies-3.png"] },
    "Blondie Bars": { primary: "/products/blondie-bars.png", gallery: ["/products/gallery/blondie-bars-2.png", "/products/gallery/blondie-bars-3.png"] },
    "Sourdough Bread": { primary: "/products/sourdough-bread.png", gallery: ["/products/gallery/sourdough-bread-2.png", "/products/gallery/sourdough-bread-3.png"] },
    "Garlic Focaccia": { primary: "/products/garlic-focaccia.png", gallery: ["/products/gallery/garlic-focaccia-2.png", "/products/gallery/garlic-focaccia-3.png"] },
    "Multigrain Loaf": { primary: "/products/multigrain-loaf.png", gallery: ["/products/gallery/multigrain-loaf-2.png", "/products/gallery/multigrain-loaf-3.png"] },
    "Gulab Jamun (6 pcs)": { primary: "/products/gulab-jamun.png", gallery: ["/products/gallery/gulab-jamun-2.png", "/products/gallery/gulab-jamun-3.png"] },
    "Rasmalai (6 pcs)": { primary: "/products/rasmalai.png", gallery: ["/products/gallery/rasmalai-2.png", "/products/gallery/rasmalai-3.png"] },
    "Assorted Cupcakes (6 pcs)": { primary: "/products/cupcakes.png", gallery: ["/products/gallery/cupcakes-2.png", "/products/gallery/cupcakes-3.png"] },
    "Blueberry Muffins (4 pcs)": { primary: "/products/blueberry-muffins.png", gallery: ["/products/gallery/blueberry-muffins-2.png", "/products/gallery/blueberry-muffins-3.png"] },
    "Cookie Gift Box": { primary: "/products/cookies-box.png", gallery: ["/products/gallery/cookies-box-2.png", "/products/gallery/cookies-box-3.png"] },
    "Chocolate Chip Cookies": { primary: "/products/choc-chip-cookies.png", gallery: ["/products/gallery/choc-chip-cookies-2.png", "/products/gallery/choc-chip-cookies-3.png"] },
    "Nankhatai (Indian Cookies)": { primary: "/products/nankhatai.png", gallery: ["/products/gallery/nankhatai-2.png", "/products/gallery/nankhatai-3.png"] },
    "Mango Passion Cake": { primary: "/products/mango-passion-cake.png", gallery: ["/products/gallery/mango-passion-cake-2.png", "/products/gallery/mango-passion-cake-3.png"] },
    "Strawberry Shortcake": { primary: "/products/strawberry-shortcake.png", gallery: ["/products/gallery/strawberry-shortcake-2.png", "/products/gallery/strawberry-shortcake-3.png"] },
  };

  let updated = 0;
  for (const product of products) {
    const mapping = imageMap[product.name];
    if (!mapping) {
      console.log(`SKIP (no mapping): ${product.name}`);
      continue;
    }
    
    // Build images array: primary first, then gallery
    const allImages = [mapping.primary, ...mapping.gallery];
    const imagesJson = JSON.stringify(allImages);
    
    await p.product.update({
      where: { id: product.id },
      data: {
        image: mapping.primary,
        images: imagesJson,
      }
    });
    updated++;
    console.log(`OK: ${product.name} -> ${allImages.length} images`);
  }
  
  console.log(`\nUpdated ${updated} products`);
}

main().catch(console.error).finally(() => p.$disconnect());
