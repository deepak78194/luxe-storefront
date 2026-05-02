import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomePageComponent),
    title: 'Luxe Storefront — Premium Fashion & Accessories',
  },

  // ── Admin login (public) ─────────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Admin Login — Luxe Storefront',
  },

  // ── Admin shell (protected) ──────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
        title: 'Dashboard — Luxe Admin',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
        title: 'Products — Luxe Admin',
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/admin/add-product/admin-add-product.component').then((m) => m.AdminAddProductComponent),
        title: 'Add Product — Luxe Admin',
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./pages/admin/edit-product/admin-edit-product.component').then((m) => m.AdminEditProductComponent),
        title: 'Edit Product — Luxe Admin',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/categories/admin-categories.component').then((m) => m.AdminCategoriesComponent),
        title: 'Categories — Luxe Admin',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];

