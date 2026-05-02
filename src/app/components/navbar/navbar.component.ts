import {
  Component, inject, signal, computed, HostListener, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Skip to main -->
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2
      bg-primary text-white px-4 py-2 rounded z-[100]">
      Skip to main content
    </a>

    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.glass]="scrolled() || mobileNavOpen()"
      [class.bg-transparent]="!scrolled() && !mobileNavOpen()"
      [class.shadow-glass]="scrolled()"
    >
      <div class="container-luxe">
        <nav class="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">

          <!-- Logo -->
          <a href="#" class="flex items-center gap-2 group" aria-label="Luxe Storefront home">
            <div class="w-8 h-8 rounded-full bg-gradient-luxury flex items-center justify-center
              shadow-md group-hover:shadow-lg transition-shadow">
              <span class="text-white font-bold text-sm font-heading">L</span>
            </div>
            <span class="font-heading font-bold text-xl tracking-tight text-text
              group-hover:text-primary transition-colors">
              Luxe
            </span>
          </a>

          <!-- Desktop nav links -->
          <ul class="hidden md:flex items-center gap-8" role="list">
            @for (link of navLinks; track link.label) {
              <li>
                <a
                  [href]="link.href"
                  class="text-sm font-medium text-text-muted hover:text-primary
                    transition-colors relative group"
                >
                  {{ link.label }}
                  <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary
                    rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            }
          </ul>

          <!-- Desktop actions -->
          <div class="hidden md:flex items-center gap-2">
            <!-- Search -->
            <button
              class="btn btn-ghost btn-icon relative"
              (click)="toggleSearch()"
              aria-label="Search"
              [attr.aria-expanded]="searchOpen()"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <!-- Wishlist -->
            <button
              class="btn btn-ghost btn-icon relative"
              aria-label="Wishlist"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              @if (wishlistCount() > 0) {
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px]
                  font-bold rounded-full flex items-center justify-center">
                  {{ wishlistCount() }}
                </span>
              }
            </button>

            <!-- Cart -->
            <button
              class="btn btn-ghost btn-icon relative"
              (click)="cartService.openCart()"
              aria-label="Shopping cart"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              @if (cartCount() > 0) {
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px]
                  font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {{ cartCount() }}
                </span>
              }
            </button>

            <!-- WhatsApp CTA -->
            <a
              [href]="'https://wa.me/' + waPhone + '?text=Hi! I want to browse your collection.'"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp text-sm px-4 py-2 ml-2"
              aria-label="Chat on WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Chat
            </a>
          </div>

          <!-- Mobile actions -->
          <div class="flex md:hidden items-center gap-1">
            <!-- Cart -->
            <button
              class="btn btn-ghost btn-icon relative"
              (click)="cartService.openCart()"
              aria-label="Cart"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              @if (cartCount() > 0) {
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px]
                  font-bold rounded-full flex items-center justify-center">
                  {{ cartCount() }}
                </span>
              }
            </button>

            <!-- Hamburger -->
            <button
              class="btn btn-ghost btn-icon"
              (click)="uiState.toggleMobileNav()"
              [attr.aria-expanded]="mobileNavOpen()"
              aria-label="Toggle navigation"
            >
              @if (mobileNavOpen()) {
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              } @else {
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              }
            </button>
          </div>
        </nav>

        <!-- Search bar (desktop) -->
        @if (searchOpen()) {
          <div class="hidden md:block pb-4 animate-slide-down">
            <div class="relative max-w-xl mx-auto">
              <input
                #searchInput
                type="search"
                class="input pr-12 text-base"
                placeholder="Search bags, dresses, accessories…"
                [value]="searchQuery()"
                (input)="onSearch($event)"
                (keydown.escape)="closeSearch()"
                aria-label="Search products"
                autofocus
              />
              <button
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                (click)="closeSearch()"
                aria-label="Close search"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Mobile nav drawer -->
      @if (mobileNavOpen()) {
        <div class="md:hidden border-t border-white/20 glass animate-slide-down">
          <div class="container-luxe py-4 space-y-1">
            @for (link of navLinks; track link.label) {
              <a
                [href]="link.href"
                class="flex items-center px-3 py-3 rounded-xl text-base font-medium
                  text-text hover:bg-primary/10 hover:text-primary transition-colors"
                (click)="uiState.closeMobileNav()"
              >
                {{ link.label }}
              </a>
            }
            <div class="pt-3 border-t border-border mt-2">
              <a
                [href]="'https://wa.me/' + waPhone + '?text=Hi! I want to browse your collection.'"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-whatsapp w-full justify-center"
                (click)="uiState.closeMobileNav()"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      }
    </header>

    <!-- Spacer to prevent content from hiding behind fixed navbar -->
    <div class="h-16 md:h-20"></div>
  `,
})
export class NavbarComponent implements OnInit {
  readonly waPhone = environment.whatsappPhone;
  cartService    = inject(CartService);
  wishlistService = inject(WishlistService);
  uiState        = inject(UiStateService);
  productService = inject(ProductService);

  scrolled     = signal(false);
  searchOpen   = signal(false);
  searchQuery  = signal('');
  mobileNavOpen = this.uiState.mobileNavOpen;

  cartCount     = this.cartService.itemCount;
  wishlistCount = this.wishlistService.count;

  readonly navLinks = [
    { label: 'New Arrivals', href: '#catalog' },
    { label: 'Bags',         href: '#catalog'  },
    { label: 'Clothing',     href: '#catalog'  },
    { label: 'Accessories',  href: '#catalog'  },
    { label: 'About',        href: '#about'    },
    { label: 'Contact',      href: '#contact'  },
  ];

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  toggleSearch(): void {
    this.searchOpen.update((v) => !v);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
    this.productService.updateFilter({ search: '' });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.productService.updateFilter({ search: value });
    // Scroll to catalog section
    if (value.length > 1) {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
