import {
  Component, inject, computed, signal, HostListener, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../core/services/ui-state.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    @if (uiState.isQuickViewOpen()) {
      <!-- Backdrop -->
      <div
        class="overlay"
        (click)="uiState.closeQuickView()"
        aria-hidden="true"
      ></div>

      <!-- Modal -->
      <div
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'modal-title-' + product()?.id"
      >
        <div
          class="bg-white w-full max-w-lg md:max-w-4xl lg:max-w-5xl max-h-[85vh]
            overflow-y-auto rounded-2xl shadow-modal animate-scale-in
            scrollbar-hide"
        >
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0
            bg-white z-10">
            <div>
              <p class="text-xs text-text-muted uppercase tracking-widest">Quick View</p>
              <h2 [id]="'modal-title-' + product()?.id"
                class="font-heading font-semibold text-lg leading-tight line-clamp-1">
                {{ product()?.name }}
              </h2>
            </div>
            <button
              class="btn btn-ghost btn-icon ml-4 flex-none"
              (click)="uiState.closeQuickView()"
              aria-label="Close product view"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          @if (product(); as p) {
            <div class="grid md:grid-cols-2 gap-0">

              <!-- ── Image Gallery ──────────────────────────────── -->
              <div class="relative bg-surface-2">
                <!-- Main image -->
                <div class="aspect-[4/5] overflow-hidden p-4 flex items-center justify-center bg-surface-2">
                  <img
                    [src]="selectedImage()"
                    [alt]="p.name"
                    class="max-w-full max-h-full object-contain rounded-xl"
                    loading="eager"
                  />
                </div>

                <!-- Badges overlay -->
                <div class="absolute top-4 left-4 flex flex-col gap-2">
                  @if (p.discountPercent) {
                    <span class="badge badge-discount">-{{ p.discountPercent }}%</span>
                  }
                  @if (p.isNewArrival) {
                    <span class="badge badge-new">New Arrival</span>
                  }
                </div>

                <!-- Wishlist -->
                <button
                  class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center
                    justify-center transition-all hover:scale-110"
                  [class.text-red-500]="isWishlisted()"
                  [class.text-text-muted]="!isWishlisted()"
                  (click)="toggleWishlist()"
                  [attr.aria-label]="isWishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    [attr.fill]="isWishlisted() ? 'currentColor' : 'none'"
                    stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                <!-- Thumbnail strip -->
                @if (p.images.length > 1) {
                  <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                    @for (img of p.images; track i; let i = $index) {
                      <button
                        class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all"
                        [class.border-primary]="selectedImageIndex() === i"
                        [class.border-white]="selectedImageIndex() !== i"
                        [class.opacity-70]="selectedImageIndex() !== i"
                        (click)="selectImage(i)"
                        [attr.aria-label]="'View image ' + (i + 1)"
                      >
                        <img [src]="img.url" [alt]="img.alt" class="w-full h-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- ── Product Details ───────────────────────────── -->
              <div class="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">

                <!-- Brand & rating -->
                <div class="flex items-center justify-between">
                  @if (p.brand) {
                    <span class="text-xs text-text-muted uppercase tracking-widest font-semibold">
                      {{ p.brand }}
                    </span>
                  }
                  @if (p.rating) {
                    <div class="flex items-center gap-1.5">
                      <div class="stars">
                        @for (s of stars(p.rating); track $index) {
                          <svg width="13" height="13" viewBox="0 0 24 24"
                            [attr.fill]="s === 'full' ? 'currentColor' : 'none'"
                            stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        }
                      </div>
                      <span class="text-xs text-text-muted">{{ p.rating }} ({{ p.reviewCount }} reviews)</span>
                    </div>
                  }
                </div>

                <!-- Price -->
                <div>
                  <div class="flex items-baseline gap-3">
                    <span class="font-heading font-bold text-3xl text-text">
                      ₹{{ p.price.toLocaleString('en-IN') }}
                    </span>
                    @if (p.originalPrice && p.originalPrice > p.price) {
                      <span class="text-text-muted line-through text-lg">
                        ₹{{ p.originalPrice.toLocaleString('en-IN') }}
                      </span>
                      <span class="badge badge-discount text-sm">
                        Save ₹{{ (p.originalPrice - p.price).toLocaleString('en-IN') }}
                      </span>
                    }
                  </div>

                  @if (!p.inStock) {
                    <p class="text-error font-medium text-sm mt-1">Out of stock</p>
                  } @else if (p.stockCount && p.stockCount <= 5) {
                    <p class="text-amber-600 font-medium text-sm mt-1">
                      Only {{ p.stockCount }} left in stock — order soon
                    </p>
                  }
                </div>

                <!-- Description -->
                <p class="text-text-muted text-sm leading-relaxed">{{ p.description }}</p>

                <!-- Size selector -->
                @if (p.variants && p.variants.length > 0 && p.variants[0].size) {
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-semibold text-text">Size</span>
                      <button class="text-xs text-primary hover:underline">Size Guide</button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      @for (v of p.variants; track v.id) {
                        <button
                          class="min-w-[44px] h-9 px-3 border rounded-lg text-sm font-medium transition-all"
                          [disabled]="v.stock === 0"
                          [class.border-primary]="selectedSize() === v.size"
                          [class.bg-primary]="selectedSize() === v.size"
                          [class.text-white]="selectedSize() === v.size"
                          [class.border-border]="selectedSize() !== v.size && v.stock > 0"
                          [class.text-text]="selectedSize() !== v.size && v.stock > 0"
                          [class.border-border]="v.stock === 0"
                          [class.text-text-muted]="v.stock === 0"
                          [class.opacity-50]="v.stock === 0"
                          [class.cursor-not-allowed]="v.stock === 0"
                          [class.line-through]="v.stock === 0"
                          (click)="selectedSize.set(v.size ?? '')"
                          [attr.aria-label]="v.size + (v.stock === 0 ? ' (out of stock)' : '')"
                        >
                          {{ v.size }}
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- Quantity -->
                <div class="flex items-center gap-4">
                  <span class="text-sm font-semibold text-text">Quantity</span>
                  <div class="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      class="w-9 h-9 flex items-center justify-center hover:bg-surface-2 transition-colors"
                      (click)="decrementQty()"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span class="w-10 text-center text-sm font-semibold">{{ quantity() }}</span>
                    <button
                      class="w-9 h-9 flex items-center justify-center hover:bg-surface-2 transition-colors"
                      (click)="incrementQty()"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>

                <!-- CTA buttons -->
                <div class="flex flex-col gap-3">
                  <button
                    class="btn btn-primary w-full py-3.5 text-base"
                    [disabled]="!p.inStock"
                    (click)="addToCart(p)"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    {{ p.inStock ? 'Add to Cart' : 'Out of Stock' }}
                  </button>

                  <button
                    class="btn btn-whatsapp w-full py-3.5 text-base"
                    (click)="orderViaWhatsApp(p)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    Order on WhatsApp
                  </button>
                </div>

                <!-- Product details accordion -->
                <div class="border-t border-border pt-4 space-y-2">
                  @if (p.material) {
                    <div class="flex gap-3 text-sm">
                      <span class="text-text-muted w-28 flex-none">Material</span>
                      <span class="text-text font-medium">{{ p.material }}</span>
                    </div>
                  }
                  @if (p.sku) {
                    <div class="flex gap-3 text-sm">
                      <span class="text-text-muted w-28 flex-none">SKU</span>
                      <span class="text-text font-medium">{{ p.sku }}</span>
                    </div>
                  }
                  <div class="flex gap-3 text-sm">
                    <span class="text-text-muted w-28 flex-none">Category</span>
                    <span class="text-text font-medium">{{ p.category }}</span>
                  </div>
                </div>

                <!-- Trust badges -->
                <div class="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                  @for (badge of trustBadges; track badge.text) {
                    <div class="flex flex-col items-center gap-1.5 text-center">
                      <span class="text-xl">{{ badge.emoji }}</span>
                      <span class="text-xs text-text-muted leading-tight">{{ badge.text }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Related products -->
            @if (relatedProducts().length > 0) {
              <div class="border-t border-border p-6 md:p-8">
                <h3 class="font-heading text-xl font-semibold mb-6">You may also like</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  @for (rp of relatedProducts(); track rp.id) {
                    <app-product-card [product]="rp"></app-product-card>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
})
export class ProductModalComponent {
  uiState         = inject(UiStateService);
  private products = inject(ProductService);
  private cart     = inject(CartService);
  private wishlist  = inject(WishlistService);
  private whatsApp  = inject(WhatsAppService);

  product = this.uiState.quickViewProduct;

  selectedImageIndex = signal(0);
  selectedSize       = signal('');
  quantity           = signal(1);

  selectedImage = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.images[this.selectedImageIndex()]?.url ?? p.images[0]?.url ?? '';
  });

  isWishlisted = computed(() => {
    const p = this.product();
    return p ? this.wishlist.isWishlisted(p.id) : false;
  });

  relatedProducts = computed(() => {
    const p = this.product();
    return p ? this.products.getRelatedProducts(p, 4) : [];
  });

  readonly trustBadges = [
    { emoji: '🔒', text: 'Secure Payment' },
    { emoji: '🚚', text: 'Free Shipping ₹2,999+' },
    { emoji: '↩️', text: 'Easy Returns' },
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.uiState.closeQuickView();
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p);
  }

  incrementQty(): void {
    this.quantity.update((q) => Math.min(q + 1, 10));
  }

  decrementQty(): void {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }

  addToCart(p: Product): void {
    this.cart.addItem({
      productId: p.id,
      name: p.name,
      image: p.images[0]?.url ?? '',
      price: p.price,
      originalPrice: p.originalPrice,
      quantity: this.quantity(),
      size: this.selectedSize() || undefined,
      slug: p.slug,
    });
    this.uiState.closeQuickView();
    this.cart.openCart();
  }

  orderViaWhatsApp(p: Product): void {
    this.whatsApp.openOrder({
      productName: p.name,
      price: p.price,
      currency: '₹',
      size: this.selectedSize() || undefined,
      quantity: this.quantity(),
    });
  }

  stars(rating: number): ('full' | 'half' | 'empty')[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return 'full';
      if (i < rating) return 'half';
      return 'empty';
    });
  }
}
