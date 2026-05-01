export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
