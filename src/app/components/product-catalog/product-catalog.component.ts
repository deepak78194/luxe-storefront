import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterDrawerComponent } from '../filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FilterDrawerComponent],
  template: `
    <section id="catalog" class="py-16 md:py-24 bg-white" aria-labelledby="catalog-heading">
      <div class="container-luxe">

        <!-- Section header -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">
              All Products
            </span>
            <h2 id="catalog-heading" class="section-title mb-4">
              Shop the Collection
            </h2>
            <div class="divider"></div>
          </div>
          <div class="text-text-muted text-sm">
            {{ productService.filteredProducts().length }} products
          </div>
        </div>

        <!-- Category pill tabs -->
        <div class="flex overflow-x-auto scrollbar-hide gap-2 mb-8 pb-1" role="tablist">
          @for (cat of categoryTabs(); track cat.slug) {
            <button
              class="flex-none px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                whitespace-nowrap border"
              [class.bg-primary]="activeCategory() === cat.slug"
              [class.text-white]="activeCategory() === cat.slug"
              [class.border-primary]="activeCategory() === cat.slug"
              [class.bg-white]="activeCategory() !== cat.slug"
              [class.text-text-muted]="activeCategory() !== cat.slug"
              [class.border-border]="activeCategory() !== cat.slug"
              [class.hover:border-primary]="activeCategory() !== cat.slug"
              [class.hover:text-primary]="activeCategory() !== cat.slug"
              (click)="selectCategory(cat.slug)"
              role="tab"
              [attr.aria-selected]="activeCategory() === cat.slug"
            >
              {{ cat.name }}
              @if (cat.count) {
                <span class="ml-1.5 text-xs opacity-70">({{ cat.count }})</span>
              }
            </button>
          }
        </div>

        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <!-- Left: Filter & Search (mobile) -->
          <div class="flex items-center gap-3">
            <!-- Filter button (opens drawer on mobile, shows sidebar on desktop) -->
            <button
              class="btn btn-secondary text-sm py-2 px-4 md:hidden"
              (click)="uiState.openFilterDrawer()"
              aria-label="Open filters"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="10" y1="18" x2="14" y2="18"/>
              </svg>
              Filters
              @if (activeFiltersCount() > 0) {
                <span class="ml-1 w-5 h-5 bg-primary text-white text-xs rounded-full
                  flex items-center justify-center font-bold">
                  {{ activeFiltersCount() }}
                </span>
              }
            </button>

            <!-- Active filter chips -->
            @for (chip of activeFilterChips(); track chip.label) {
              <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10
                text-primary text-xs font-medium rounded-full">
                {{ chip.label }}
                <button
                  (click)="removeFilterChip(chip.key)"
                  class="hover:text-primary-dark"
                  [attr.aria-label]="'Remove ' + chip.label + ' filter'"
                >×</button>
              </span>
            }
          </div>

          <!-- Right: Sort + View toggle -->
          <div class="flex items-center gap-3">
            <!-- Sort -->
            <select
              class="input py-2 text-sm w-auto"
              [value]="productService.filter().sortBy"
              (change)="onSortChange($event)"
              aria-label="Sort products"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>

            <!-- Grid toggle -->
            <div class="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
              <button
                class="p-2 transition-colors"
                [class.bg-primary]="gridCols() === 4"
                [class.text-white]="gridCols() === 4"
                [class.hover:bg-surface-2]="gridCols() !== 4"
                (click)="setGridCols(4)"
                aria-label="4 columns"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="3" height="3"/><rect x="6" y="1" width="3" height="3"/>
                  <rect x="11" y="1" width="3" height="3"/><rect x="1" y="6" width="3" height="3"/>
                  <rect x="6" y="6" width="3" height="3"/><rect x="11" y="6" width="3" height="3"/>
                  <rect x="1" y="11" width="3" height="3"/><rect x="6" y="11" width="3" height="3"/>
                  <rect x="11" y="11" width="3" height="3"/>
                </svg>
              </button>
              <button
                class="p-2 transition-colors"
                [class.bg-primary]="gridCols() === 3"
                [class.text-white]="gridCols() === 3"
                [class.hover:bg-surface-2]="gridCols() !== 3"
                (click)="setGridCols(3)"
                aria-label="3 columns"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="4" height="4"/><rect x="6" y="1" width="4" height="4"/>
                  <rect x="11" y="1" width="4" height="4"/><rect x="1" y="8" width="4" height="4"/>
                  <rect x="6" y="8" width="4" height="4"/><rect x="11" y="8" width="4" height="4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Main layout: sidebar + grid -->
        <div class="flex gap-8">
          <!-- Desktop sidebar filters -->
          <aside class="hidden lg:block w-64 flex-none" aria-label="Product filters">
            <app-filter-drawer [inline]="true"></app-filter-drawer>
          </aside>

          <!-- Product grid -->
          <div class="flex-1 min-w-0">
            @if (productService.loading()) {
              <!-- Skeleton loader -->
              <div class="grid gap-5 grid-cols-1 sm:grid-cols-2"
                [class.md:grid-cols-3]="gridCols() === 3"
                [class.md:grid-cols-4]="gridCols() === 4"
              >
                @for (n of [1,2,3,4,5,6,7,8]; track n) {
                  <div class="card">
                    <div class="skeleton aspect-[3/4]"></div>
                    <div class="p-4 space-y-2">
                      <div class="skeleton h-4 w-2/3 rounded"></div>
                      <div class="skeleton h-4 w-full rounded"></div>
                      <div class="skeleton h-5 w-1/3 rounded"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (productService.filteredProducts().length === 0) {
              <!-- Empty state -->
              <div class="flex flex-col items-center justify-center py-24 text-center">
                <div class="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-6">
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="text-text-muted" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 class="font-heading text-xl font-semibold text-text mb-2">No products found</h3>
                <p class="text-text-muted mb-6">Try adjusting your filters or search query</p>
                <button class="btn btn-primary" (click)="productService.resetFilter()">
                  Clear all filters
                </button>
              </div>
            } @else {
              <!-- Products -->
              <div
                class="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2"
                [class.md:grid-cols-3]="gridCols() >= 3"
                [class.lg:grid-cols-3]="gridCols() === 3"
                [class.lg:grid-cols-4]="gridCols() === 4"
                [class.xl:grid-cols-5]="gridCols() === 5"
              >
                @for (product of visibleProducts(); track product.id) {
                  <app-product-card [product]="product"></app-product-card>
                }
              </div>

              <!-- Load more -->
              @if (hasMore()) {
                <div class="flex justify-center mt-12">
                  <button
                    class="btn btn-secondary px-12 py-3.5"
                    (click)="loadMore()"
                  >
                    Load More Products
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                  </button>
                </div>
              }
            }
          </div>
        </div>
      </div>

      <!-- Mobile filter drawer -->
      <app-filter-drawer [inline]="false"></app-filter-drawer>
    </section>
  `,
})
export class ProductCatalogComponent {
  productService = inject(ProductService);
  uiState        = inject(UiStateService);

