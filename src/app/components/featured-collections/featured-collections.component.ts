import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { environment } from '../../../environments/environment';

interface CollectionCard {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  categorySlug: string;
  badge?: string;
}

@Component({
  selector: 'app-featured-collections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="collections" class="py-20 md:py-28 bg-secondary" aria-labelledby="collections-heading">
      <div class="container-luxe">

        <!-- Section header -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">
              Curated for You
            </span>
            <h2 id="collections-heading" class="section-title mb-4">
              Shop by Collection
            </h2>
            <div class="divider"></div>
          </div>
          <p class="section-subtitle">
            Thoughtfully selected pieces across every category — discover your next favourite.
          </p>
        </div>

        <!-- Bento grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]
          md:auto-rows-[220px] lg:auto-rows-[240px]">

          <!-- Feature card — spans 2 cols & 2 rows -->
          <a
            href="#catalog"
            class="col-span-2 row-span-2 card group relative overflow-hidden cursor-pointer
              focus-visible:ring-2 focus-visible:ring-primary"
            (click)="filterByCategory('bags')"
            aria-label="Shop Bags Collection"
          >
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80"
              alt="Bags collection"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-text/70 via-text/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
              <span class="badge badge-new mb-2">New Season</span>
              <h3 class="font-heading text-2xl md:text-3xl font-bold text-white mb-1">Bags</h3>
              <p class="text-white/80 text-sm mb-3 opacity-0 group-hover:opacity-100
                transition-opacity duration-300">
                From structured totes to effortless crossbodies
              </p>
              <span class="inline-flex items-center gap-2 text-white/90 text-sm font-semibold
                group-hover:text-accent transition-colors">
                Shop now
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>

          <!-- Clothing -->
          <a
            href="#catalog"
            class="card group relative overflow-hidden cursor-pointer
              focus-visible:ring-2 focus-visible:ring-primary"
            (click)="filterByCategory('clothing')"
            aria-label="Shop Clothing"
          >
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80"
              alt="Clothing collection"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-text/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="font-heading text-xl font-bold text-white">Clothing</h3>
              <span class="text-white/70 text-xs">{{ clothingCount() }} pieces</span>
            </div>
          </a>

          <!-- Accessories -->
          <a
            href="#catalog"
            class="card group relative overflow-hidden cursor-pointer
              focus-visible:ring-2 focus-visible:ring-primary"
            (click)="filterByCategory('accessories')"
            aria-label="Shop Accessories"
          >
            <img
              src="https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8b?w=600&q=80"
              alt="Accessories"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-text/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="font-heading text-xl font-bold text-white">Accessories</h3>
              <span class="text-white/70 text-xs">Scarves, belts & more</span>
            </div>
          </a>

          <!-- Shoes -->
          <a
            href="#catalog"
            class="card group relative overflow-hidden cursor-pointer
              focus-visible:ring-2 focus-visible:ring-primary"
            (click)="filterByCategory('shoes')"
            aria-label="Shop Shoes"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"
              alt="Shoes"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-text/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="font-heading text-xl font-bold text-white">Shoes</h3>
              <span class="text-white/70 text-xs">Step in style</span>
            </div>
          </a>

          <!-- Jewelry — wide -->
          <a
            href="#catalog"
            class="col-span-2 card group relative overflow-hidden cursor-pointer
              focus-visible:ring-2 focus-visible:ring-primary"
            (click)="filterByCategory('jewelry')"
            aria-label="Shop Jewelry"
          >
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80"
              alt="Jewelry collection"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-text/60 to-transparent"></div>
            <div class="absolute inset-0 flex items-center">
              <div class="ml-8">
                <span class="badge badge-discount mb-2">Up to 40% off</span>
                <h3 class="font-heading text-2xl font-bold text-white">Jewelry</h3>
                <p class="text-white/80 text-sm mt-1">Earrings, necklaces & rings</p>
              </div>
            </div>
          </a>
        </div>

        <!-- Promo banner -->
        <div class="mt-8 rounded-2xl overflow-hidden relative bg-gradient-luxury p-8 md:p-12
          flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4"></div>
          <div class="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-white/5 translate-y-1/2"></div>

          <div class="relative z-10 text-center md:text-left">
            <p class="text-white/70 text-sm font-semibold tracking-widest uppercase mb-2">
              Limited Time
            </p>
            <h3 class="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
              Free Shipping<br class="hidden md:block" /> on Orders Over ₹2,999
            </h3>
            <p class="text-white/80 text-base">Use code <strong class="text-accent">LUXESHIP</strong> at checkout</p>
          </div>

          <div class="relative z-10 flex flex-col sm:flex-row gap-3">
            <a href="#catalog" class="btn bg-white text-primary hover:bg-white/90 px-5 py-3 sm:px-8 sm:py-3.5">
              Shop Now
            </a>
            <a
              [href]="'https://wa.me/' + waPhone + '?text=Hi! I want to place an order with free shipping.'"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp px-5 py-3 sm:px-8 sm:py-3.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FeaturedCollectionsComponent {
  readonly waPhone = environment.whatsappPhone;
  private productService = inject(ProductService);
  private uiState = inject(UiStateService);

  clothingCount = computed(() =>
    this.productService.products().filter((p) => p.categorySlug === 'clothing').length
  );

  filterByCategory(slug: string): void {
    this.productService.updateFilter({ category: slug });
  }
}
