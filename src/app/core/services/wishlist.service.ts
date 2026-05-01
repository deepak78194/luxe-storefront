import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly STORAGE_KEY = 'luxe_wishlist';

  private _ids = signal<Set<string>>(new Set(this.loadFromStorage()));

  readonly ids = computed(() => this._ids());
  readonly count = computed(() => this._ids().size);

  isWishlisted(productId: string): boolean {
    return this._ids().has(productId);
  }

  toggle(product: Product): void {
    this._ids.update((ids) => {
      const next = new Set(ids);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      this.saveToStorage(next);
      return next;
    });
  }

  private loadFromStorage(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(ids: Set<string>): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...ids]));
    } catch {}
  }
}
