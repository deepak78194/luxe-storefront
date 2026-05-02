/**
 * Seed script — populates the Sanity dataset with sample categories and products.
 * Run once:  node scripts/seed.mjs
 *
 * Values are taken from src/environments/environment.ts
 * ⚠️  Rotate the editor token after pushing to a public repo.
 */

import { createClient } from '@sanity/client';

// ── config (matches environment.ts) ────────────────────────────────────────
const PROJECT_ID = '1m03669e';
const DATASET    = 'pdc1c';
const TOKEN      = process.env['SANITY_TOKEN'] ||
  'skAQWlrABpJX7Ypa4At0jLJk8A8jr0wdSp9AKzpDnaNSGdIhbWRNYKCBMiS6y4O3lDLDp8YKR1Fj56CCWyB6NgKBhF9YQwRMfCL0OSvkcP3gtRKnnhpCg5vwuA3NIrLBPsxXqHKEYm74zY7e1yq7UUceutTbFUTrlYJw83wP2PnpXztb1w2a';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

// ── helpers ─────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function discount(price, original) {
  return Math.round(((original - price) / original) * 100);
}

// ── categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Women's Fashion",  description: 'Elegant kurtas, sarees, suits and western wear for women.',   order: 1 },
  { name: "Men's Fashion",    description: 'Stylish kurtas, shirts, jackets and formal wear for men.',    order: 2 },
  { name: 'Accessories',      description: 'Bags, jewellery, belts, scarves and more.',                  order: 3 },
  { name: 'Footwear',         description: 'Premium sandals, shoes and ethnic footwear.',                order: 4 },
];

