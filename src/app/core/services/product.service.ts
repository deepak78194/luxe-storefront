import { Injectable, inject, signal, computed } from '@angular/core';
import { SanityService } from './sanity.service';
import { Product, FilterState } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private sanity = inject(SanityService);

  // State signals
  private _products = signal<Product[]>([]);
  private _categories = signal<Category[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  private _filter = signal<FilterState>({
    category: 'all',
    minPrice: null,
    maxPrice: null,
    inStock: false,
    search: '',
    sortBy: 'newest',
  });

  // Public readonly signals
  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly filteredProducts = computed(() => {
    const f = this._filter();
    let list = this._products();

    if (f.category && f.category !== 'all') {
      list = list.filter((p) => p.categorySlug === f.category);
    }
    if (f.search.trim()) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (f.minPrice !== null) {
      list = list.filter((p) => p.price >= f.minPrice!);
    }
    if (f.maxPrice !== null) {
      list = list.filter((p) => p.price <= f.maxPrice!);
    }
    if (f.inStock) {
      list = list.filter((p) => p.inStock);
    }

    return [...list].sort((a, b) => {
      switch (f.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'popular': return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
        case 'discount': return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
        default: return 0; // newest — relies on API order
      }
    });
  });

  readonly featuredProducts = computed(() =>
    this._products().filter((p) => p.isFeatured).slice(0, 8)
  );

  readonly newArrivals = computed(() =>
    this._products().filter((p) => p.isNewArrival).slice(0, 8)
  );

  updateFilter(partial: Partial<FilterState>): void {
    this._filter.update((f) => ({ ...f, ...partial }));
  }

  resetFilter(): void {
    this._filter.set({
      category: 'all',
      minPrice: null,
      maxPrice: null,
      inStock: false,
      search: '',
      sortBy: 'newest',
    });
  }

  async loadProducts(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      if (!this.sanity.isConfigured) {
        // Sanity not yet set up — use built-in demo data
        this._products.set(DEMO_PRODUCTS);
        return;
      }
      const products = await this.sanity.fetchProducts();
      this._products.set(products.length ? products : DEMO_PRODUCTS);
    } catch (err) {
      console.error('Failed to load products:', err);
      this._error.set('Failed to load products. Using demo data.');
      this._products.set(DEMO_PRODUCTS);
    } finally {
      this._loading.set(false);
    }
  }

  async loadCategories(): Promise<void> {
    try {
      if (!this.sanity.isConfigured) {
        this._categories.set(DEMO_CATEGORIES);
        return;
      }
      const categories = await this.sanity.fetchCategories();
      this._categories.set(categories.length ? categories : DEMO_CATEGORIES);
    } catch {
      this._categories.set(DEMO_CATEGORIES);
    }
  }

  getProductBySlug(slug: string): Product | undefined {
    return this._products().find((p) => p.slug === slug);
  }

  getRelatedProducts(product: Product, limit = 4): Product[] {
    return this._products()
      .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
      .slice(0, limit);
  }
}

