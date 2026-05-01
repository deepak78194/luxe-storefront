import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  // Quick-view modal
  private _quickViewProduct = signal<Product | null>(null);
  readonly quickViewProduct = this._quickViewProduct.asReadonly();
  readonly isQuickViewOpen = computed(() => this._quickViewProduct() !== null);

  openQuickView(product: Product): void {
    this._quickViewProduct.set(product);
    if (typeof document !== 'undefined') {
      document.body.classList.add('overflow-hidden');
    }
  }

  closeQuickView(): void {
    this._quickViewProduct.set(null);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Filter drawer (mobile)
  private _filterDrawerOpen = signal(false);
  readonly filterDrawerOpen = this._filterDrawerOpen.asReadonly();

  openFilterDrawer(): void { this._filterDrawerOpen.set(true); }
  closeFilterDrawer(): void { this._filterDrawerOpen.set(false); }
  toggleFilterDrawer(): void { this._filterDrawerOpen.update((v) => !v); }

  // Mobile nav
  private _mobileNavOpen = signal(false);
  readonly mobileNavOpen = this._mobileNavOpen.asReadonly();

  openMobileNav(): void { this._mobileNavOpen.set(true); }
  closeMobileNav(): void { this._mobileNavOpen.set(false); }
  toggleMobileNav(): void { this._mobileNavOpen.update((v) => !v); }
}
