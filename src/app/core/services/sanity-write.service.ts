import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SanityClient } from '@sanity/client';
import { environment } from '../../../environments/environment';

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
  private client: SanityClient | null = null;
  readonly isConfigured: boolean;

  constructor() {
    // Admin write service requires the editor-level write token
    const writeToken = (environment as any).sanityWriteToken || environment.sanityToken;
    this.isConfigured =
      !!environment.sanityProjectId &&
      environment.sanityProjectId !== 'YOUR_PROJECT_ID' &&
      !!writeToken &&
      !writeToken.startsWith('YOUR_');

    if (this.isConfigured) {
      this.client = createClient({
        projectId: environment.sanityProjectId,
        dataset: environment.sanityDataset,
        apiVersion: environment.sanityApiVersion,
        token: writeToken, // editor token required for writes
        useCdn: false,     // never use CDN for writes
      });
    }
  }

  // ── Image upload ────────────────────────────────────────────────────────────
  async uploadImage(file: File): Promise<string> {
    if (!this.client || !isPlatformBrowser(this.platformId)) {
      throw new Error('Sanity client not available');
    }
    const asset = await this.client.assets.upload('image', file, {
      filename: file.name,
    });
    return asset._id; // return asset _id for use as reference
  }

  // ── Products ────────────────────────────────────────────────────────────────
  async createProduct(data: AdminProductForm, imageAssetIds: string[]): Promise<string> {
    if (!this.client) throw new Error('Sanity not configured');

    const doc = await this.client.create({
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
    });
    return doc._id;
  }

  async fetchProductById(id: string): Promise<any> {
    if (!this.client) throw new Error('Sanity not configured');
    return this.client.fetch(
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
    if (!this.client) throw new Error('Sanity not configured');
    await this.client
      .patch(id)
      .set({
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
      })
      .commit();
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.client) throw new Error('Sanity not configured');
    await this.client.delete(id);
  }

  async fetchAdminProducts(): Promise<any[]> {
    if (!this.client) return [];
    return this.client.fetch(
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
    if (!this.client) throw new Error('Sanity not configured');
    const doc = await this.client.create({
      _type: 'category',
      name: data.name,
      slug: { _type: 'slug', current: slugify(data.name) },
      description: data.description || undefined,
      order: data.order ?? 0,
    });
    return doc._id;
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.client) throw new Error('Sanity not configured');
    await this.client.delete(id);
  }

  async fetchAdminCategories(): Promise<any[]> {
    if (!this.client) return [];
    // Deduplicate: keep only the oldest document per slug
    return this.client.fetch(
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
    if (!this.client) throw new Error('Sanity not configured');
    // Fetch ALL categories sorted oldest-first per slug
    const all: any[] = await this.client.fetch(
      `*[_type == "category"] | order(slug.current asc, _createdAt asc) {
        "id": _id, "slug": slug.current
      }`
    );
    // Group by slug: first per slug is keeper, rest are duplicates
    const keeperBySlug = new Map<string, string>(); // slug → keeper _id
    const toDelete: string[] = [];
    for (const cat of all) {
      if (!keeperBySlug.has(cat.slug)) {
        keeperBySlug.set(cat.slug, cat.id);
      } else {
        toDelete.push(cat.id);
      }
    }
    if (toDelete.length === 0) return 0;

    // Re-link products that reference any duplicate category to the keeper
    const toDeleteSet = new Set(toDelete);
    const products: any[] = await this.client.fetch(
      `*[_type == "product" && defined(category)] {
        "id": _id,
        "categoryId": category._ref
      }`
    );
    const tx = this.client.transaction();
    for (const product of products) {
      if (toDeleteSet.has(product.categoryId)) {
        // Find the keeper for this slug
        const category = all.find(c => c.id === product.categoryId);
        if (category) {
          const keeperId = keeperBySlug.get(category.slug);
          if (keeperId) {
            tx.patch(product.id, { set: { category: { _type: 'reference', _ref: keeperId } } });
          }
        }
      }
    }
    // Delete duplicate categories
    for (const id of toDelete) tx.delete(id);
    await tx.commit();
    return toDelete.length;
  }

  // ── Stats ────────────────────────────────────────────────────────────────────
  async fetchStats(): Promise<AdminStats> {
    if (!this.client) return { products: 0, categories: 0, featured: 0, outOfStock: 0 };
    const [products, categories, featured, outOfStock] = await Promise.all([
      this.client.fetch<number>(`count(*[_type == "product"])`),
      // Count unique categories (deduplicated by slug)
      this.client.fetch<number>(
        `count(*[_type == "category" && !(_id in *[_type == "category" && slug.current == ^.slug.current && _createdAt < ^._createdAt]._id)])`
      ),
      this.client.fetch<number>(`count(*[_type == "product" && isFeatured == true])`),
      this.client.fetch<number>(`count(*[_type == "product" && (stockCount == 0 || !defined(stockCount))])`),
    ]);
    return { products, categories, featured, outOfStock };
  }
}
