import {
  Component, Input, inject, computed, signal, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card group relative flex flex-col h-full"
      [attr.aria-label]="product.name"
    >
      <!-- Image container -->
      <div class="relative overflow-hidden aspect-[3/4] bg-surface-2">
        <img
          [src]="product.images[0]?.url"
          [alt]="product.images[0]?.alt || product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
          loading="lazy"
          decoding="async"
          width="400"
          height="533"
        />

        <!-- Second image on hover (desktop) -->
        @if (product.images[1]) {
          <img
            [src]="product.images[1].url"
            [alt]="product.images[1].alt || product.name"
            class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100
              transition-opacity duration-500"
            loading="lazy"
            decoding="async"
            width="400"
            height="533"
          />
        }

        <!-- Out of stock overlay -->
        @if (!product.inStock) {
          <div class="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span class="badge badge-out-of-stock text-sm px-4 py-2">Sold Out</span>
          </div>
        }

        <!-- Badges top-left -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          @if (product.discountPercent) {
            <span class="badge badge-discount">-{{ product.discountPercent }}%</span>
          }
          @if (product.isNewArrival) {
            <span class="badge badge-new">New</span>
          }
          @if (product.isBestseller) {
            <span class="badge badge-bestseller">Best Seller</span>
          }
        </div>

        <!-- Wishlist button -->
        <button
          class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            glass transition-all duration-200
            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
            hover:scale-110 active:scale-95"
          [class.text-red-500]="isWishlisted()"
          [class.text-text-muted]="!isWishlisted()"
          (click)="toggleWishlist($event)"
          [attr.aria-label]="isWishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
          [attr.aria-pressed]="isWishlisted()"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            [attr.fill]="isWishlisted() ? 'currentColor' : 'none'"
            stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <!-- Quick view overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-3
          translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            class="btn btn-primary w-full text-sm py-2.5"
            (click)="openQuickView($event)"
            [disabled]="!product.inStock"
            aria-label="Quick view {{ product.name }}"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Quick View
          </button>
        </div>
      </div>

      <!-- Product info -->
      <div class="flex flex-col flex-1 p-4">
        <!-- Brand -->
        @if (product.brand) {
          <span class="text-xs text-text-muted uppercase tracking-wider mb-1">{{ product.brand }}</span>
        }

        <!-- Name -->
        <h3 class="font-medium text-text text-sm md:text-base leading-snug mb-2 line-clamp-2">
          {{ product.name }}
        </h3>

        <!-- Rating -->
        @if (product.rating) {
          <div class="flex items-center gap-1.5 mb-2">
            <div class="stars" aria-label="{{ product.rating }} out of 5 stars">
              @for (star of stars(product.rating); track $index) {
                <svg width="12" height="12" viewBox="0 0 24 24"
                  [attr.fill]="star === 'full' ? 'currentColor' : (star === 'half' ? 'url(#half-star)' : 'none')"
                  stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              }
            </div>
            <span class="text-xs text-text-muted">({{ product.reviewCount }})</span>
          </div>
        }

        <!-- Price row -->
        <div class="flex items-baseline gap-2 mt-auto">
          <span class="font-bold text-text text-base md:text-lg">
            ₹{{ product.price.toLocaleString('en-IN') }}
          </span>
          @if (product.originalPrice && product.originalPrice > product.price) {
            <span class="text-text-muted line-through text-sm">
              ₹{{ product.originalPrice.toLocaleString('en-IN') }}
            </span>
            <span class="text-green-600 text-xs font-semibold">
              Save ₹{{ (product.originalPrice - product.price).toLocaleString('en-IN') }}
            </span>
          }
        </div>

        <!-- Low stock warning -->
        @if (product.inStock && product.stockCount && product.stockCount <= 5) {
          <p class="text-amber-600 text-xs font-medium mt-2">
            Only {{ product.stockCount }} left!
          </p>
        }

        <!-- Action buttons -->
        <div class="flex gap-1.5 mt-3">
          <!-- Add to cart -->
          <button
            class="btn btn-secondary flex-1 min-w-0 text-xs py-2 px-2"
            [disabled]="!product.inStock"
            (click)="addToCart($event)"
            aria-label="Add {{ product.name }} to cart"
          >
            <svg class="flex-none" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="truncate">{{ product.inStock ? 'Add to Cart' : 'Sold Out' }}</span>
          </button>

          <!-- WhatsApp order (icon-only square button) -->
          <button
            class="btn btn-whatsapp flex-none w-9 h-9 p-0 rounded-lg"
            (click)="orderOnWhatsApp($event)"
            aria-label="Order {{ product.name }} on WhatsApp"
            title="Order on WhatsApp"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private cartService     = inject(CartService);
  private wishlistService = inject(WishlistService);
  private uiState         = inject(UiStateService);
  private whatsApp        = inject(WhatsAppService);

  isWishlisted = computed(() => this.wishlistService.isWishlisted(this.product.id));

  stars(rating: number): ('full' | 'half' | 'empty')[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return 'full';
      if (i < rating) return 'half';
      return 'empty';
    });
  }

  toggleWishlist(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
  }

  openQuickView(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uiState.openQuickView(this.product);
  }

  addToCart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addItem({
      productId: this.product.id,
      name: this.product.name,
      image: this.product.images[0]?.url ?? '',
      price: this.product.price,
      originalPrice: this.product.originalPrice,
      quantity: 1,
      slug: this.product.slug,
    });
  }

  orderOnWhatsApp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.whatsApp.openOrder({
      productName: this.product.name,
      price: this.product.price,
      currency: '₹',
    });
  }
}
