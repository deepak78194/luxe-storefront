import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex bg-gray-100">

      <!-- Mobile top bar -->
      <header class="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white shadow-sm flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="font-bold text-gray-900 text-sm">Luxe Admin</span>
        </div>
        <button (click)="sidebarOpen.set(!sidebarOpen())" class="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
          @if (sidebarOpen()) {
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          } @else {
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          }
        </button>
      </header>

      <!-- Mobile overlay -->
      @if (sidebarOpen()) {
        <div class="lg:hidden fixed inset-0 bg-black/40 z-30" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <aside
        class="fixed lg:static top-0 left-0 h-full z-40 w-64 bg-white shadow-lg flex flex-col shrink-0
               transition-transform duration-300 ease-in-out
               lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
        [class.translate-x-0]="sidebarOpen()">

        <!-- Sidebar header -->
        <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">Admin Panel</p>
            <h1 class="text-lg font-bold text-gray-800 leading-tight">Luxe Storefront</h1>
          </div>
          <button (click)="sidebarOpen.set(false)" class="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
             (click)="sidebarOpen.set(false)"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard
          </a>

          <a routerLink="/admin/products" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
             [routerLinkActiveOptions]="{ exact: true }"
             (click)="sidebarOpen.set(false)"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
            Products
          </a>

          <a routerLink="/admin/products/new" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
             [routerLinkActiveOptions]="{ exact: true }"
             (click)="sidebarOpen.set(false)"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm pl-11">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Product
          </a>

          <a routerLink="/admin/categories" routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
             (click)="sidebarOpen.set(false)"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Categories
          </a>
        </nav>

        <div class="px-4 py-4 border-t border-gray-200 space-y-1">
          <a href="/" target="_blank"
             class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors text-sm">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            View Store
          </a>
          <button (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main content area -->
      <main class="flex-1 min-w-0 overflow-auto lg:pt-0 pt-14">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {
  private router = inject(Router);
  sidebarOpen = signal(false);

  logout(): void {
    sessionStorage.removeItem('admin-auth');
    this.router.navigate(['/admin/login']);
  }
}

