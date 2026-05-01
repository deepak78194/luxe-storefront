export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  count?: number;
  featured?: boolean;
  order?: number;
}
