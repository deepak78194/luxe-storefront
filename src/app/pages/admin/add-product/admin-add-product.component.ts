import {
  Component, inject, signal, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormArray,
  Validators, FormGroup
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SanityWriteService } from '../../../core/services/sanity-write.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-4xl">

      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <a routerLink="/admin/products"
           class="text-gray-400 hover:text-gray-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h2>
          <p class="text-gray-500 text-sm mt-0.5">Fill in the details below and save.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">

        <!-- Basic Info -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h3 class="font-semibold text-gray-900">Basic Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
              <input formControlName="name" type="text" placeholder="e.g. Banarasi Silk Saree"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white" [class.border-red-400]="isInvalid('name')">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
              <input formControlName="brand" type="text" placeholder="e.g. HeritageLoom" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
            <input formControlName="shortDescription" type="text"
                   placeholder="One-line summary shown in product cards" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Description</label>
            <textarea formControlName="description" rows="4"
                      placeholder="Detailed description of the product, materials, care, etc."
                      class="input-field resize-none"></textarea>
          </div>
        </div>

        <!-- Category & Pricing -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h3 class="font-semibold text-gray-900">Category & Pricing</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            @if (categoriesLoading()) {
              <div class="input-field text-gray-400">Loading categories…</div>
            } @else {
              <select formControlName="categoryId" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                      [class.border-red-400]="isInvalid('categoryId')">
                <option value="">Select a category</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Selling Price (₹) *</label>
              <input formControlName="price" type="number" min="0" placeholder="3999" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                     [class.border-red-400]="isInvalid('price')">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
              <input formControlName="originalPrice" type="number" min="0" placeholder="5999" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
              <input formControlName="discountPercent" type="number" min="0" max="100"
                     placeholder="Auto" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Stock Count</label>
              <input formControlName="stockCount" type="number" min="0" placeholder="10" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
              <input formControlName="sku" type="text" placeholder="e.g. WF-SAR-001" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Material</label>
              <input formControlName="material" type="text" placeholder="e.g. 100% Pure Silk" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <input formControlName="tags" type="text"
                   placeholder="Comma-separated: saree, silk, banarasi, wedding" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 class="font-semibold text-gray-900">Product Images</h3>

          <!-- Image previews -->
          @if (imagePreviews().length > 0) {
            <div class="flex flex-wrap gap-3">
              @for (preview of imagePreviews(); track $index; let i = $index) {
                <div class="relative">
                  <img [src]="preview" alt="Preview" class="w-24 h-24 object-cover rounded-xl border border-gray-200">
                  <button type="button" (click)="removeImage(i)"
                          class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                    ×
                  </button>
                  @if (uploadingIndex() === i) {
                    <div class="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                      <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300
                         rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
            <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm text-gray-500">Click to upload images (JPG, PNG, WebP)</span>
            <input type="file" multiple accept="image/*" class="hidden" (change)="onImageSelect($event)">
          </label>
          @if (uploadingImages()) {
            <p class="text-sm text-indigo-600 flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block"></span>
              Uploading to Sanity…
            </p>
          }
        </div>

        <!-- Badges & Visibility -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-5">Badges & Visibility</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isFeatured"
                     class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500">
              <div>
                <p class="text-sm font-medium text-gray-900">⭐ Featured</p>
                <p class="text-xs text-gray-500">Shown in homepage featured section</p>
              </div>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isNewArrival"
                     class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500">
              <div>
                <p class="text-sm font-medium text-gray-900">🆕 New Arrival</p>
                <p class="text-xs text-gray-500">Tagged as a new arrival</p>
              </div>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isBestSeller"
                     class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500">
              <div>
                <p class="text-sm font-medium text-gray-900">🔥 Best Seller</p>
                <p class="text-xs text-gray-500">Tagged as a best seller</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Reviews (optional) -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 class="font-semibold text-gray-900">Ratings (optional)</h3>
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Rating (1–5)</label>
              <input formControlName="rating" type="number" min="1" max="5" step="0.1" placeholder="4.5" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Review Count</label>
              <input formControlName="reviewCount" type="number" min="0" placeholder="0" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
          </div>
        </div>

        <!-- Variants -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Variants (Sizes / Colours)</h3>
            <button type="button" (click)="addVariant()"
                    class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              + Add Variant
            </button>
          </div>

          @if (variants.length === 0) {
            <p class="text-sm text-gray-400">No variants added. Leave blank for single-option products.</p>
          }

          @for (v of variants.controls; track $index; let i = $index) {
            <div [formGroupName]="'variants'" class="hidden"></div>
          }

          <div formArrayName="variants" class="space-y-3">
            @for (v of variants.controls; track $index; let i = $index) {
              <div [formGroupName]="i" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 items-center bg-gray-50 rounded-xl p-3">
                <input formControlName="size" type="text" placeholder="Size (S/M/L)" class="input-field text-sm">
                <input formControlName="color" type="text" placeholder="Colour name" class="input-field text-sm">
                <input formControlName="colorHex" type="color" class="h-10 w-full rounded-lg border border-gray-300 cursor-pointer p-1">
                <input formControlName="stock" type="number" min="0" placeholder="Stock" class="input-field text-sm">
                <button type="button" (click)="removeVariant(i)"
                        class="text-red-400 hover:text-red-600 transition-colors justify-self-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Error / Submit -->
        @if (submitError()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            {{ submitError() }}
          </div>
        }

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
          <button type="submit" [disabled]="saving()"
                  class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold
                         px-8 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center">
            @if (saving()) { Saving… } @else { Save Product }
          </button>
          <a routerLink="/admin/products"
             class="border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
            Cancel
          </a>
        </div>

      </form>
    </div>
  `,
})
export class AdminAddProductComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private write = inject(SanityWriteService);
  private router = inject(Router);
  private cd    = inject(ChangeDetectorRef);

  categories        = signal<any[]>([]);
  categoriesLoading = signal(true);
  imagePreviews     = signal<string[]>([]);
  imageFiles        = signal<File[]>([]);
  imageAssetIds     = signal<string[]>([]);
  uploadingImages   = signal(false);
  uploadingIndex    = signal<number>(-1);
  saving            = signal(false);
  submitError       = signal('');

  form = this.fb.group({
    name:             ['', Validators.required],
    brand:            [''],
    shortDescription: [''],
    description:      [''],
    categoryId:       ['', Validators.required],
    price:            [null as number | null, [Validators.required, Validators.min(0)]],
    originalPrice:    [null as number | null],
    discountPercent:  [null as number | null],
    stockCount:       [0],
    sku:              [''],
    material:         [''],
    tags:             [''],
    isFeatured:       [false],
    isNewArrival:     [true],
    isBestSeller:     [false],
    rating:           [null as number | null],
    reviewCount:      [0],
    variants:         this.fb.array([]),
  });

  get variants(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  async ngOnInit() {
    try {
      this.categories.set(await this.write.fetchAdminCategories());
    } finally {
      this.categoriesLoading.set(false);
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  addVariant() {
    this.variants.push(this.fb.group({
      size:     [''],
      color:    [''],
      colorHex: ['#000000'],
      stock:    [0],
      sku:      [''],
    }));
  }

  removeVariant(i: number) {
    this.variants.removeAt(i);
  }

  async onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const newFiles = Array.from(input.files);
    this.uploadingImages.set(true);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const currentIndex = this.imagePreviews().length;

      // Show local preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.update((p) => [...p, e.target!.result as string]);
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);

      // Upload to Sanity
      try {
        this.uploadingIndex.set(currentIndex);
        const assetId = await this.write.uploadImage(file);
        this.imageAssetIds.update((ids) => [...ids, assetId]);
        this.imageFiles.update((f) => [...f, file]);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    this.uploadingImages.set(false);
    this.uploadingIndex.set(-1);
    input.value = ''; // reset input
  }

  removeImage(index: number) {
    this.imagePreviews.update((p) => p.filter((_, i) => i !== index));
    this.imageAssetIds.update((ids) => ids.filter((_, i) => i !== index));
    this.imageFiles.update((f) => f.filter((_, i) => i !== index));
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.submitError.set('');

    try {
      const v = this.form.getRawValue() as any;
      await this.write.createProduct(
        {
          ...v,
          variants: v.variants ?? [],
        },
        this.imageAssetIds()
      );
      this.router.navigate(['/admin/products']);
    } catch (err: any) {
      this.submitError.set(err?.message ?? 'Failed to save product. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
}
