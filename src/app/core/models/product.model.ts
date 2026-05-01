export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  category: string;
  categorySlug: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  discountPercent?: number;
  inStock: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  careInstructions?: string;
}

export interface FilterState {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  search: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount';
}