// ─── Demo data for development / Sanity not configured ────────────────────────
export const DEMO_CATEGORIES: Category[] = [
  { id: '1', slug: 'all', name: 'All', featured: true, order: 0 },
  { id: '2', slug: 'bags', name: 'Bags', featured: true, order: 1, productCount: 12 },
  { id: '3', slug: 'clothing', name: 'Clothing', featured: true, order: 2, productCount: 20 },
  { id: '4', slug: 'accessories', name: 'Accessories', featured: true, order: 3, productCount: 15 },
  { id: '5', slug: 'shoes', name: 'Shoes', featured: true, order: 4, productCount: 8 },
  { id: '6', slug: 'jewelry', name: 'Jewelry', featured: false, order: 5, productCount: 10 },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', slug: 'the-tote-bag-sand',
    name: 'The Tote Bag — Sand', brand: 'Luxe',
    description: 'Our signature tote crafted from premium pebbled leather. Spacious interior with magnetic closure and removable zip pouch.',
    shortDescription: 'Premium pebbled leather tote with magnetic closure',
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', alt: 'Sand tote bag front' },
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', alt: 'Sand tote bag interior' },
    ],
    category: 'Bags', categorySlug: 'bags', tags: ['tote', 'leather', 'everyday'],
    price: 4999, originalPrice: 6999, currency: 'INR', discountPercent: 29,
    inStock: true, stockCount: 8, isFeatured: true, isNewArrival: false, isBestseller: true,
    rating: 4.8, reviewCount: 124, material: 'Full-grain leather', sku: 'TOTE-SND-001',
  },
  {
    id: '2', slug: 'midi-slip-dress-ivory',
    name: 'Midi Slip Dress — Ivory', brand: 'Luxe',
    description: 'Effortlessly elegant slip dress in pure silk-satin. Adjustable spaghetti straps and a flattering bias cut.',
    shortDescription: 'Pure silk-satin bias-cut midi dress',
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', alt: 'Ivory slip dress' },
    ],
    category: 'Clothing', categorySlug: 'clothing', tags: ['dress', 'silk', 'evening'],
    price: 3499, originalPrice: 5500, currency: 'INR', discountPercent: 36,
    inStock: true, stockCount: 5, isFeatured: true, isNewArrival: true,
    rating: 4.9, reviewCount: 87, material: 'Silk-satin', sku: 'DRS-IVR-002',
    variants: [
      { id: 'v1', size: 'XS', stock: 1 },
      { id: 'v2', size: 'S', stock: 2 },
      { id: 'v3', size: 'M', stock: 2 },
      { id: 'v4', size: 'L', stock: 0 },
    ],
  },
  {
    id: '3', slug: 'gold-hoop-earrings-large',
    name: 'Gold Hoop Earrings — Large', brand: 'Luxe',
    description: '18k gold-plated oversized hoops. Lightweight and hypoallergenic.',
    shortDescription: '18k gold-plated oversized hoops',
    images: [
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80', alt: 'Gold hoop earrings' },
    ],
    category: 'Jewelry', categorySlug: 'jewelry', tags: ['gold', 'hoops', 'earrings'],
    price: 1299, originalPrice: 1999, currency: 'INR', discountPercent: 35,
    inStock: true, stockCount: 20, isFeatured: false, isNewArrival: true,
    rating: 4.7, reviewCount: 56, material: '18k gold plating', sku: 'JWL-HOP-003',
  },
  {
    id: '4', slug: 'crossbody-mini-black',
    name: 'Mini Crossbody — Black', brand: 'Luxe',
    description: 'Compact crossbody bag in smooth nappa leather with gold hardware. Fits essentials and a phone.',
    shortDescription: 'Smooth nappa leather mini crossbody, gold hardware',
    images: [
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', alt: 'Black mini crossbody' },
    ],
    category: 'Bags', categorySlug: 'bags', tags: ['crossbody', 'mini', 'leather', 'black'],
    price: 3299, currency: 'INR',
    inStock: true, stockCount: 12, isFeatured: true, isBestseller: true,
    rating: 4.6, reviewCount: 203, material: 'Nappa leather', sku: 'BAG-XBD-004',
  },
  {
    id: '5', slug: 'linen-blazer-camel',
    name: 'Linen Blazer — Camel', brand: 'Luxe',
    description: 'Single-button linen blazer with relaxed silhouette. Fully lined with satin.',
    shortDescription: 'Single-button relaxed linen blazer',
    images: [
      { url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80', alt: 'Camel linen blazer' },
    ],
    category: 'Clothing', categorySlug: 'clothing', tags: ['blazer', 'linen', 'work', 'casual'],
    price: 5999, originalPrice: 8500, currency: 'INR', discountPercent: 29,
    inStock: true, stockCount: 3, isFeatured: true, isNewArrival: false,
    rating: 4.5, reviewCount: 45, material: '100% Linen', sku: 'CLT-BLZ-005',
    variants: [
      { id: 'v1', size: 'S', stock: 1 },
      { id: 'v2', size: 'M', stock: 1 },
      { id: 'v3', size: 'L', stock: 1 },
    ],
  },
  {
    id: '6', slug: 'silk-scarf-floral',
    name: 'Silk Scarf — Floral', brand: 'Luxe',
    description: 'Hand-rolled 100% silk twill scarf. Wear it on hair, neck or bag.',
    shortDescription: '100% silk twill, hand-rolled edges',
    images: [
      { url: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8b?w=600&q=80', alt: 'Floral silk scarf' },
    ],
    category: 'Accessories', categorySlug: 'accessories', tags: ['scarf', 'silk', 'floral'],
    price: 1599, originalPrice: 2499, currency: 'INR', discountPercent: 36,
    inStock: true, stockCount: 15, isFeatured: false, isNewArrival: true,
    rating: 4.8, reviewCount: 92, material: '100% Silk twill', sku: 'ACC-SCF-006',
  },
  {
    id: '7', slug: 'leather-belt-tan',
    name: 'Leather Belt — Tan', brand: 'Luxe',
    description: 'Vegetable-tanned leather belt with antique brass buckle. Develops a rich patina over time.',
    shortDescription: 'Vegetable-tanned leather, antique brass buckle',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', alt: 'Tan leather belt' },
    ],
    category: 'Accessories', categorySlug: 'accessories', tags: ['belt', 'leather', 'tan'],
    price: 1899, currency: 'INR',
    inStock: false, stockCount: 0, isFeatured: false,
    rating: 4.4, reviewCount: 33, material: 'Vegetable-tanned leather', sku: 'ACC-BLT-007',
  },
  {
    id: '8', slug: 'strappy-heels-nude',
    name: 'Strappy Block Heels — Nude', brand: 'Luxe',
    description: 'Adjustable ankle-strap block heels in genuine suede. 7cm stable block heel for all-day comfort.',
    shortDescription: 'Suede block heels, adjustable ankle strap',
    images: [
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', alt: 'Nude strappy heels' },
    ],
    category: 'Shoes', categorySlug: 'shoes', tags: ['heels', 'suede', 'nude', 'formal'],
    price: 4299, originalPrice: 6000, currency: 'INR', discountPercent: 28,
    inStock: true, stockCount: 7, isFeatured: true, isNewArrival: false,
    rating: 4.7, reviewCount: 71, material: 'Genuine suede', sku: 'SHO-HEL-008',
    variants: [
      { id: 'v1', size: '36', stock: 1 },
      { id: 'v2', size: '37', stock: 2 },
      { id: 'v3', size: '38', stock: 2 },
      { id: 'v4', size: '39', stock: 1 },
      { id: 'v5', size: '40', stock: 1 },
    ],
  },
  {
    id: '9', slug: 'bucket-hat-black',
    name: 'Bucket Hat — Black', brand: 'Luxe',
    description: 'Structured cotton canvas bucket hat with adjustable inner band.',
    shortDescription: 'Cotton canvas structured bucket hat',
    images: [
      { url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80', alt: 'Black bucket hat' },
    ],
    category: 'Accessories', categorySlug: 'accessories', tags: ['hat', 'bucket', 'black'],
    price: 899, originalPrice: 1299, currency: 'INR', discountPercent: 31,
    inStock: true, stockCount: 30, isFeatured: false, isNewArrival: true,
    rating: 4.3, reviewCount: 48, material: 'Cotton canvas', sku: 'ACC-HAT-009',
  },
  {
    id: '10', slug: 'wide-leg-trousers-cream',
    name: 'Wide-Leg Trousers — Cream', brand: 'Luxe',
    description: 'High-rise wide-leg trousers in fluid crepe fabric. Elasticated waistband and side pockets.',
    shortDescription: 'High-rise wide-leg crepe trousers',
    images: [
      { url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80', alt: 'Cream wide leg trousers' },
    ],
    category: 'Clothing', categorySlug: 'clothing', tags: ['trousers', 'wide-leg', 'cream'],
    price: 2799, originalPrice: 3999, currency: 'INR', discountPercent: 30,
    inStock: true, stockCount: 10, isFeatured: false, isNewArrival: false,
    rating: 4.6, reviewCount: 62,
    variants: [
      { id: 'v1', size: 'XS', stock: 2 },
      { id: 'v2', size: 'S', stock: 3 },
      { id: 'v3', size: 'M', stock: 3 },
      { id: 'v4', size: 'L', stock: 2 },
    ],
    sku: 'CLT-TRS-010',
  },
  {
    id: '11', slug: 'gold-chain-necklace',
    name: 'Layered Chain Necklace — Gold', brand: 'Luxe',
    description: 'Three-layer 18k gold-plated chain necklace. Lobster clasp with adjustable length.',
    shortDescription: '18k gold-plated triple-layer chain',
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', alt: 'Gold layered necklace' },
    ],
    category: 'Jewelry', categorySlug: 'jewelry', tags: ['necklace', 'gold', 'layered'],
    price: 1799, currency: 'INR',
    inStock: true, stockCount: 25, isFeatured: false, isNewArrival: true,
    rating: 4.9, reviewCount: 110, sku: 'JWL-NCK-011',
  },
  {
    id: '12', slug: 'canvas-backpack-olive',
    name: 'Canvas Backpack — Olive', brand: 'Luxe',
    description: 'Waxed canvas backpack with leather trim. 20L capacity, padded laptop sleeve, water-resistant.',
    shortDescription: 'Waxed canvas, 20L, padded laptop sleeve',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', alt: 'Olive canvas backpack' },
    ],
    category: 'Bags', categorySlug: 'bags', tags: ['backpack', 'canvas', 'olive', 'laptop'],
    price: 5499, originalPrice: 7500, currency: 'INR', discountPercent: 27,
    inStock: true, stockCount: 6, isFeatured: true, isBestseller: true,
    rating: 4.7, reviewCount: 88, material: 'Waxed canvas', sku: 'BAG-BKP-012',
  },
];
