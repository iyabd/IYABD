import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product, ProductVariant } from '../../../services/product';
import { CategoryService } from '../../../services/category';
import { FacebookService } from '../../../services/facebook';

import { firstValueFrom } from 'rxjs';

type ProductFormData = Partial<Product> & { fbSync?: boolean };

@Component({
  selector: 'app-admin-add-edit-product',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  providers: [FacebookService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center gap-4">
        <button type="button" (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl font-heading font-black tracking-tight">
            {{ isEditMode() ? 'Edit Product' : 'Add New Product' }}
          </h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ isEditMode() ? 'Updating existing inventory' : 'Create a new catalog item' }}</p>
        </div>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
        <!-- Gallery Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between pl-4">
             <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Gallery (Max 8 Images)</div>
             <span class="text-[8px] font-black uppercase text-primary">{{ formData.images?.length || 0 }}/8</span>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            @for (img of formData.images; track $index) {
              <div class="aspect-square rounded-3xl overflow-hidden relative group border-2 border-slate-100 dark:border-zinc-800 soft-shadow">
                <img [src]="img" class="w-full h-full object-cover" alt="Product image preview">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button type="button" (click)="removeImage($index)" class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                     <mat-icon class="text-sm">delete</mat-icon>
                   </button>
                </div>
                @if ($index === 0) {
                  <div class="absolute bottom-2 left-2 bg-primary text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full z-10">Thumbnail</div>
                }
              </div>
            }
            
            @if ((formData.images?.length || 0) < 8) {
              <div class="aspect-square rounded-3xl bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all group cursor-pointer relative">
                <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple (change)="onFilesSelected($event)">
                <div class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow group-hover:scale-110 transition-transform">
                  <mat-icon class="text-primary">add_a_photo</mat-icon>
                </div>
                <span class="text-[8px] font-black uppercase tracking-widest text-center px-4">Add from Gallery</span>
              </div>
            }
          </div>
        </div>

        <div class="space-y-8">
          <!-- Basic Info & Status -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
               <div class="space-y-2">
                 <label for="prodName" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Product Name</label>
                 <input id="prodName" type="text" [(ngModel)]="formData.name" placeholder="Enter product name..." 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
               </div>

               <div class="grid grid-cols-2 gap-4">
                 <div class="space-y-2">
                   <label for="prodCat" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Category</label>
                   <select id="prodCat" [(ngModel)]="formData.category" 
                           class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none">
                     <option value="">Select Category</option>
                     @for (cat of activeCategories(); track cat.id) {
                       <option [value]="cat.name">{{ cat.name }}</option>
                     }
                   </select>
                 </div>
                 <div class="space-y-2">
                   <label for="subCat" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Sub Category</label>
                   <input id="subCat" type="text" [(ngModel)]="formData.subCategory" placeholder="e.g. Winter Collection" 
                          class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                 </div>
               </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Product Status</div>
                <div class="grid grid-cols-2 gap-2">
                  @for (status of ['Active', 'Hidden', 'Stock Out', 'Draft']; track status) {
                    <button (click)="setStatus(status)"
                            [class]="formData.status === status ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500'"
                            class="py-3 px-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">
                      {{ status }}
                    </button>
                  }
                </div>
                <p class="text-[8px] font-bold text-slate-400 mt-2 px-2 text-center italic">
                  @if (formData.status === 'Active') { Live in Customer Panel }
                  @else if (formData.status === 'Hidden') { Not visible to customers }
                  @else if (formData.status === 'Stock Out') { Visible but order disabled }
                  @else { Admin view only }
                </p>
              </div>
            </div>
          </div>

          <!-- Pricing & Variation Strategy -->
          <div class="p-8 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] border border-slate-100 dark:border-zinc-700 space-y-8">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Size Management -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Available Sizes</h3>
                    <button type="button" (click)="addSize()" class="text-[10px] font-black text-primary uppercase tracking-widest">Add Size</button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    @for (s of ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']; track s) {
                      <button type="button" (click)="toggleSuggestedSize(s)" 
                              [class]="isSizeSelected(s) ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-900 text-slate-500 border border-slate-200 dark:border-zinc-700'"
                              class="px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all">
                        {{ s }}
                      </button>
                    }
                  </div>
                  <div class="space-y-2">
                    @for (s of formData.sizeVariants; track $index) {
                      <div class="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl">
                        <input type="text" [(ngModel)]="s.size" placeholder="Size" class="w-16 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg p-2 text-[10px] font-black">
                        <input type="number" [(ngModel)]="s.price" placeholder="Extra Price" class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg p-2 text-[10px] font-black text-primary">
                        <input type="number" [(ngModel)]="s.stock" placeholder="Stock" class="w-16 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg p-2 text-[10px] font-black">
                        <button type="button" (click)="removeSizeVariant($index)" class="text-red-500"><mat-icon class="text-sm">close</mat-icon></button>
                      </div>
                    }
                  </div>
                </div>

                 <!-- Color Management -->
                 <div class="space-y-4">
                   <div class="flex items-center justify-between">
                     <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Color Variants</h3>
                     <button type="button" (click)="addVariant()" class="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Add Color Variant</button>
                   </div>
                   <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Each color can have its own prices, gallery, and size-specific stock.</p>
                 </div>
              </div>
 
              <div class="border-t border-slate-200 dark:border-zinc-700 pt-8 space-y-6">
                 @if (formData.variants?.length) {
                   <div class="space-y-6">
                     @for (v of formData.variants; track v.id; let vIdx = $index) {
                       <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6 relative group">
                          <button type="button" (click)="removeVariant(vIdx)" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                             <mat-icon>delete_outline</mat-icon>
                          </button>
                          
                          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
                             <!-- Color & Price Info -->
                             <div class="md:col-span-4 space-y-4">
                               <div class="grid grid-cols-2 gap-4">
                                  <div class="space-y-1">
                                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Color Name</div>
                                     <input type="text" [(ngModel)]="v.color" placeholder="Blue" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-black">
                                  </div>
                                  <div class="space-y-1">
                                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Color Code</div>
                                     <div class="flex items-center gap-2">
                                        <input type="color" [(ngModel)]="v.colorCode" class="w-10 h-10 rounded-xl border-none outline-none cursor-pointer p-0">
                                        <input type="text" [(ngModel)]="v.colorCode" class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-[10px] font-mono">
                                     </div>
                                  </div>
                               </div>

                               <div class="grid grid-cols-2 gap-4">
                                  <div class="space-y-1">
                                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Reg. Price (৳)</div>
                                     <input type="number" [(ngModel)]="v.regularPrice" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-black">
                                  </div>
                                  <div class="space-y-1">
                                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Sale Price (৳)</div>
                                     <input type="number" [(ngModel)]="v.salePrice" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-black text-primary">
                                  </div>
                               </div>

                               <div class="space-y-2">
                                  <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Variant Images (Color Specific)</div>
                                  <div class="flex flex-wrap gap-2">
                                     @for (vimg of v.images; track $index; let imgIdx = $index) {
                                       <div class="w-12 h-12 rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden relative group/vimg">
                                          <img [src]="vimg" alt="Variant image" class="w-full h-full object-cover">
                                          <button (click)="removeVariantImage(vIdx, imgIdx)" class="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/vimg:opacity-100 transition-opacity">
                                             <mat-icon class="text-xs">close</mat-icon>
                                          </button>
                                       </div>
                                     }
                                     @if (v.images.length < 5) {
                                       <button (click)="addVariantImage(vIdx)" class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-400">
                                          <mat-icon>add_a_photo</mat-icon>
                                       </button>
                                     }
                                  </div>
                               </div>
                             </div>

                             <!-- Sizes & Stock Info -->
                             <div class="md:col-span-8 space-y-4">
                                <div class="flex items-center justify-between">
                                   <div class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Sizes & Stock for {{ v.color || 'this color' }}</div>
                                   <button (click)="addSizeToVariant(vIdx)" class="text-[8px] font-black text-primary uppercase tracking-widest">Add Size</button>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   @for (sz of v.sizes; track $index; let sIdx = $index) {
                                     <div class="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/50 flex items-center gap-3">
                                        <div class="flex-1 space-y-1">
                                           <div class="text-[6px] font-black text-slate-400 uppercase tracking-widest">Size</div>
                                           <input type="text" [(ngModel)]="sz.size" placeholder="e.g. M" class="w-full bg-white dark:bg-zinc-900 border-none rounded-lg p-2 text-[10px] font-black">
                                        </div>
                                        <div class="w-20 space-y-1">
                                           <div class="text-[6px] font-black text-slate-400 uppercase tracking-widest">Stock</div>
                                           <input type="number" [(ngModel)]="sz.stock" class="w-full bg-white dark:bg-zinc-900 border-none rounded-lg p-2 text-[10px] font-black">
                                        </div>
                                        <div class="w-24 space-y-1">
                                           <div class="text-[6px] font-black text-slate-400 uppercase tracking-widest">Price (Optional)</div>
                                           <input type="number" [(ngModel)]="sz.price" placeholder="৳" class="w-full bg-white dark:bg-zinc-900 border-none rounded-lg p-2 text-[10px] font-black">
                                        </div>
                                        <button (click)="removeSizeFromVariant(vIdx, sIdx)" class="text-red-500 mt-4">
                                           <mat-icon class="text-sm">delete_outline</mat-icon>
                                        </button>
                                     </div>
                                   }
                                   @if (v.sizes.length === 0) {
                                      <div class="col-span-full py-8 text-center bg-slate-50/50 dark:bg-zinc-800/20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-zinc-800">
                                         <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">No sizes added for this color yet</p>
                                      </div>
                                   }
                                </div>

                                <div class="flex items-center gap-2 pt-2">
                                   <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quick Add Sizes:</div>
                                   <div class="flex gap-1">
                                      @for (q of ['S', 'M', 'L', 'XL', 'XXL']; track q) {
                                        <button (click)="quickAddSizeToVariant(vIdx, q)" class="px-2 py-1 rounded bg-white dark:bg-zinc-900 text-[8px] font-black border border-slate-200 dark:border-zinc-700 hover:border-primary transition-colors">{{ q }}</button>
                                      }
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                     }
                   </div>
                 } @else {
                    <div class="py-12 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-zinc-800">
                       <mat-icon class="text-slate-300 text-4xl mb-4">palette</mat-icon>
                       <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">No color variants added yet</p>
                       <button (click)="addVariant()" class="bg-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Add First Color Variant</button>
                    </div>
                 }
              </div>
           </div>

          <!-- Description & Details -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div class="space-y-6">
                <div class="space-y-2">
                  <label for="fabricDetails" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Fabric & Material Details</label>
                  <textarea id="fabricDetails" [(ngModel)]="formData.fabric" rows="8" placeholder="Fabric type, GSM, Wash instruction, Comfort details..." 
                            class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-3xl p-6 text-sm font-medium leading-relaxed resize-none focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
             </div>
             <div class="space-y-6">
                <div class="space-y-2">
                  <label for="fullDesc" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Full Product Description</label>
                  <textarea id="fullDesc" [(ngModel)]="formData.fullDescription" rows="8" placeholder="Product story, features, benefits..." 
                            class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-3xl p-6 text-sm font-medium leading-relaxed resize-none focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
             </div>
          </div>

          <!-- Advanced Product Fields Add-on -->
          <div class="bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-zinc-700 space-y-6">
             <div class="flex items-center gap-3 mb-2">
                <mat-icon class="text-slate-400">tune</mat-icon>
                <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Advanced Details (Optional)</h3>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Product SKU</label>
                    <input type="text" [(ngModel)]="formData.sku" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Product Code</label>
                    <input type="text" [(ngModel)]="formData.productCode" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Brand Name</label>
                    <input type="text" [(ngModel)]="formData.brandName" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Cost Price (৳)</label>
                    <input type="number" [(ngModel)]="formData.costPrice" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black text-emerald-600">
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Estimated Profit (৳)</label>
                    <div class="w-full bg-slate-100 dark:bg-zinc-900/50 border-none rounded-xl p-3 text-xs font-black text-emerald-500 line-clamp-1">
                       {{ calculateProfit() }}
                    </div>
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Low Stock Alert Qty</label>
                    <input type="number" [(ngModel)]="formData.lowStockAlert" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black text-amber-500">
                 </div>
                 <div class="space-y-1">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Product Weight</label>
                    <input type="text" [(ngModel)]="formData.weight" placeholder="e.g. 500g, 1.2kg" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1 col-span-1 md:col-span-2">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Product Video URL</label>
                    <input type="text" [(ngModel)]="formData.videoUrl" placeholder="YouTube/FB Video Link" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1 col-span-1 md:col-span-3">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Tags (Comma separated)</label>
                    <input type="text" [ngModel]="formData.tags?.join(', ')" (ngModelChange)="updateTags($event)" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <!-- SEO -->
                 <div class="space-y-1 col-span-1 md:col-span-3 border-t border-slate-200 dark:border-zinc-700 pt-4 mt-2">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">SEO Title</label>
                    <input type="text" [(ngModel)]="formData.seoTitle" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                 </div>
                 <div class="space-y-1 col-span-1 md:col-span-3">
                    <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">SEO Description</label>
                    <textarea [(ngModel)]="formData.seoDescription" rows="2" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20"></textarea>
                 </div>
                 <!-- Policies -->
                 <div class="space-y-1 col-span-1 md:col-span-3 border-t border-slate-200 dark:border-zinc-700 pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div class="space-y-1">
                        <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Warranty Policy</label>
                        <textarea [(ngModel)]="formData.warrantyPolicy" rows="3" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs"></textarea>
                     </div>
                     <div class="space-y-1">
                        <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Return Policy</label>
                        <textarea [(ngModel)]="formData.returnPolicy" rows="3" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs"></textarea>
                     </div>
                     <div class="space-y-1">
                        <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Care Instructions</label>
                        <textarea [(ngModel)]="formData.careInstructions" rows="3" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs"></textarea>
                     </div>
                 </div>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div class="space-y-6 p-8 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] border border-slate-100 dark:border-zinc-700">
                <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Shipping Settings</h3>
                <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-1">
                      <label for="inDhaka" class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Inside Dhaka (৳)</label>
                      <input id="inDhaka" type="number" [(ngModel)]="formData.deliveryInsideDhaka" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                   </div>
                   <div class="space-y-1">
                      <label for="outDhaka" class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Outside Dhaka (৳)</label>
                      <input id="outDhaka" type="number" [(ngModel)]="formData.deliveryOutsideDhaka" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                   </div>
                   <div class="space-y-1">
                      <label for="estDays" class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">Estimated Days</label>
                      <input id="estDays" type="text" [(ngModel)]="formData.estimatedDays" placeholder="2-3 Days" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                   </div>
                   <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900/50 rounded-xl">
                      <span class="text-[8px] font-black uppercase text-slate-500">Cash on Delivery</span>
                      <button type="button" (click)="formData.cashOnDelivery = !formData.cashOnDelivery" [class]="formData.cashOnDelivery ? 'bg-emerald-500' : 'bg-slate-300'" class="w-8 h-4 rounded-full relative transition-all">
                        <div [class]="formData.cashOnDelivery ? 'translate-x-4' : 'translate-x-0.5'" class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"></div>
                      </button>
                   </div>
                </div>
             </div>

             <div class="space-y-6 p-8 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] border border-primary/10 dark:border-primary/20">
                <h3 class="text-xs font-black text-primary uppercase tracking-widest mb-4">Special Offer System</h3>
                <div class="grid grid-cols-2 gap-4">
                   <div class="col-span-2 space-y-1">
                      <label for="offerTitle" class="text-[8px] font-black text-primary/60 uppercase tracking-widest pl-2">Offer Title</label>
                      <input id="offerTitle" type="text" [(ngModel)]="formData.offerTitle" placeholder="e.g. Buy 2 & Get Free Delivery" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                   </div>
                   <div class="space-y-1">
                      <label for="minQty" class="text-[8px] font-black text-primary/60 uppercase tracking-widest pl-2">Min Qty for Free Delivery</label>
                      <input id="minQty" type="number" [(ngModel)]="formData.minQtyForFreeDelivery" class="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-black">
                   </div>
                   <div class="flex items-center justify-between p-3 bg-white dark:bg-zinc-900/50 rounded-xl">
                      <span class="text-[8px] font-black uppercase text-primary/60">Free Delivery</span>
                      <button type="button" (click)="formData.offerFreeDelivery = !formData.offerFreeDelivery" [class]="formData.offerFreeDelivery ? 'bg-primary' : 'bg-slate-300'" class="w-8 h-4 rounded-full relative transition-all">
                        <div [class]="formData.offerFreeDelivery ? 'translate-x-4' : 'translate-x-0.5'" class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"></div>
                      </button>
                   </div>
                </div>
             </div>

             <!-- Facebook Auto Sync Card -->
             <div class="space-y-6 p-8 bg-[#1877F2]/5 dark:bg-[#1877F2]/10 rounded-[2.5rem] border border-[#1877F2]/10 dark:border-[#1877F2]/20">
                <div class="flex items-center gap-3 mb-4">
                   <div class="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center">
                      <mat-icon class="text-sm font-black">facebook</mat-icon>
                   </div>
                   <h3 class="text-xs font-black text-[#1877F2] uppercase tracking-widest">Facebook Feed Sync</h3>
                   
                   @if (formData.facebookSync?.status) {
                     <span class="ml-auto px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                           [ngClass]="{
                             'bg-slate-200 text-slate-500': formData.facebookSync?.status === 'not_connected',
                             'bg-amber-100 text-amber-600': formData.facebookSync?.status === 'pending',
                             'bg-emerald-100 text-emerald-600': formData.facebookSync?.status === 'posted',
                             'bg-red-100 text-red-600': formData.facebookSync?.status === 'failed'
                           }">
                       {{ formData.facebookSync?.status }}
                     </span>
                   }
                </div>
                
                <div class="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl">
                   <div class="space-y-1">
                      <p class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Share this product to Facebook</p>
                      <p class="text-[8px] font-bold text-slate-500 uppercase">Share this product to your official page automatically after saving.</p>
                      @if (formData.facebookSync?.status === 'failed') {
                        <p class="text-[8px] font-black text-red-500">Error: {{ formData.facebookSync?.errorMessage }}</p>
                      }
                      @if (formData.facebookSync?.lastSyncedAt) {
                        <p class="text-[8px] font-black text-emerald-500">Last Synced: {{ formData.facebookSync?.lastSyncedAt | date:'short' }}</p>
                      }
                   </div>
                   <div class="flex flex-col items-end gap-2">
                     <button type="button" (click)="toggleFacebookSync()" 
                             [class]="formData.facebookSync?.enabled ? 'bg-[#1877F2]' : 'bg-slate-300'" 
                             class="w-10 h-5 rounded-full relative transition-all">
                        <div [class]="formData.facebookSync?.enabled ? 'translate-x-5' : 'translate-x-0.5'" 
                             class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"></div>
                     </button>
                     @if (formData.facebookSync?.status === 'failed') {
                        <button type="button" (click)="retrySync()" class="text-[8px] font-black text-[#1877F2] uppercase hover:underline">Retry</button>
                     }
                   </div>
                </div>

                @if (formData.facebookSync?.enabled) {
                   <div class="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
                       <button type="button" class="w-full py-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1877F2]/20 transition-colors">
                         Connect Facebook Page
                       </button>
                      <label for="fbCaption" class="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-4 mt-4 block">Custom Caption (Optional)</label>
                      <textarea id="fbCaption" [(ngModel)]="formData.offerBadgeText" placeholder="e.g. New Drop! High quality handmade wallets now in stock..." 
                                class="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-[#1877F2]/20"></textarea>
                   </div>
                }
             </div>
          </div>


          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
             @for (flag of flags; track flag.key) {
               <button (click)="toggleFlag(flag.key)"
                       [class]="isFlagActive(flag.key) ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-zinc-800 border-transparent text-slate-400'"
                       class="p-4 rounded-2xl border transition-all text-center space-y-1">
                  <mat-icon class="text-xl">{{ flag.icon }}</mat-icon>
                  <p class="text-[8px] font-black uppercase tracking-widest truncate">{{ flag.label }}</p>
               </button>
             }
          </div>

          <button (click)="onSubmit()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-6 hover:scale-[1.01] active:scale-95 transition-all">
            {{ isEditMode() ? 'Save Changes' : 'Publish Product' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; } select { -webkit-appearance: none; }`]
})
export class AddEditProduct implements OnInit {
  location = inject(Location);
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  fbService = inject(FacebookService);

  isEditMode = signal(false);
  activeCategories = computed(() => this.categoryService.getActiveCategories());
  
  formData: ProductFormData = {
    name: '',
    images: [],
    category: '',
    regularPrice: 0,
    salePrice: undefined,
    stock: 0,
    status: 'Active',
    shortDescription: '',
    fullDescription: '',
    size: '',
    color: '',
    weight: '',
    deliveryInsideDhaka: 60,
    deliveryOutsideDhaka: 120,
    estimatedDays: '2-3 Days',
    cashOnDelivery: true,
    offerFreeDelivery: false,
    featured: false,
    newArrival: true,
    bestSelling: false,
    active: true,
    sku: '',
    fbSync: true,
    facebookSync: {
      enabled: false,
      status: 'not_connected'
    },
    badges: {
      featured: false,
      newArrival: true,
      bestSeller: false,
      specialOffer: false
    }
  };

  calculateProfit(): string {
     const salePrice = this.formData.salePrice || this.formData.regularPrice || 0;
     const costPrice = this.formData.costPrice || 0;
     const profit = salePrice - costPrice;
     return profit > 0 ? '+' + profit : '' + profit;
  }

  toggleFacebookSync() {
    if (!this.formData.facebookSync) {
      this.formData.facebookSync = { enabled: false, status: 'not_connected' };
    }
    this.formData.facebookSync.enabled = !this.formData.facebookSync.enabled;
  }

  flags = [
    { key: 'featured' as keyof Product, label: 'Featured', icon: 'star' },
    { key: 'newArrival' as keyof Product, label: 'New Arrival', icon: 'new_releases' },
    { key: 'bestSelling' as keyof Product, label: 'Best Seller', icon: 'trending_up' },
    { key: 'offerProduct' as keyof Product, label: 'Special Offer', icon: 'local_offer' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode.set(true);
        const existing = this.productService.getProductById(Number(params['id']));
        if (existing) {
          this.formData = { ...existing };
          // Restore toggle states from badges object if it exists
          if (existing.badges && !Array.isArray(existing.badges)) {
             this.formData.featured = existing.badges.featured || false;
             this.formData.newArrival = existing.badges.newArrival || false;
             this.formData.bestSelling = existing.badges.bestSeller || false;
             this.formData.offerProduct = existing.badges.specialOffer || false;
          }
        }
      }
    });
  }

  private compressImage(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  }

  onFilesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (!files || files.length === 0) return;

    const currentImages = this.formData.images || [];
    const remainingSlots = 8 - currentImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const compressed = await this.compressImage(e.target.result as string);
          this.formData.images = [...(this.formData.images || []), compressed];
        }
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.formData.images = this.formData.images?.filter((_, i) => i !== index);
  }

  toggleFlag(key: keyof Product) {
    (this.formData as Record<string, unknown>)[key as string] = !(this.formData as Record<string, boolean>)[key as string];
  }

  isFlagActive(key: keyof Product): boolean {
    return !!(this.formData as Record<string, boolean>)[key as string];
  }

  setStatus(status: string) {
    this.formData.status = status as Product['status'];
  }

  addSize() {
    if (!this.formData.sizeVariants) this.formData.sizeVariants = [];
    this.formData.sizeVariants.push({
      size: '',
      price: 0,
      stock: 50,
      active: true
    });
  }

  toggleSuggestedSize(size: string) {
    if (!this.formData.sizeVariants) this.formData.sizeVariants = [];
    const idx = this.formData.sizeVariants.findIndex(v => v.size === size);
    if (idx >= 0) {
      this.formData.sizeVariants.splice(idx, 1);
    } else {
      this.formData.sizeVariants.push({ size, price: 0, stock: 50, active: true });
    }
  }

  isSizeSelected(size: string): boolean {
    return !!this.formData.sizeVariants?.some(v => v.size === size);
  }



  addVariant() {
    if (!this.formData.variants) this.formData.variants = [];
    this.formData.variants.push({
      id: Date.now(),
      color: '',
      colorCode: '#000000',
      regularPrice: this.formData.regularPrice || 0,
      salePrice: this.formData.salePrice,
      stock: 0,
      images: [],
      sizes: [],
      active: true,
      sku: ''
    });
  }

  addSizeToVariant(vIdx: number) {
    if (!this.formData.variants) return;
    if (!this.formData.variants[vIdx].sizes) this.formData.variants[vIdx].sizes = [];
    this.formData.variants[vIdx].sizes.push({
      size: '',
      stock: 10
    });
  }

  quickAddSizeToVariant(vIdx: number, size: string) {
    if (!this.formData.variants) return;
    if (!this.formData.variants[vIdx].sizes) this.formData.variants[vIdx].sizes = [];
    if (!this.formData.variants[vIdx].sizes.some(s => s.size === size)) {
      this.formData.variants[vIdx].sizes.push({ size, stock: 10 });
    }
  }

  removeSizeFromVariant(vIdx: number, sIdx: number) {
    this.formData.variants?.[vIdx].sizes.splice(sIdx, 1);
  }

  removeVariant(index: number) {
    this.formData.variants?.splice(index, 1);
  }

  async addVariantImage(variantIndex: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (re: ProgressEvent<FileReader>) => {
          if (re.target?.result) {
            const compressed = await this.compressImage(re.target.result as string);
            if (this.formData.variants) {
              this.formData.variants[variantIndex].images.push(compressed);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  removeVariantImage(variantIndex: number, imageIndex: number) {
    if (this.formData.variants) {
      this.formData.variants[variantIndex].images.splice(imageIndex, 1);
    }
  }

  updateSizes(event: string) {
    this.formData.sizes = event.split(',').map(s => s.trim()).filter(s => s);
  }

  updateBadges(event: string) {
    this.formData.badges = event.split(',').map(s => s.trim()).filter(s => s) as ("Hot" | "New" | "Limited" | "Offer")[];
  }

  addSizeVariant() {
    if (!this.formData.sizeVariants) this.formData.sizeVariants = [];
    this.formData.sizeVariants.push({
      size: '',
      price: this.formData.salePrice || this.formData.regularPrice || 0,
      stock: 50,
      active: true
    });
  }

  removeSizeVariant(index: number) {
    this.formData.sizeVariants?.splice(index, 1);
  }

  updateTags(event: string) {
    this.formData.tags = event.split(',').map(s => s.trim()).filter(s => s);
  }

  async runFacebookSync(product: Product) {
     if (!this.formData.facebookSync) {
         this.formData.facebookSync = { enabled: true, status: 'pending' };
     } else {
         this.formData.facebookSync.status = 'pending';
     }
     
     product.facebookSync = this.formData.facebookSync;
     this.productService.saveProduct(product);
     
     try {
         await firstValueFrom(this.fbService.shareProduct({
            name: product.name || '',
            price: product.regularPrice || 0,
            salePrice: product.salePrice,
            link: window.location.origin + '/product/' + product.id,
            image: product.images?.[0] || '',
            offerText: product.offerBadgeText
         }));
         
         this.formData.facebookSync.status = 'posted';
         this.formData.facebookSync.lastSyncedAt = new Date().toISOString();
         product.facebookSync = this.formData.facebookSync;
         this.productService.saveProduct(product);
     } catch (error: any) {
         console.warn("Facebook sync failed but product saved:", error);
         this.formData.facebookSync.status = 'failed';
         this.formData.facebookSync.errorMessage = error.message || 'Unknown error';
         this.formData.facebookSync.lastSyncedAt = new Date().toISOString();
         product.facebookSync = this.formData.facebookSync;
         this.productService.saveProduct(product);
     }
  }

  retrySync() {
      if (this.isEditMode() && this.formData.id) {
         this.runFacebookSync(this.formData as Product);
      }
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.regularPrice) {
      alert('Product Name and Regular Price (৳) are required.');
      return;
    }
    
    // Auto-calculate total stock and base price for listing if variants exist
    if (this.formData.variants?.length) {
       let totalStock = 0;
       let minPrice = Infinity;
       
       this.formData.variants.forEach(v => {
          // If variant has sizes, stock is sum of sizes
          if (v.sizes?.length) {
             v.stock = v.sizes.reduce((s, sz) => s + (sz.stock || 0), 0);
          }
          totalStock += (v.stock || 0);
          
          const vPrice = v.salePrice || v.regularPrice || 0;
          if (vPrice > 0 && vPrice < minPrice) minPrice = vPrice;
       });

       this.formData.stock = totalStock;
       if (minPrice !== Infinity) {
          // We don't necessarily update base price if we want to keep it as "Starting from"
          // but for general listing we can use minPrice
       }
    } else if (this.formData.sizeVariants?.length) {
       this.formData.stock = this.formData.sizeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }

    // Map flags to nested badges object as requested
    this.formData.badges = {
       featured: this.formData.featured || false,
       newArrival: this.formData.newArrival || false,
       bestSeller: this.formData.bestSelling || false,
       specialOffer: this.formData.offerProduct || false
    };

    const saved = this.productService.saveProduct(this.formData as Partial<Product>);
    if (saved) {
      if ((this.formData.fbSync || this.formData.facebookSync?.enabled) && saved.status === 'Active') {
         this.runFacebookSync(saved);
      }
      this.router.navigate(['/admin/products']);
    } else {
      alert('Failed to save product. This usually happens when total product data (including high-res images) exceeds browser storage limits. Try removing some images or using smaller ones.');
    }
  }
}
