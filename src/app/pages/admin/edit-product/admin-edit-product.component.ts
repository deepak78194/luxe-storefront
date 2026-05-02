import {
  Component, inject, signal, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, FormArray, Validators
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SanityWriteService } from '../../../core/services/sanity-write.service';

@Component({
  selector: 'app-admin-edit-product',
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
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h2>
          <p class="text-gray-500 text-sm mt-0.5">Update the details below and save.</p>
        </div>
      </div>

      @if (pageLoading()) {
        <div class="space-y-4 animate-pulse">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div class="h-5 bg-gray-200 rounded w-40 mb-5"></div>
              <div class="grid grid-cols-2 gap-5">
                <div class="h-10 bg-gray-200 rounded-xl"></div>
                <div class="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          }
        </div>
      } @else if (notFound()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          Product not found. It may have been deleted.
          <a routerLink="/admin/products" class="underline ml-2">Back to products</a>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">

          <!-- Basic Info -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h3 class="font-semibold text-gray-900">Basic Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input formControlName="name" type="text" placeholder="e.g. Banarasi Silk Saree"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                       [class.border-red-400]="isInvalid('name')">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                <input formControlName="brand" type="text" placeholder="e.g. HeritageLoom"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
              <input formControlName="shortDescription" type="text"
                     placeholder="One-line summary shown in product cards"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Description</label>
              <textarea formControlName="description" rows="4"
                        placeholder="Detailed description, materials, care, etc."
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white resize-none"></textarea>
            </div>
          </div>

          <!-- Category & Pricing -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h3 class="font-semibold text-gray-900">Category & Pricing</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              @if (categoriesLoading()) {
                <div class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-400 text-sm bg-gray-50">Loading categories…</div>
              } @else {
                <select formControlName="categoryId"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
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
                <input formControlName="price" type="number" min="0" placeholder="3999"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                       [class.border-red-400]="isInvalid('price')">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                <input formControlName="originalPrice" type="number" min="0" placeholder="5999"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
                <input formControlName="discountPercent" type="number" min="0" max="100" placeholder="Auto"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Stock Count</label>
                <input formControlName="stockCount" type="number" min="0" placeholder="10"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                <input formControlName="sku" type="text" placeholder="e.g. WF-SAR-001"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Material</label>
                <input formControlName="material" type="text" placeholder="e.g. 100% Pure Silk"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input formControlName="tags" type="text"
                     placeholder="Comma-separated: saree, silk, banarasi, wedding"
                     class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
            </div>
          </div>

          <!-- Images -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 class="font-semibold text-gray-900">Product Images</h3>
            <p class="text-xs text-gray-500">Upload new images to replace the existing ones, or leave unchanged.</p>

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

          <!-- Ratings -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 class="font-semibold text-gray-900">Ratings (optional)</h3>
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Rating (1–5)</label>
                <input formControlName="rating" type="number" min="1" max="5" step="0.1" placeholder="4.5"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Review Count</label>
                <input formControlName="reviewCount" type="number" min="0" placeholder="0"
                       class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
              </div>
            </div>
          </div>

          <!-- Variants -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">Variants (Sizes / Colours)</h3>
                <p class="text-xs text-gray-500 mt-0.5">e.g. Size S in Red — each variant can have its own stock</p>
              </div>
              <button type="button" (click)="addVariant()"
                      class="text-indigo-600 hover:text-indigo-700 text-sm font-medium whitespace-nowrap">
                + Add Variant
              </button>
            </div>

            @if (variants.length === 0) {
              <p class="text-sm text-gray-400">No variants. Leave blank for single-option products.</p>
            }

            <div formArrayName="variants" class="space-y-3">
              @for (v of variants.controls; track $index; let i = $index) {
                <div [formGroupName]="i" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 items-center bg-gray-50 rounded-xl p-3">
                  <input formControlName="size" type="text" placeholder="Size (S/M/L)"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <input formControlName="color" type="text" placeholder="Colour name"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <input formControlName="colorHex" type="color"
                         class="h-10 w-full rounded-lg border border-gray-300 cursor-pointer p-1">
                  <input formControlName="stock" type="number" min="0" placeholder="Stock"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
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

          <!-- Error -->
          @if (submitError()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
              {{ submitError() }}
            </div>
          }

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
            <button type="submit" [disabled]="saving()"
                    class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold
                           px-8 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center">
              @if (saving()) { Saving… } @else { Update Product }
            </button>
            <a routerLink="/admin/products"
               class="border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
              Cancel
            </a>
          </div>

        </form>
      }
    </div>
  `,
})
export class AdminEditProductComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private write = inject(SanityWriteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cd    = inject(ChangeDetectorRef);

  productId         = signal('');
  pageLoading       = signal(true);
  notFound          = signal(false);
  categories        = signal<any[]>([]);
  categoriesLoading = signal(true);
  imagePreviews     = signal<string[]>([]);
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

  get variants() {
    return this.form.get('variants') as any;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.productId.set(id);

    const [product, cats] = await Promise.all([
      this.write.fetchProductById(id).catch(() => null),
      this.write.fetchAdminCategories().catch(() => []),
    ]);

    this.categories.set(cats);
    this.categoriesLoading.set(false);

    if (!product) {
      this.notFound.set(true);
      this.pageLoading.set(false);
      return;
    }

    // Populate image previews + asset IDs from existing Sanity images
    if (product.images?.length) {
      this.imagePreviews.set(product.images.map((img: any) => img.url).filter(Boolean));
      this.imageAssetIds.set(product.images.map((img: any) => img.assetId).filter(Boolean));
    }

    // Populate form
    this.form.patchValue({
      name:             product.name ?? '',
      brand:            product.brand ?? '',
      shortDescription: product.shortDescription ?? '',
      description:      product.description ?? '',
      categoryId:       product.categoryId ?? '',
      price:            product.price ?? null,
      originalPrice:    product.originalPrice ?? null,
      discountPercent:  product.discountPercent ?? null,
      stockCount:       product.stockCount ?? 0,
      sku:              product.sku ?? '',
      material:         product.material ?? '',
      tags:             Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags ?? ''),
      isFeatured:       product.isFeatured ?? false,
      isNewArrival:     product.isNewArrival ?? false,
      isBestSeller:     product.isBestSeller ?? false,
      rating:           product.rating ?? null,
      reviewCount:      product.reviewCount ?? 0,
    });

    // Populate variants
    (product.variants ?? []).forEach((v: any) => {
      this.variants.push(this.fb.group({
        size:     [v.size ?? ''],
        color:    [v.color ?? ''],
        colorHex: [v.colorHex ?? '#000000'],
        stock:    [v.stock ?? 0],
        sku:      [v.sku ?? ''],
      }));
    });

    this.pageLoading.set(false);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  addVariant() {
    this.variants.push(this.fb.group({
      size: [''], color: [''], colorHex: ['#000000'], stock: [0], sku: [''],
    }));
  }

  removeVariant(i: number) {
    this.variants.removeAt(i);
  }

  async onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadingImages.set(true);
    for (const file of Array.from(input.files)) {
      const currentIndex = this.imagePreviews().length;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews.update((p) => [...p, e.target!.result as string]);
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
      try {
        this.uploadingIndex.set(currentIndex);
        const assetId = await this.write.uploadImage(file);
        this.imageAssetIds.update((ids) => [...ids, assetId]);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }
    this.uploadingImages.set(false);
    this.uploadingIndex.set(-1);
    input.value = '';
  }

  removeImage(index: number) {
    this.imagePreviews.update((p) => p.filter((_, i) => i !== index));
    this.imageAssetIds.update((ids) => ids.filter((_, i) => i !== index));
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
      await this.write.updateProduct(this.productId(), { ...v, variants: v.variants ?? [] }, this.imageAssetIds());
      this.router.navigate(['/admin/products']);
    } catch (err: any) {
      this.submitError.set(err?.message ?? 'Failed to update product. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
}
