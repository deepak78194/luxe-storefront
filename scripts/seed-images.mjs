/**
 * seed-images.mjs
 * Downloads Unsplash images and uploads them to Sanity, then patches all
 * products that still have no images.
 *
 * Run once:  node scripts/seed-images.mjs
 * Or via:    npm run seed:images
 *
 * Requires Node 18+ (native fetch).
 */

import { createClient } from '@sanity/client';

// ── Sanity config (matches environment.ts) ──────────────────────────────────
const PROJECT_ID = '1m03669e';
const DATASET    = 'pdc1c';
const TOKEN      = process.env['SANITY_TOKEN'] ||
  'skAQWlrABpJX7Ypa4At0jLJk8A8jr0wdSp9AKzpDnaNSGdIhbWRNYKCBMiS6y4O3lDLDp8YKR1Fj56CCWyB6NgKBhF9YQwRMfCL0OSvkcP3gtRKnnhpCg5vwuA3NIrLBPsxXqHKEYm74zY7e1yq7UUceutTbFUTrlYJw83wP2PnpXztb1w2a';

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2024-01-01',
  token:     TOKEN,
  useCdn:    false,
});

// ── Curated Unsplash images per SKU (main + hover) ──────────────────────────
// Each entry: [mainPhotoId, hoverPhotoId]
// All images are from unsplash.com — free to use.
const SKU_IMAGES = {
  // Women's Fashion ──────────────────────────────────────────────────────────
  'WF-ANK-001': [
    { id: 'photo-1614252369475-531eba835eb1', alt: 'Embroidered Anarkali Suit' },
    { id: 'photo-1583391733956-6c78276477e4', alt: 'Anarkali Suit detail view' },
  ],
  'WF-SAR-001': [
    { id: 'photo-1610030469983-98e550d6193c', alt: 'Banarasi Silk Saree' },
    { id: 'photo-1553531384-cc64ac80f931',    alt: 'Banarasi Saree drape detail' },
  ],
  'WF-KUR-001': [
    { id: 'photo-1596755389378-c31d21fd1273', alt: 'Cotton Kurti & Palazzo Set' },
    { id: 'photo-1581044777550-4cfa2df4e5b8', alt: 'Kurti detail view' },
  ],
  'WF-LEH-001': [
    { id: 'photo-1583391733956-6c78276477e4', alt: 'Lehenga Choli' },
    { id: 'photo-1614252369475-531eba835eb1', alt: 'Lehenga Choli detail' },
  ],
  'WF-PAL-001': [
    { id: 'photo-1581044777550-4cfa2df4e5b8', alt: 'Palazzo Pants' },
    { id: 'photo-1596755389378-c31d21fd1273', alt: 'Palazzo Pants detail' },
  ],

  // Men's Fashion ────────────────────────────────────────────────────────────
  'MF-KUR-001': [
    { id: 'photo-1617127365659-c47fa864d8bc', alt: 'Premium Linen Kurta' },
    { id: 'photo-1507003211169-0a1dd7228f2d', alt: 'Linen Kurta detail view' },
  ],
  'MF-NJK-001': [
    { id: 'photo-1593032465175-481ac7f401a0', alt: 'Indo-Western Nehru Jacket' },
    { id: 'photo-1574201635302-388dd92a4c3f', alt: 'Nehru Jacket back view' },
  ],
  'MF-SHR-001': [
    { id: 'photo-1507003211169-0a1dd7228f2d', alt: 'Formal Shirt' },
    { id: 'photo-1617127365659-c47fa864d8bc', alt: 'Formal Shirt detail' },
  ],
  'MF-JKT-001': [
    { id: 'photo-1574201635302-388dd92a4c3f', alt: 'Casual Jacket' },
    { id: 'photo-1593032465175-481ac7f401a0', alt: 'Jacket detail' },
  ],

  // Accessories ──────────────────────────────────────────────────────────────
  'ACC-BAG-001': [
    { id: 'photo-1548036328-c9fa89d128fa', alt: 'Handcrafted Leather Tote Bag' },
    { id: 'photo-1584917865442-de89df76afd3', alt: 'Leather Tote interior detail' },
  ],
  'ACC-JEW-001': [
    { id: 'photo-1535632066927-ab7c9ab60908', alt: 'Pearl Choker Necklace Set' },
    { id: 'photo-1515562141207-7a88fb7ce338', alt: 'Pearl Necklace detail' },
  ],
  'ACC-SCF-001': [
    { id: 'photo-1584917865442-de89df76afd3', alt: 'Silk Scarf' },
    { id: 'photo-1548036328-c9fa89d128fa', alt: 'Silk Scarf draped' },
  ],
  'ACC-BLT-001': [
    { id: 'photo-1515562141207-7a88fb7ce338', alt: 'Leather Belt' },
    { id: 'photo-1535632066927-ab7c9ab60908', alt: 'Belt detail' },
  ],

  // Footwear ─────────────────────────────────────────────────────────────────
  'FW-KOL-001': [
    { id: 'photo-1543163521-1bf539c55dd2', alt: 'Kolhapuri Leather Sandals' },
    { id: 'photo-1603487742131-4160ec999306', alt: 'Kolhapuri Sandal sole detail' },
  ],
  'FW-DRB-001': [
    { id: 'photo-1542291026-7eec264c27ff', alt: 'Formal Derby Oxford Shoes' },
    { id: 'photo-1520639888713-7851133b1ed0', alt: 'Oxford shoe side profile' },
  ],
  'FW-SND-001': [
    { id: 'photo-1603487742131-4160ec999306', alt: 'Flat Sandals' },
    { id: 'photo-1543163521-1bf539c55dd2', alt: 'Sandal detail' },
  ],
  'FW-SLI-001': [
    { id: 'photo-1520639888713-7851133b1ed0', alt: 'Slip-On Shoes' },
    { id: 'photo-1542291026-7eec264c27ff', alt: 'Slip-On detail' },
  ],
};