  gridCols = signal(4);
  pageSize = signal(12);

  visibleProducts = computed(() =>
    this.productService.filteredProducts().slice(0, this.pageSize())
  );

  hasMore = computed(() =>
    this.productService.filteredProducts().length > this.pageSize()
  );

  activeCategory = computed(() => this.productService.filter().category);

  categoryTabs = computed(() => {
    const products = this.productService.products();
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categorySlug] = (counts[p.categorySlug] ?? 0) + 1;
    });

    const tabs = [{ slug: 'all', name: 'All', count: products.length }];
    const cats = this.productService.categories();
    cats
      .filter((c) => c.slug !== 'all')
      .forEach((c) => {
        tabs.push({ slug: c.slug, name: c.name, count: counts[c.slug] ?? 0 });
      });
    return tabs;
  });

  activeFiltersCount = computed(() => {
    const f = this.productService.filter();
    let count = 0;
    if (f.category && f.category !== 'all') count++;
    if (f.minPrice !== null) count++;
    if (f.maxPrice !== null) count++;
    if (f.inStock) count++;
    if (f.search) count++;
    return count;
  });

  activeFilterChips = computed(() => {
    const f = this.productService.filter();
    const chips: { label: string; key: string }[] = [];
    if (f.category && f.category !== 'all') chips.push({ label: f.category, key: 'category' });
    if (f.minPrice !== null) chips.push({ label: `Min ₹${f.minPrice}`, key: 'minPrice' });
    if (f.maxPrice !== null) chips.push({ label: `Max ₹${f.maxPrice}`, key: 'maxPrice' });
    if (f.inStock) chips.push({ label: 'In Stock', key: 'inStock' });
    return chips;
  });

  selectCategory(slug: string): void {
    this.productService.updateFilter({ category: slug });
    this.pageSize.set(12);
  }

  setGridCols(cols: number): void {
    this.gridCols.set(cols);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as any;
    this.productService.updateFilter({ sortBy: value });
  }

  removeFilterChip(key: string): void {
    const reset: any = {};
    if (key === 'category') reset.category = 'all';
    else if (key === 'minPrice') reset.minPrice = null;
    else if (key === 'maxPrice') reset.maxPrice = null;
    else if (key === 'inStock') reset.inStock = false;
    this.productService.updateFilter(reset);
  }

  loadMore(): void {
    this.pageSize.update((n) => n + 12);
  }
}
