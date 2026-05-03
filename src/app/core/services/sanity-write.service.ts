import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SanityClient } from '@sanity/client';
import { environment } from '../../../environments/environment';
// NOTE: Write operations are proxied through /api/sanity-proxy (CF Pages Function).
// The SANITY_WRITE_TOKEN never reaches the browser.

export interface AdminProductForm {
  name: string;
  brand: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  stockCount: number;
  sku: string;
  material: string;
  tags: string;            // comma-separated → split into array on save
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number | null;
  reviewCount: number;
  variants: AdminVariantForm[];
}

export interface AdminVariantForm {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface AdminCategoryForm {
  name: string;
  description: string;
  order: number;
}

export interface AdminStats {
  products: number;
  categories: number;
  featured: number;
  outOfStock: number;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

@Injectable({ providedIn: 'root' })
export class SanityWriteService {
  private platformId = inject(PLATFORM_ID);

  /**
   * Read-only Sanity client with NO token — used only for admin panel queries.
   * The dataset must be public (set in sanity.io/manage → Datasets).
   * All write operations go through the server-side CF Pages Function proxy.
   */
  private readClient: SanityClient | null = null;

  readonly isConfigured: boolean;

  private readonly apiVersion = environment.sanityApiVersion;
  private readonly dataset    = environment.sanityDataset;

  constructor() {
    this.isConfigured =
      !!environment.sanityProjectId &&
      environment.sanityProjectId !== 'YOUR_PROJECT_ID';

    if (this.isConfigured) {
      this.readClient = createClient({
        projectId:  environment.sanityProjectId,
        dataset:    environment.sanityDataset,
        apiVersion: environment.sanityApiVersion,
        useCdn:     false, // always fresh data in the admin panel
        // No token — reads only, dataset must be set to public in sanity.io/manage
      });
    }
  }

  // ── Session token helpers ────────────────────────────────────────────────────

  private getSessionToken(): string {
    return isPlatformBrowser(this.platformId)
      ? (sessionStorage.getItem('admin-session-token') ?? '')
      : '';
  }

  // ── Server-side proxy helpers ────────────────────────────────────────────────

  /** Send Sanity mutations through /api/sanity-proxy (CF Pages Function). */
  private async executeMutations(mutations: unknown[]): Promise<any> {
    const path = `v${this.apiVersion}/data/mutate/${this.dataset}`;
    const resp = await fetch('/api/sanity-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': this.getSessionToken(),
      },
      body: JSON.stringify({ path, body: { mutations } }),
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => resp.statusText);
      throw new Error(`Sanity proxy error ${resp.status}: ${msg}`);
    }
    return resp.json();
  }

  /** Minimal transaction builder — collects mutations and commits as a batch via proxy. */
  private transaction() {
    const mutations: unknown[] = [];
    const tx = {
      patch: (id: string, patches: { set?: Record<string, unknown> }) => {
        mutations.push({ patch: { id, ...patches } });
        return tx;
      },
      delete: (id: string) => {
        mutations.push({ delete: { id } });
        return tx;
      },
      commit: () => this.executeMutations(mutations),
    };
    return tx;
  }

