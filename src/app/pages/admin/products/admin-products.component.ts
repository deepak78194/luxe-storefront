import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SanityWriteService } from '../../../core/services/sanity-write.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
          <p class="text-gray-500 text-sm mt-0.5">{{ products().length }} total products</p>
        </div>
        <a routerLink="/admin/products/new"
           class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
          + Add
        </a>
      </div>

      @if (loading()) {
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div class="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>
              <div class="flex-1 space-y-2 min-w-0">
                <div class="h-4 bg-gray-200 rounded w-48"></div>
                <div class="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          }
        </div>
      } @else if (products().length === 0) {
        <div class="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p class="text-gray-400 mb-4">No products yet.</p>
          <a routerLink="/admin/products/new"
             class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors inline-block">
            Add your first product
          </a>
        </div>
      } @else {

        <!-- Mobile / Tablet: card list -->
        <div class="lg:hidden space-y-3">
          @for (p of products(); track p.id) {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
              @if (p.imageUrl) {
                <img [src]="p.imageUrl + '?w=56&h=56&fit=crop'" [alt]="p.name"
                     class="w-14 h-14 object-cover rounded-xl bg-gray-100 shrink-0">
              } @else {
                <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              }
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-semibold text-gray-900 text-sm leading-tight truncate">{{ p.name }}</p>
                  <div class="flex items-center gap-1 shrink-0 -mt-0.5">
                    <a [routerLink]="['/admin/products', p.id, 'edit']"
                       class="text-indigo-400 hover:text-indigo-600 transition-colors p-1" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </a>
                    <button (click)="confirmDelete(p)"
                            class="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-gray-500 text-xs mt-0.5">{{ p.category || '—' }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="font-semibold text-gray-900 text-sm">₹{{ p.price | number }}</span>
                  <span [class]="(p.stockCount ?? 0) === 0
                    ? 'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium'
                    : 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium'">
                    {{ (p.stockCount ?? 0) === 0 ? 'Out of stock' : p.stockCount + ' in stock' }}
                  </span>
                </div>
                @if (p.isFeatured || p.isNewArrival || p.isBestseller) {
                  <div class="flex flex-wrap gap-1 mt-2">
                    @if (p.isFeatured)   { <span class="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs">★ Featured</span> }
                    @if (p.isNewArrival) { <span class="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-xs">New</span> }
                    @if (p.isBestseller) { <span class="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs">Best Seller</span> }
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Desktop: table -->
        <div class="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th class="text-right px-4 py-3 text-gray-500 font-medium">Price (₹)</th>
                <th class="text-right px-4 py-3 text-gray-500 font-medium">Stock</th>
                <th class="text-center px-4 py-3 text-gray-500 font-medium">Badges</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              @for (p of products(); track p.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      @if (p.imageUrl) {
                        <img [src]="p.imageUrl + '?w=48&h=48&fit=crop'" [alt]="p.name"
                             class="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0">
                      } @else {
                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      }
                      <div class="min-w-0">
                        <p class="font-medium text-gray-900 truncate">{{ p.name }}</p>
                        <p class="text-gray-400 text-xs truncate">{{ p.slug }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-gray-600">{{ p.category || '—' }}</td>
                  <td class="px-4 py-4 text-right font-medium text-gray-900">{{ p.price | number }}</td>
                  <td class="px-4 py-4 text-right">
                    <span [class]="(p.stockCount ?? 0) === 0
                      ? 'bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium'
                      : 'bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium'">
                      {{ (p.stockCount ?? 0) === 0 ? 'Out' : p.stockCount }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <div class="flex items-center justify-center gap-1 flex-wrap">
                      @if (p.isFeatured)   { <span class="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs">★ Featured</span> }
                      @if (p.isNewArrival) { <span class="bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded text-xs">New</span> }
                      @if (p.isBestseller) { <span class="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs">Best Seller</span> }
                    </div>
                  </td>
                  <td class="px-4 py-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <a [routerLink]="['/admin/products', p.id, 'edit']"
                         class="text-indigo-400 hover:text-indigo-600 transition-colors p-1 rounded" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <button (click)="confirmDelete(p)"
                              class="text-red-400 hover:text-red-600 transition-colors p-1 rounded" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Delete confirmation modal -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:px-4">
          <div class="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-2xl">
            <h3 class="font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p class="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{{ deleteTarget()!.name }}</strong>?
              This cannot be undone.
            </p>
            <div class="flex gap-3">
              <button (click)="deleteTarget.set(null)"
                      class="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button (click)="deleteProduct()" [disabled]="deleting()"
                      class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                @if (deleting()) { Deleting… } @else { Delete }
              </button>
            </div>
          </div>
        </div>
      }

      @if (successMsg()) {
        <div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm z-50 text-center sm:text-left">
          {{ successMsg() }}
        </div>
      }
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  private write = inject(SanityWriteService);

  products    = signal<any[]>([]);
  loading     = signal(true);
  deleteTarget = signal<any>(null);
  deleting    = signal(false);
  successMsg  = signal('');

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.loading.set(true);
    try {
      this.products.set(await this.write.fetchAdminProducts());
    } finally {
      this.loading.set(false);
    }
  }

  confirmDelete(p: any) {
    this.deleteTarget.set(p);
  }

  async deleteProduct() {
    const p = this.deleteTarget();
    if (!p) return;
    this.deleting.set(true);
    try {
      await this.write.deleteProduct(p.id);
      this.products.update((list) => list.filter((x) => x.id !== p.id));
      this.deleteTarget.set(null);
      this.showSuccess(`"${p.name}" deleted.`);
    } finally {
      this.deleting.set(false);
    }
  }

  private showSuccess(msg: string) {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 3000);
  }
}
