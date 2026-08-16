export type CategoryStatus = 'active' | 'launching-soon';

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
  status?: CategoryStatus;
  isVirtual?: boolean;
  teaserNote?: string;
}
