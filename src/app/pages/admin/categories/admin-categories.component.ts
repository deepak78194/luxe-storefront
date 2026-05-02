import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SanityWriteService } from '../../../core/services/sanity-write.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
        <p class="text-gray-500 text-sm mt-1">Manage your product categories</p>
      </div>

      <!-- Duplicate warning banner -->
      @if (duplicateCount() > 0) {
        <div class="mb-6 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex-1">
            <p class="text-amber-800 font-semibold text-sm">⚠️ {{ duplicateCount() }} duplicate categor{{ duplicateCount() === 1 ? 'y' : 'ies' }} detected</p>
            <p class="text-amber-700 text-xs mt-0.5">
              These are extra copies created when the seed was run multiple times.
              Click "Remove Duplicates" to keep only one copy per category and re-link all products to the surviving copy automatically.
            </p>
          </div>
          <button (click)="runDeduplication()" [disabled]="deduping()"
                  class="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold
                         px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shrink-0">
            @if (deduping()) {
              <span class="flex items-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                Cleaning…
              </span>
            } @else {
              Remove Duplicates
            }
          </button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Category List -->
        <div class="lg:col-span-2">
          @if (loading()) {
            <div class="bg-white rounded-2xl shadow-sm p-6 animate-pulse space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="h-16 bg-gray-100 rounded-xl"></div>
              }
            </div>
          } @else if (categories().length === 0) {
            <div class="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p class="text-gray-400">No categories yet. Add one on the right →</p>
            </div>
          } @else {
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="text-left px-4 sm:px-6 py-3 text-gray-500 font-medium">Name</th>
                    <th class="hidden sm:table-cell text-left px-4 py-3 text-gray-500 font-medium">Slug</th>
                    <th class="text-right px-4 py-3 text-gray-500 font-medium">Products</th>
                    <th class="hidden sm:table-cell text-right px-4 py-3 text-gray-500 font-medium">Order</th>
                    <th class="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (cat of categories(); track cat.id) {
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-4 sm:px-6 py-4 font-medium text-gray-900">{{ cat.name }}</td>
                      <td class="hidden sm:table-cell px-4 py-4 text-gray-500 font-mono text-xs">{{ cat.slug }}</td>
                      <td class="px-4 py-4 text-right text-gray-700">
                        <span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                          {{ cat.productCount }}
                        </span>
                      </td>
                      <td class="hidden sm:table-cell px-4 py-4 text-right text-gray-500">{{ cat.order }}</td>
                      <td class="px-4 py-4 text-right">
                        <button (click)="confirmDelete(cat)"
                                [disabled]="cat.productCount > 0"
                                class="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1 rounded"
                                [title]="cat.productCount > 0 ? 'Cannot delete — has products' : 'Delete'">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- Add Category Form -->
        <div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-5">Add New Category</h3>

            <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
                <input formControlName="name" type="text" placeholder="e.g. Women's Fashion"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900
                              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                              focus:border-transparent transition"
                       [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea formControlName="description" rows="3"
                          placeholder="Brief description of this category"
                          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 focus:border-transparent transition resize-none"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                <input formControlName="order" type="number" min="0" placeholder="0"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900
                              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                              focus:border-transparent transition">
                <p class="text-xs text-gray-400 mt-1">Lower number = shown first</p>
              </div>

              @if (saveError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {{ saveError() }}
                </div>
              }

              <button type="submit" [disabled]="saving()"
                      class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white
                             font-semibold py-2.5 rounded-xl transition-colors text-sm">
                @if (saving()) { Saving… } @else { Add Category }
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      @if (deleteTarget()) {
        <div class="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:px-4">
          <div class="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-2xl">
            <h3 class="font-bold text-gray-900 mb-2">Delete Category?</h3>
            <p class="text-gray-600 text-sm mb-6">
              Delete <strong>{{ deleteTarget()!.name }}</strong>? This cannot be undone.
            </p>
            <div class="flex gap-3">
              <button (click)="deleteTarget.set(null)"
                      class="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button (click)="deleteCategory()" [disabled]="deleting()"
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
export class AdminCategoriesComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private write = inject(SanityWriteService);

  categories     = signal<any[]>([]);
  loading        = signal(true);
  saving         = signal(false);
  deleting       = signal(false);
  deduping       = signal(false);
  deleteTarget   = signal<any>(null);
  saveError      = signal('');
  successMsg     = signal('');
  duplicateCount = signal(0);

  form = this.fb.group({
    name:        ['', Validators.required],
    description: [''],
    order:       [0],
  });

  async ngOnInit() {
    await this.loadCategories();
    await this.checkDuplicates();
  }

  /** Count how many category docs are duplicates (same slug, not the oldest). */
  private async checkDuplicates() {
    // We know total vs deduplicated via a separate GROQ count approach:
    // total - unique = duplicate count
    if (!this.write.isConfigured) return;
    try {
      // Re-use the client indirectly: compare total categories vs categories shown
      const allRaw: any[] = await (this.write as any).client?.fetch(
        `*[_type == "category"]{ "id": _id, "slug": slug.current, _createdAt }`
      ) ?? [];
      const slugSeen = new Map<string, boolean>();
      let dupes = 0;
      // Sort oldest first
      allRaw.sort((a, b) => a._createdAt.localeCompare(b._createdAt));
      for (const c of allRaw) {
        if (slugSeen.has(c.slug)) dupes++; else slugSeen.set(c.slug, true);
      }
      this.duplicateCount.set(dupes);
    } catch { /* ignore */ }
  }

  async loadCategories() {
    this.loading.set(true);
    try {
      this.categories.set(await this.write.fetchAdminCategories());
    } finally {
      this.loading.set(false);
    }
  }

  async runDeduplication() {
    this.deduping.set(true);
    try {
      const deleted = await this.write.deduplicateCategories();
      this.duplicateCount.set(0);
      await this.loadCategories();
      this.showSuccess(`Removed ${deleted} duplicate categor${deleted === 1 ? 'y' : 'ies'} successfully.`);
    } catch (err: any) {
      this.showSuccess('Error: ' + (err?.message ?? 'Deduplication failed.'));
    } finally {
      this.deduping.set(false);
    }
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.saveError.set('');
    try {
      const v = this.form.getRawValue();
      await this.write.createCategory({
        name: v.name!,
        description: v.description ?? '',
        order: v.order ?? 0,
      });
      this.form.reset({ name: '', description: '', order: 0 });
      await this.loadCategories();
      this.showSuccess(`Category "${v.name}" added.`);
    } catch (err: any) {
      this.saveError.set(err?.message ?? 'Failed to save. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(cat: any) {
    this.deleteTarget.set(cat);
  }

  async deleteCategory() {
    const cat = this.deleteTarget();
    if (!cat) return;
    this.deleting.set(true);
    try {
      await this.write.deleteCategory(cat.id);
      this.categories.update((list) => list.filter((c) => c.id !== cat.id));
      this.deleteTarget.set(null);
      this.showSuccess(`"${cat.name}" deleted.`);
    } finally {
      this.deleting.set(false);
    }
  }

  private showSuccess(msg: string) {
    this.successMsg.set(msg);
    setTimeout(() => this.successMsg.set(''), 4000);
  }
}
