import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomePageComponent),
    title: 'Warm & Cozy Home Decors — Home Textiles & Cotton Wear',
  },

  // ── Admin login (public) ─────────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Admin Login — Warm & Cozy',
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
        title: 'Dashboard — W&C Admin',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
        title: 'Products — W&C Admin',
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./pages/admin/add-product/admin-add-product.component').then((m) => m.AdminAddProductComponent),
        title: 'Add Product — W&C Admin',
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./pages/admin/edit-product/admin-edit-product.component').then((m) => m.AdminEditProductComponent),
        title: 'Edit Product — W&C Admin',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/categories/admin-categories.component').then((m) => m.AdminCategoriesComponent),
        title: 'Categories — W&C Admin',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];