// ── products (no images — add via admin or Studio) ───────────────────────────
function makeProducts(catMap) {
  return [
    // ── Women's Fashion ────────────────────────────────────────────────────
    {
      name: 'Embroidered Anarkali Suit',
      brand: 'LuxeWear',
      shortDescription: 'Hand-embroidered Anarkali suit with dupatta',
      description: 'Crafted from premium georgette fabric with intricate zari embroidery. Includes matching churidar and organza dupatta. Perfect for festive occasions and weddings.',
      price: 3999, originalPrice: 5999,
      currency: 'INR',
      stockCount: 15,
      sku: 'WF-ANK-001',
      tags: ['anarkali', 'festive', 'embroidery', 'suit'],
      material: 'Georgette with Zari embroidery',
      isFeatured: true, isNewArrival: true, isBestSeller: false,
      rating: 4.5, reviewCount: 42,
      category: catMap["Women's Fashion"],
    },
    {
      name: 'Banarasi Silk Saree',
      brand: 'HeritageLoom',
      shortDescription: 'Pure Banarasi silk saree with gold zari border',
      description: 'Handwoven pure silk Banarasi saree with traditional gold zari motifs. Comes with an unstitched blouse piece. A timeless heirloom piece for special occasions.',
      price: 8499, originalPrice: 12000,
      currency: 'INR',
      stockCount: 8,
      sku: 'WF-SAR-001',
      tags: ['saree', 'silk', 'banarasi', 'wedding', 'traditional'],
      material: 'Pure Banarasi Silk',
      isFeatured: true, isNewArrival: false, isBestSeller: true,
      rating: 4.8, reviewCount: 87,
      category: catMap["Women's Fashion"],
    },
    {
      name: 'Cotton Kurti & Palazzo Set',
      brand: 'EthnicRoots',
      shortDescription: 'Printed cotton kurti with flared palazzo',
      description: 'Comfortable block-printed cotton kurti paired with wide-legged palazzo pants. Ideal for casual outings and everyday wear. Machine washable.',
      price: 1899, originalPrice: 2800,
      currency: 'INR',
      stockCount: 30,
      sku: 'WF-KUR-001',
      tags: ['kurti', 'palazzo', 'cotton', 'casual', 'block print'],
      material: '100% Cotton',
      isFeatured: false, isNewArrival: true, isBestSeller: false,
      rating: 4.2, reviewCount: 63,
      category: catMap["Women's Fashion"],
    },

    // ── Men's Fashion ──────────────────────────────────────────────────────
    {
      name: 'Premium Linen Kurta',
      brand: 'MantraCraft',
      shortDescription: 'Slim-fit linen kurta for men',
      description: 'Breathable pure linen kurta with subtle pin-tuck detailing and mandarin collar. Perfect for casual and semi-formal occasions. Available in multiple colours.',
      price: 1599, originalPrice: 2200,
      currency: 'INR',
      stockCount: 25,
      sku: 'MF-KUR-001',
      tags: ['kurta', 'linen', 'casual', 'ethnic', 'slim fit'],
      material: '100% Pure Linen',
      isFeatured: false, isNewArrival: true, isBestSeller: false,
      rating: 4.4, reviewCount: 51,
      category: catMap["Men's Fashion"],
    },
    {
      name: 'Indo-Western Nehru Jacket',
      brand: 'RoyalThreads',
      shortDescription: 'Structured Nehru jacket in raw silk',
      description: 'Statement raw silk Nehru jacket with intricate thread embroidery at collar and pockets. Can be layered over kurta or shirt. Ideal for festive events.',
      price: 2499, originalPrice: 3500,
      currency: 'INR',
      stockCount: 18,
      sku: 'MF-NJK-001',
      tags: ['nehru jacket', 'raw silk', 'festive', 'indo-western'],
      material: 'Raw Silk',
      isFeatured: true, isNewArrival: false, isBestSeller: true,
      rating: 4.6, reviewCount: 38,
      category: catMap["Men's Fashion"],
    },

    // ── Accessories ────────────────────────────────────────────────────────
    {
      name: 'Handcrafted Leather Tote Bag',
      brand: 'ArtisanLeather',
      shortDescription: 'Full-grain leather tote with brass hardware',
      description: 'Spacious full-grain vegetable-tanned leather tote bag. Features an interior zip pocket, two slip pockets, and solid brass hardware. Ages beautifully over time.',
      price: 3499, originalPrice: 5000,
      currency: 'INR',
      stockCount: 12,
      sku: 'ACC-BAG-001',
      tags: ['tote bag', 'leather', 'handcrafted', 'women', 'accessories'],
      material: 'Full-Grain Vegetable-Tanned Leather',
      isFeatured: true, isNewArrival: false, isBestSeller: false,
      rating: 4.7, reviewCount: 29,
      category: catMap['Accessories'],
    },
    {
      name: 'Pearl Choker Necklace Set',
      brand: 'LuxeGems',
      shortDescription: 'Freshwater pearl choker with matching earrings',
      description: 'Elegant freshwater pearl choker necklace with matching drop earrings. Set in sterling silver with rhodium plating for tarnish resistance. Comes in a gift box.',
      price: 1299, originalPrice: 1800,
      currency: 'INR',
      stockCount: 22,
      sku: 'ACC-JEW-001',
      tags: ['necklace', 'pearl', 'jewellery', 'choker', 'gift'],
      material: 'Freshwater Pearl & Sterling Silver',
      isFeatured: false, isNewArrival: true, isBestSeller: true,
      rating: 4.5, reviewCount: 74,
      category: catMap['Accessories'],
    },

    // ── Footwear ───────────────────────────────────────────────────────────
    {
      name: 'Kolhapuri Leather Sandals',
      brand: 'KolhapurCraft',
      shortDescription: 'Handcrafted traditional Kolhapuri chappals',
      description: 'Authentic Kolhapuri sandals handcrafted by artisans using vegetable-tanned leather. Features traditional interlaced strap design with geometric tooling. GI-tagged craft.',
      price: 1499, originalPrice: 2200,
      currency: 'INR',
      stockCount: 20,
      sku: 'FW-KOL-001',
      tags: ['sandals', 'kolhapuri', 'handcrafted', 'leather', 'ethnic'],
      material: 'Vegetable-Tanned Cowhide Leather',
      isFeatured: false, isNewArrival: false, isBestSeller: true,
      rating: 4.3, reviewCount: 56,
      category: catMap['Footwear'],
    },
    {
      name: 'Formal Derby Oxford Shoes',
      brand: 'StepElite',
      shortDescription: 'Premium leather Derby shoes for men',
      description: 'Full-grain calf leather Derby shoes with Goodyear welt construction for durability and resolability. Leather sole with rubber heel. Includes a cotton shoe bag.',
      price: 3999, originalPrice: 5500,
      currency: 'INR',
      stockCount: 14,
      sku: 'FW-DRB-001',
      tags: ['shoes', 'formal', 'derby', 'oxford', 'leather', 'men'],
      material: 'Full-Grain Calf Leather',
      isFeatured: true, isNewArrival: false, isBestSeller: false,
      rating: 4.6, reviewCount: 33,
      category: catMap['Footwear'],
    },
  ].map((p) => ({
    ...p,
    discountPercent: discount(p.price, p.originalPrice),
    publishedAt: new Date().toISOString(),
  }));
}

// ── main ────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱  Seeding Sanity dataset:', DATASET, '@', PROJECT_ID);

  // 1. Create categories
  console.log('\n📂  Creating categories…');
  const catMap = {};
  for (const cat of CATEGORIES) {
    const doc = await client.create({
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: slugify(cat.name) },
      description: cat.description,
      order: cat.order,
    });
    catMap[cat.name] = doc._id;
    console.log(`  ✓  ${cat.name} (${doc._id})`);
  }

  // 2. Create products
  console.log('\n📦  Creating products…');
  for (const p of makeProducts(catMap)) {
    const { category: categoryId, ...fields } = p;
    const doc = await client.create({
      _type: 'product',
      ...fields,
      category: { _type: 'reference', _ref: categoryId },
      slug: { _type: 'slug', current: slugify(p.name) },
    });
    console.log(`  ✓  ${p.name} (${doc._id})`);
  }

  console.log('\n✅  Seed complete! Open your admin panel or Sanity Studio to add product images.');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
