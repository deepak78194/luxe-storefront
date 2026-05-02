import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SanityWriteService, AdminStats } from '../../../core/services/sanity-write.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h2>
        <p class="text-gray-500 text-sm mt-1">Overview of your store content</p>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p class="text-xs sm:text-sm text-gray-500 font-medium mb-2">Total Products</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900">{{ stats().products }}</p>
            <a routerLink="/admin/products" class="text-indigo-600 text-xs sm:text-sm mt-3 inline-block hover:underline">View all →</a>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p class="text-xs sm:text-sm text-gray-500 font-medium mb-2">Categories</p>
            <p class="text-3xl sm:text-4xl font-bold text-gray-900">{{ stats().categories }}</p>
            <a routerLink="/admin/categories" class="text-indigo-600 text-xs sm:text-sm mt-3 inline-block hover:underline">Manage →</a>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p class="text-xs sm:text-sm text-gray-500 font-medium mb-2">Featured</p>
            <p class="text-3xl sm:text-4xl font-bold text-indigo-600">{{ stats().featured }}</p>
            <p class="text-gray-400 text-xs sm:text-sm mt-3">On homepage</p>
          </div>
          <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p class="text-xs sm:text-sm text-gray-500 font-medium mb-2">Out of Stock</p>
            <p class="text-3xl sm:text-4xl font-bold" [class.text-red-500]="stats().outOfStock > 0"
               [class.text-gray-900]="stats().outOfStock === 0">
              {{ stats().outOfStock }}
            </p>
            <p class="text-gray-400 text-xs sm:text-sm mt-3">Need restocking</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Quick Actions</h3>
          <div class="flex flex-col sm:flex-row flex-wrap gap-3">
            <a routerLink="/admin/products/new"
               class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors text-center">
              + Add Product
            </a>
            <a routerLink="/admin/categories"
               class="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-300 transition-colors text-center">
              + Add Category
            </a>
            <a routerLink="/admin/products"
               class="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-300 transition-colors text-center">
              View All Products
            </a>
          </div>
        </div>
      }

      @if (error()) {
        <div class="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-4 rounded-xl text-sm">
          Could not connect to Sanity. Check your project ID and token in environment.ts.
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private write = inject(SanityWriteService);

  loading = signal(true);
  error   = signal(false);
  stats   = signal<AdminStats>({ products: 0, categories: 0, featured: 0, outOfStock: 0 });

  async ngOnInit() {
    try {
      const s = await this.write.fetchStats();
      this.stats.set(s);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