  // ── Image upload ────────────────────────────────────────────────────────────
  async uploadImage(file: File): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Image upload is only available in the browser');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files may be uploaded');
    }

    const formData = new FormData();
    formData.append('file', file);

    const resp = await fetch('/api/sanity-upload', {
      method: 'POST',
      headers: { 'X-Session-Token': this.getSessionToken() },
      body: formData,
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => resp.statusText);
      throw new Error(`Image upload failed ${resp.status}: ${msg}`);
    }
    const data = await resp.json();
    return data.document._id;
  }

  // ── Products ────────────────────────────────────────────────────────────────
  async createProduct(data: AdminProductForm, imageAssetIds: string[]): Promise<string> {
    const doc = {
      _type: 'product',
      name: data.name,
      brand: data.brand || undefined,
      slug: { _type: 'slug', current: slugify(data.name) },
      shortDescription: data.shortDescription || undefined,
      description: data.description || undefined,
      currency: 'INR',
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      discountPercent: data.discountPercent || undefined,
      stockCount: data.stockCount ?? 0,
      sku: data.sku || undefined,
      material: data.material || undefined,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      category: { _type: 'reference', _ref: data.categoryId },
      images: imageAssetIds.map((id, i) => ({
        _type: 'image',
        _key: `img-${i}-${Date.now()}`,
        asset: { _type: 'reference', _ref: id },
      })),
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      rating: data.rating || undefined,
      reviewCount: data.reviewCount ?? 0,
      publishedAt: new Date().toISOString(),
      variants: data.variants.map((v, i) => ({
        _type: 'object',
        _key: `var-${i}-${Date.now()}`,
        size: v.size || undefined,
        color: v.color || undefined,
        colorHex: v.colorHex || undefined,
        stock: v.stock ?? 0,
        sku: v.sku || undefined,
      })),
    };
    const result = await this.executeMutations([{ create: doc }]);
    return result.results?.[0]?.id ?? result.transactionId;
  }

  async fetchProductById(id: string): Promise<any> {
    if (!this.readClient) throw new Error('Sanity not configured');
    return this.readClient.fetch(
      `*[_type == "product" && _id == $id][0] {
        "id": _id,
        name,
        brand,
        shortDescription,
        description,
        price,
        originalPrice,
        discountPercent,
        stockCount,
        sku,
        material,
        tags,
        isFeatured,
        isNewArrival,
        "isBestSeller": isBestSeller,
        rating,
        reviewCount,
        "categoryId": category._ref,
        "images": images[]{ "assetId": asset._ref, "url": asset->url },
        "variants": variants[]{ size, color, colorHex, stock, sku }
      }`,
      { id }
    );
  }

  async updateProduct(id: string, data: AdminProductForm, imageAssetIds: string[]): Promise<void> {
    const patch = {
      name: data.name,
      brand: data.brand || undefined,
      slug: { _type: 'slug', current: slugify(data.name) },
      shortDescription: data.shortDescription || undefined,
      description: data.description || undefined,
      currency: 'INR',
      price: data.price,
      originalPrice: data.originalPrice || undefined,
      discountPercent: data.discountPercent || undefined,
      stockCount: data.stockCount ?? 0,
      sku: data.sku || undefined,
      material: data.material || undefined,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      category: { _type: 'reference', _ref: data.categoryId },
      images: imageAssetIds.map((assetId, i) => ({
        _type: 'image',
        _key: `img-${i}-${Date.now()}`,
        asset: { _type: 'reference', _ref: assetId },
      })),
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      rating: data.rating || undefined,
      reviewCount: data.reviewCount ?? 0,
      variants: data.variants.map((v, i) => ({
        _type: 'object',
        _key: `var-${i}-${Date.now()}`,
        size: v.size || undefined,
        color: v.color || undefined,
        colorHex: v.colorHex || undefined,
        stock: v.stock ?? 0,
        sku: v.sku || undefined,
      })),
    };
    await this.executeMutations([{ patch: { id, set: patch } }]);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.executeMutations([{ delete: { id } }]);
  }

  async fetchAdminProducts(): Promise<any[]> {
    if (!this.readClient) return [];
    return this.readClient.fetch(
      `*[_type == "product"] | order(_createdAt desc) {
        "id": _id,
        name,
        "slug": slug.current,
        price,
        stockCount,
        isFeatured,
        isNewArrival,
        "isBestseller": isBestSeller,
        "category": category->name,
        "imageUrl": images[0].asset->url,
        _createdAt
      }`
    );
  }

  // ── Categories ───────────────────────────────────────────────────────────────
  async createCategory(data: AdminCategoryForm): Promise<string> {
    const doc = {
      _type: 'category',
      name: data.name,
      slug: { _type: 'slug', current: slugify(data.name) },
      description: data.description || undefined,
      order: data.order ?? 0,
    };
    const result = await this.executeMutations([{ create: doc }]);
    return result.results?.[0]?.id ?? result.transactionId;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.executeMutations([{ delete: { id } }]);
  }

  async fetchAdminCategories(): Promise<any[]> {
    if (!this.readClient) return [];
    // Deduplicate: keep only the oldest document per slug
    return this.readClient.fetch(
      `*[_type == "category" && !(_id in *[_type == "category" && slug.current == ^.slug.current && _createdAt < ^._createdAt]._id)]
       | order(order asc, _createdAt asc) {
        "id": _id,
        name,
        "slug": slug.current,
        description,
        order,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`
    );
  }

  /** Returns the number of duplicate category documents deleted from Sanity. */
  async deduplicateCategories(): Promise<number> {
    if (!this.readClient) throw new Error('Sanity not configured');

    const all: any[] = await this.readClient.fetch(
      `*[_type == "category"] | order(slug.current asc, _createdAt asc) {
        "id": _id, "slug": slug.current
      }`
    );
    const keeperBySlug = new Map<string, string>();
    const toDelete: string[] = [];
    for (const cat of all) {
      if (!keeperBySlug.has(cat.slug)) {
        keeperBySlug.set(cat.slug, cat.id);
      } else {
        toDelete.push(cat.id);
      }
    }
    if (toDelete.length === 0) return 0;

    const toDeleteSet = new Set(toDelete);
    const products: any[] = await this.readClient.fetch(
      `*[_type == "product" && defined(category)] {
        "id": _id,
        "categoryId": category._ref
      }`
    );
    const tx = this.transaction();
    for (const product of products) {
      if (toDeleteSet.has(product.categoryId)) {
        const category = all.find((c) => c.id === product.categoryId);
        if (category) {
          const keeperId = keeperBySlug.get(category.slug);
          if (keeperId) {
            tx.patch(product.id, { set: { category: { _type: 'reference', _ref: keeperId } } });
          }
        }
      }
    }
    for (const id of toDelete) tx.delete(id);
    await tx.commit();
    return toDelete.length;
  }

  // ── Stats ────────────────────────────────────────────────────────────────────
  async fetchStats(): Promise<AdminStats> {
    if (!this.readClient) return { products: 0, categories: 0, featured: 0, outOfStock: 0 };
    const [products, categories, featured, outOfStock] = await Promise.all([
      this.readClient.fetch<number>(`count(*[_type == "product"])`),
      this.readClient.fetch<number>(
        `count(*[_type == "category" && !(_id in *[_type == "category" && slug.current == ^.slug.current && _createdAt < ^._createdAt]._id)])`
      ),
      this.readClient.fetch<number>(`count(*[_type == "product" && isFeatured == true])`),
      this.readClient.fetch<number>(`count(*[_type == "product" && (stockCount == 0 || !defined(stockCount))])`),
    ]);
    return { products, categories, featured, outOfStock };
  }
}