// Fallback images by category slug for any unrecognised SKU
const CATEGORY_FALLBACK = {
  'womens-fashion':  [
    { id: 'photo-1483985988355-763728e1935b', alt: 'Women\'s fashion' },
    { id: 'photo-1469334031218-e382a71b716b', alt: 'Women\'s fashion look' },
  ],
  'mens-fashion': [
    { id: 'photo-1617127365659-c47fa864d8bc', alt: 'Men\'s fashion' },
    { id: 'photo-1507003211169-0a1dd7228f2d', alt: 'Men\'s fashion look' },
  ],
  'accessories': [
    { id: 'photo-1548036328-c9fa89d128fa', alt: 'Accessories' },
    { id: 'photo-1535632066927-ab7c9ab60908', alt: 'Accessory detail' },
  ],
  'footwear': [
    { id: 'photo-1542291026-7eec264c27ff', alt: 'Footwear' },
    { id: 'photo-1543163521-1bf539c55dd2', alt: 'Shoe detail' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
async function downloadBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LuxeStorefront/1.0 (seed script)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadToSanity(buffer, filename) {
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  });
  return asset._id;
}

// Cache: photoId → Sanity assetId (avoid re-uploading same image)
const uploadCache = new Map();

async function getAssetId(photoId, filename) {
  if (uploadCache.has(photoId)) {
    return uploadCache.get(photoId);
  }
  const url = `https://images.unsplash.com/${photoId}?w=900&q=82&auto=format&fit=max`;
  console.log(`  ↓  Downloading ${url}`);
  const buffer = await downloadBuffer(url);
  const assetId = await uploadToSanity(buffer, filename);
  uploadCache.set(photoId, assetId);
  console.log(`  ↑  Uploaded → ${assetId}`);
  return assetId;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seedImages() {
  console.log('🖼️   Seeding product images →', DATASET, '@', PROJECT_ID);

  // Fetch all products
  const products = await client.fetch(
    `*[_type == "product"] | order(_createdAt asc) {
      "id": _id,
      name,
      sku,
      "categorySlug": category->slug.current,
      "hasImages": count(images) > 0
    }`
  );

  console.log(`\n📦  Found ${products.length} products`);

  // Group by SKU so each SKU reuses the same uploaded assets
  const bySkuMap = new Map();
  for (const p of products) {
    if (!bySkuMap.has(p.sku)) bySkuMap.set(p.sku, []);
    bySkuMap.get(p.sku).push(p);
  }

  let updated = 0;
  let skipped = 0;

  for (const [sku, skuProducts] of bySkuMap) {
    const withoutImages = skuProducts.filter((p) => !p.hasImages);

    if (withoutImages.length === 0) {
      console.log(`\n  ✓  ${sku || '(no SKU)'} — all ${skuProducts.length} already have images, skipping`);
      skipped += skuProducts.length;
      continue;
    }

    // Determine which Unsplash photos to use
    const categorySlug = skuProducts[0].categorySlug ?? '';
    const photos = SKU_IMAGES[sku] ?? CATEGORY_FALLBACK[categorySlug] ?? CATEGORY_FALLBACK['accessories'];

    console.log(`\n  📌  ${sku || '(no SKU)'} — ${withoutImages.length} product(s) to update`);

    // Upload photos (cached so same asset re-used for every product with this SKU)
    const imageBlocks = [];
    for (const [i, photo] of photos.entries()) {
      const filename = `${(sku || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}.jpg`;
      try {
        const assetId = await getAssetId(photo.id, filename);
        imageBlocks.push({
          _type: 'image',
          _key: `img-${i}-${Date.now()}`,
          asset: { _type: 'reference', _ref: assetId },
          alt: photo.alt,
        });
      } catch (err) {
        console.warn(`  ⚠️  Could not upload image ${photo.id}: ${err.message}`);
      }
    }

    if (imageBlocks.length === 0) {
      console.warn(`  ✗  No images uploaded for ${sku}, skipping`);
      continue;
    }

    // Patch all products with this SKU that don't have images yet
    for (const product of withoutImages) {
      await client.patch(product.id).set({ images: imageBlocks }).commit();
      console.log(`  ✓  Patched "${product.name}" (${product.id})`);
      updated++;
    }
  }

  console.log(`\n✅  Done! ${updated} product(s) updated, ${skipped} already had images.`);
  console.log('   Reload your storefront to see product images.');
}

seedImages().catch((err) => {
  console.error('❌  seed-images failed:', err.message);
  process.exit(1);
});
