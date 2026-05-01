import {
  Component, Input, inject, signal, OnInit, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Mobile overlay -->
    @if (!inline && drawerOpen()) {
      <div
        class="overlay md:hidden"
        (click)="uiState.closeFilterDrawer()"
        aria-hidden="true"
      ></div>
    }

    <!-- Drawer / Sidebar -->
    <div
      class="filter-panel"
      [class.fixed]="!inline"
      [class.inset-y-0]="!inline"
      [class.left-0]="!inline"
      [class.z-50]="!inline"
      [class.w-80]="!inline"
      [class.bg-white]="!inline"
      [class.shadow-modal]="!inline"
      [class.transition-transform]="!inline"
      [class.duration-350]="!inline"
      [class.-translate-x-full]="!inline && !drawerOpen()"
      [class.translate-x-0]="!inline && drawerOpen()"
      [class.md:hidden]="!inline"
      [class.overflow-y-auto]="!inline"
      [attr.aria-hidden]="!inline && !drawerOpen()"
      role="dialog"
      aria-label="Product filters"
    >
      <!-- Drawer header (mobile only) -->
      @if (!inline) {
        <div class="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <h2 class="font-heading font-semibold text-lg">Filters</h2>
          <button
            class="btn btn-ghost btn-icon"
            (click)="uiState.closeFilterDrawer()"
            aria-label="Close filters"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }

      <!-- Filter sections -->
      <div [class.p-5]="!inline" [class.space-y-6]="true">

        <!-- Search (inline only, mobile has it in navbar) -->
        @if (inline) {
          <div>
            <label class="block text-sm font-semibold text-text mb-2">Search</label>
            <div class="relative">
              <input
                type="search"
                class="input pr-9 text-sm"
                placeholder="Search products..."
                [ngModel]="productService.filter().search"
                (ngModelChange)="productService.updateFilter({ search: $event })"
                aria-label="Search products"
              />
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        }

        <!-- Category -->
        <div>
          <button
            class="flex items-center justify-between w-full text-sm font-semibold text-text mb-3"
            (click)="toggleSection('category')"
            [attr.aria-expanded]="expandedSections().has('category')"
          >
            Category
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              class="transition-transform"
              [class.rotate-180]="expandedSections().has('category')">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          @if (expandedSections().has('category')) {
            <div class="space-y-2 animate-slide-down">
              @for (cat of categories(); track cat.slug) {
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    [value]="cat.slug"
                    [checked]="productService.filter().category === cat.slug"
                    (change)="productService.updateFilter({ category: cat.slug })"
                    class="w-4 h-4 text-primary border-border focus:ring-primary rounded-full"
                  />
                  <span class="text-sm text-text-muted group-hover:text-text transition-colors flex-1">
                    {{ cat.name }}
                  </span>
                  @if (cat.count) {
                    <span class="text-xs text-text-muted">{{ cat.count }}</span>
                  }
                </label>
              }
            </div>
          }
        </div>

        <div class="border-t border-border"></div>

        <!-- Price range -->
        <div>
          <button
            class="flex items-center justify-between w-full text-sm font-semibold text-text mb-3"
            (click)="toggleSection('price')"
            [attr.aria-expanded]="expandedSections().has('price')"
          >
            Price Range
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              class="transition-transform"
              [class.rotate-180]="expandedSections().has('price')">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          @if (expandedSections().has('price')) {
            <div class="space-y-3 animate-slide-down">
              <!-- Price preset chips -->
              <div class="flex flex-wrap gap-2">
                @for (preset of pricePresets; track preset.label) {
                  <button
                    class="px-3 py-1 text-xs rounded-full border transition-all"
                    [class.bg-primary]="activePricePreset() === preset.label"
                    [class.text-white]="activePricePreset() === preset.label"
                    [class.border-primary]="activePricePreset() === preset.label"
                    [class.border-border]="activePricePreset() !== preset.label"
                    [class.text-text-muted]="activePricePreset() !== preset.label"
                    (click)="applyPricePreset(preset)"
                  >
                    {{ preset.label }}
                  </button>
                }
              </div>

              <!-- Manual inputs -->
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  class="input text-sm py-1.5 text-center"
                  placeholder="Min ₹"
                  [ngModel]="productService.filter().minPrice"
                  (ngModelChange)="productService.updateFilter({ minPrice: $event || null })"
                  min="0"
                  aria-label="Minimum price"
                />
                <span class="text-text-muted text-sm flex-none">–</span>
                <input
                  type="number"
                  class="input text-sm py-1.5 text-center"
                  placeholder="Max ₹"
                  [ngModel]="productService.filter().maxPrice"
                  (ngModelChange)="productService.updateFilter({ maxPrice: $event || null })"
                  min="0"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          }
        </div>

        <div class="border-t border-border"></div>

        <!-- Availability -->
        <div>
          <label class="flex items-center gap-3 cursor-pointer">
            <div class="relative">
              <input
                type="checkbox"
                class="sr-only"
                [checked]="productService.filter().inStock"
                (change)="productService.updateFilter({ inStock: !productService.filter().inStock })"
                id="in-stock-filter"
              />
              <div
                class="w-10 h-6 rounded-full transition-colors"
                [class.bg-primary]="productService.filter().inStock"
                [class.bg-border]="!productService.filter().inStock"
              >
                <div
                  class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm"
                  [class.translate-x-5]="productService.filter().inStock"
                  [class.translate-x-1]="!productService.filter().inStock"
                ></div>
              </div>
            </div>
            <span class="text-sm font-medium text-text">In Stock Only</span>
          </label>
        </div>

        <div class="border-t border-border"></div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            class="btn btn-primary flex-1 text-sm py-2.5"
            (click)="applyAndClose()"
          >
            Apply Filters
          </button>
          <button
            class="btn btn-ghost flex-1 text-sm py-2.5 border border-border"
            (click)="clearAll()"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FilterDrawerComponent implements OnInit {
  @Input() inline = false;

  productService = inject(ProductService);
  uiState        = inject(UiStateService);

  drawerOpen = this.uiState.filterDrawerOpen;

  expandedSections = signal<Set<string>>(new Set(['category', 'price']));
  activePricePreset = signal<string>('');

  readonly pricePresets = [
    { label: 'Under ₹1K',  min: null, max: 1000  },
    { label: '₹1K–₹3K',   min: 1000, max: 3000  },
    { label: '₹3K–₹6K',   min: 3000, max: 6000  },
    { label: 'Above ₹6K', min: 6000, max: null  },
  ];

  categories = this.productService.categories;

  ngOnInit(): void {}

  @HostListener('keydown.escape')
  onEscape(): void {
    if (!this.inline) this.uiState.closeFilterDrawer();
  }

  toggleSection(key: string): void {
    this.expandedSections.update((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  applyPricePreset(preset: { label: string; min: number | null; max: number | null }): void {
    this.activePricePreset.set(preset.label);
    this.productService.updateFilter({ minPrice: preset.min, maxPrice: preset.max });
  }

  applyAndClose(): void {
    if (!this.inline) this.uiState.closeFilterDrawer();
  }

  clearAll(): void {
    this.activePricePreset.set('');
    this.productService.resetFilter();
    if (!this.inline) this.uiState.closeFilterDrawer();
  }
}
