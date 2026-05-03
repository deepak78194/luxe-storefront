import { Injectable } from '@angular/core';
import { createClient, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Testimonial } from '../models/testimonial.model';

@Injectable({ providedIn: 'root' })
export class SanityService {
  private client: SanityClient | null = null;
  private builder: ReturnType<typeof imageUrlBuilder> | null = null;
  readonly isConfigured: boolean;

  constructor() {
    // Only initialise if a real project ID and token have been set
    this.isConfigured =
      !!environment.sanityProjectId &&
      environment.sanityProjectId !== 'YOUR_PROJECT_ID';

    if (this.isConfigured) {
      this.client = createClient({
        projectId: environment.sanityProjectId,
        dataset: environment.sanityDataset,
        apiVersion: environment.sanityApiVersion,
        useCdn: environment.production,
        // No token — the dataset must be set to "public" in sanity.io/manage → Datasets.
        // A token here would be visible in every browser network request.
      });
      this.builder = imageUrlBuilder(this.client);
    }
  }

  imageUrl(source: any, width = 800, height?: number): string {
    if (!this.builder) return '';
    let img = this.builder.image(source).width(width).format('webp').quality(85);
    if (height) img = img.height(height);
    return img.url();
  }

  async fetchProducts(): Promise<Product[]> {
    if (!this.client) return [];
    const query = `*[_type == "product"] | order(_createdAt desc) {
      "id": _id,
      "slug": slug.current,
      name,
      brand,
      description,
      shortDescription,
      "images": images[]{
        "url": asset->url + "?auto=format&w=800&fit=max",
        "thumbUrl": asset->url + "?auto=format&w=400&fit=max",
        alt,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      },
      "category": category->name,
      "categorySlug": category->slug.current,
      tags,
      price,
      originalPrice,
      currency,
      discountPercent,
      "inStock": stockCount > 0,
      stockCount,
      variants,
      isFeatured,
      isNewArrival,
      "isBestseller": isBestSeller,
      rating,
      reviewCount,
      sku,
      material
    }`;

    return this.client.fetch<Product[]>(query);
  }

  async fetchCategories(): Promise<Category[]> {
    if (!this.client) return [];
    const query = `*[_type == "category"] | order(order asc) {
      "id": _id,
      "slug": slug.current,
      name,
      description,
      "image": image.asset->url,
      "productCount": count(*[_type == "product" && references(^._id)]),
      featured,
      order
    }`;

    return this.client.fetch<Category[]>(query);
  }

  async fetchTestimonials(): Promise<Testimonial[]> {
    if (!this.client) return [];
    const query = `*[_type == "testimonial"] | order(_createdAt desc)[0..9] {
      "id": _id,
      name,
      handle,
      "avatar": avatar.asset->url,
      rating,
      text,
      product,
      date,
      verified
    }`;

    return this.client.fetch<Testimonial[]>(query);
  }
}
