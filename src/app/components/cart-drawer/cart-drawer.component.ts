import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cart.isOpen()) {
      <!-- Overlay -->
      <div
        class="overlay"
        (click)="cart.closeCart()"
        aria-hidden="true"
      ></div>

      <!-- Drawer -->
      <div
        class="fixed right-0 top-0 bottom-0 z-[60] w-full sm:w-96 bg-white shadow-modal
          flex flex-col animate-slide-right"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 class="font-heading font-semibold text-lg">Your Bag</h2>
            <p class="text-xs text-text-muted">{{ cart.itemCount() }} item{{ cart.itemCount() !== 1 ? 's' : '' }}</p>
          </div>
          <button
            class="btn btn-ghost btn-icon"
            (click)="cart.closeCart()"
            aria-label="Close cart"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Cart items -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (cart.items().length === 0) {
            <div class="flex flex-col items-center justify-center h-full text-center py-12">
              <div class="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-5">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  class="text-text-muted" stroke-width="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 class="font-heading font-semibold text-lg mb-2">Your bag is empty</h3>
              <p class="text-text-muted text-sm mb-6">Start shopping to fill it up</p>
              <button
                class="btn btn-primary"
                (click)="cart.closeCart()"
              >
                Continue Shopping
              </button>
            </div>
          } @else {
            @for (item of cart.items(); track item.productId + item.size + item.color) {
              <div class="flex gap-4 p-3 rounded-xl bg-surface-2">
                <!-- Image -->
                <div class="w-20 h-24 rounded-lg overflow-hidden flex-none bg-surface-2">
                  <img [src]="item.image" [alt]="item.name"
                    class="w-full h-full object-cover" loading="lazy" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-text text-sm leading-snug line-clamp-2 mb-1">
                    {{ item.name }}
                  </h4>
                  @if (item.size) {
                    <p class="text-xs text-text-muted mb-1">Size: {{ item.size }}</p>
                  }

                  <!-- Price -->
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-bold text-text text-sm">
                      ₹{{ item.price.toLocaleString('en-IN') }}
                    </span>
                    @if (item.originalPrice && item.originalPrice > item.price) {
                      <span class="text-text-muted line-through text-xs">
                        ₹{{ item.originalPrice.toLocaleString('en-IN') }}
                      </span>
                    }
                  </div>

                  <!-- Quantity controls -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        class="w-8 h-7 flex items-center justify-center hover:bg-surface-2
                          text-sm transition-colors"
                        (click)="cart.updateQuantity(item.productId, item.quantity - 1, item.size, item.color)"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span class="w-8 text-center text-xs font-semibold">{{ item.quantity }}</span>
                      <button
                        class="w-8 h-7 flex items-center justify-center hover:bg-surface-2
                          text-sm transition-colors"
                        (click)="cart.updateQuantity(item.productId, item.quantity + 1, item.size, item.color)"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      class="text-error hover:text-red-700 transition-colors p-1"
                      (click)="cart.removeItem(item.productId, item.size, item.color)"
                      aria-label="Remove item"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer summary -->
        @if (cart.items().length > 0) {
          <div class="border-t border-border p-5 space-y-4">
            <!-- Savings -->
            @if (cart.savings() > 0) {
              <div class="flex items-center justify-between text-sm bg-success/10
                rounded-lg px-3 py-2">
                <span class="text-success font-medium">You're saving</span>
                <span class="text-success font-bold">₹{{ cart.savings().toLocaleString('en-IN') }}</span>
              </div>
            }

            <!-- Totals -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-muted">Subtotal</span>
                <span class="font-semibold">₹{{ cart.subtotal().toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-muted">Shipping</span>
                <span class="font-semibold text-success">
                  {{ cart.subtotal() >= 2999 ? 'Free' : '₹99' }}
                </span>
              </div>
              @if (cart.subtotal() < 2999) {
                <p class="text-xs text-primary">
                  Add ₹{{ (2999 - cart.subtotal()).toLocaleString('en-IN') }} more for free shipping
                </p>
              }
            </div>

            <div class="border-t border-border pt-3">
              <div class="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{{ totalWithShipping().toLocaleString('en-IN') }}</span>
              </div>
            </div>

            <!-- CTA buttons -->
            <button
              class="btn btn-whatsapp w-full py-3.5 text-base"
              (click)="checkoutOnWhatsApp()"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Checkout on WhatsApp
            </button>

            <button
              class="btn btn-ghost w-full text-sm text-text-muted"
              (click)="cart.clearCart()"
            >
              Clear cart
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class CartDrawerComponent {
  cart    = inject(CartService);
  private whatsApp = inject(WhatsAppService);

  totalWithShipping = computed(() => {
    const s = this.cart.subtotal();
    return s + (s >= 2999 ? 0 : 99);
  });

  checkoutOnWhatsApp(): void {
    const items = this.cart.items();
    if (items.length === 0) return;

    const lines = items
      .map((i) => `• ${i.name}${i.size ? ' (' + i.size + ')' : ''} ×${i.quantity} — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const total = this.totalWithShipping();
    const text = `Hi! I'd like to place an order:\n\n${lines}\n\nTotal: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability. Thank you!`;
    this.whatsApp.openGeneralInquiry(text);
  }
}
