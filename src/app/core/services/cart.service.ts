import { Injectable, signal, computed } from '@angular/core';
import { CartItem, CartState } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'luxe_cart';

  private _state = signal<CartState>({
    items: this.loadFromStorage(),
    isOpen: false,
  });

  readonly items = computed(() => this._state().items);
  readonly isOpen = computed(() => this._state().isOpen);
  readonly itemCount = computed(() =>
    this._state().items.reduce((sum, i) => sum + i.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this._state().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  readonly savings = computed(() =>
    this._state().items.reduce((sum, i) =>
      sum + ((i.originalPrice ?? i.price) - i.price) * i.quantity, 0)
  );

  addItem(item: CartItem): void {
    this._state.update((s) => {
      const existing = s.items.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );
      const updatedItems = existing
        ? s.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        : [...s.items, item];
      this.saveToStorage(updatedItems);
      return { ...s, items: updatedItems };
    });
  }

  removeItem(productId: string, size?: string, color?: string): void {
    this._state.update((s) => {
      const updatedItems = s.items.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color)
      );
      this.saveToStorage(updatedItems);
      return { ...s, items: updatedItems };
    });
  }

  updateQuantity(productId: string, quantity: number, size?: string, color?: string): void {
    if (quantity <= 0) {
      this.removeItem(productId, size, color);
      return;
    }
    this._state.update((s) => {
      const updatedItems = s.items.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      );
      this.saveToStorage(updatedItems);
      return { ...s, items: updatedItems };
    });
  }

  clearCart(): void {
    this.saveToStorage([]);
    this._state.update((s) => ({ ...s, items: [] }));
  }

  toggleCart(): void {
    this._state.update((s) => ({ ...s, isOpen: !s.isOpen }));
  }

  openCart(): void {
    this._state.update((s) => ({ ...s, isOpen: true }));
  }

  closeCart(): void {
    this._state.update((s) => ({ ...s, isOpen: false }));
  }

  private loadFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota exceeded or SSR
    }
  }
}
