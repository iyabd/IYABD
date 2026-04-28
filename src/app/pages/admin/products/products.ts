import { ChangeDetectionStrategy, Component, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product';
import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-heading font-black tracking-tight flex items-center gap-2">
              All Products
            </h1>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ filteredProducts().length }} items in your catalog</p>
          </div>
        </div>
        <a routerLink="/admin/add-product" class="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
          <mat-icon>add</mat-icon>
        </a>
      </header>

      <!-- Filters -->
      <div class="space-y-4">
        <div class="relative group">
          <input id="productSearch" type="text" [(ngModel)]="searchQuery" placeholder="Search by name or SKU..." 
                 class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all soft-shadow placeholder:text-slate-300 font-bold text-sm">
          <label for="productSearch" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <mat-icon>search</mat-icon>
          </label>
        </div>
        
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          @for (cat of categories(); track cat) {
            <button (click)="activeCategory.set(cat)"
                    class="whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border"
                    [class]="activeCategory() === cat ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500 hover:border-primary/50'">
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Product List -->
      <div class="grid grid-cols-1 gap-4">
        @for (product of filteredProducts(); track product.id) {
          <div class="bg-white dark:bg-zinc-900 p-4 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center gap-4 group hover:border-primary/30 transition-all relative">
            
            <!-- Product Image & Status -->
            <div class="relative w-full sm:w-24 aspect-square">
              <img [src]="product.images[0] || 'https://picsum.photos/seed/placeholder/400/400'" alt="{{ product.name }}" 
                   class="w-full h-full rounded-[2rem] object-cover bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800">
              
              <div class="absolute -top-1 -right-1 flex flex-col gap-1">
                @if (product.status === 'Draft') {
                  <div class="bg-slate-400 text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">Draft</div>
                }
                @if (product.status === 'Hidden') {
                  <div class="bg-orange-500 text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">Hidden</div>
                }
                @if (product.status === 'Stock Out') {
                  <div class="bg-red-500 text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">Stock Out</div>
                }
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 min-w-0 w-full text-center sm:text-left">
              <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                 <div class="flex-1">
                    <div class="flex items-center flex-wrap gap-2 mb-1">
                       <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ product.category }}</span>
                       <span class="text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-widest">{{ product.sku || 'NO-SKU' }}</span>
                       @if (product.facebookSync?.status) {
                         <span class="text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest"
                               [ngClass]="{
                                 'bg-slate-200 text-slate-500': product.facebookSync?.status === 'not_connected',
                                 'bg-amber-100 text-amber-600': product.facebookSync?.status === 'pending',
                                 'bg-emerald-100 text-emerald-600': product.facebookSync?.status === 'posted',
                                 'bg-red-100 text-red-600': product.facebookSync?.status === 'failed'
                               }">
                           FB: {{ product.facebookSync?.status }}
                         </span>
                       }
                    </div>
                    <h3 class="font-black text-base truncate">{{ product.name }}</h3>
                 </div>
                 <div class="flex items-center gap-2">
                    <button (click)="shareProduct(product)" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                      <mat-icon class="text-sm">share</mat-icon>
                    </button>
                    <button (click)="editProduct(product.id)" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                      <mat-icon class="text-sm">edit</mat-icon>
                    </button>
                    <button (click)="updateStatus(product.id, 'Stock Out')" 
                            class="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                            [class]="product.status === 'Stock Out' ? 'bg-red-500 text-white' : 'bg-slate-50 dark:bg-zinc-800 text-slate-400'">
                      <mat-icon class="text-sm">report_off</mat-icon>
                    </button>
                    <button (click)="deleteProduct(product.id)" class="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                      <mat-icon class="text-sm">delete</mat-icon>
                    </button>
                 </div>
              </div>

              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                 <div class="flex items-center gap-2">
                    @if (product.salePrice) {
                      <span class="text-primary font-black text-lg taka-symbol">{{ product.salePrice }}</span>
                      <span class="text-[10px] text-slate-300 line-through taka-symbol font-bold">{{ product.regularPrice }}</span>
                    } @else {
                      <span class="text-primary font-black text-lg taka-symbol">{{ product.regularPrice }}</span>
                    }
                 </div>
                 
                 <div class="h-4 w-px bg-slate-100 dark:bg-zinc-800 hidden sm:block"></div>

                 <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock:</span>
                    <span [ngClass]="(product.stock <= (product.lowStockAlert || 5)) ? 'text-red-500' : (product.stock > 10 ? 'text-emerald-500' : 'text-orange-500')" class="text-[10px] font-black flex items-center gap-1">
                       {{ product.stock }}
                       @if (product.stock <= (product.lowStockAlert || 5) && product.stock > 0) {
                          <mat-icon class="text-[10px] w-[10px] h-[10px]">warning</mat-icon>
                       }
                    </span>
                 </div>
                 
                 <div class="h-4 w-px bg-slate-100 dark:bg-zinc-800 hidden sm:block"></div>
                 
                 <div class="flex items-center gap-2">
                   <div [class]="product.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'" class="w-2 h-2 rounded-full"></div>
                   <span class="text-[8px] font-black uppercase text-slate-500">{{ product.status }}</span>
                 </div>
              </div>
            </div>

            <!-- Toggles (Hide/Show & Active) -->
            <div class="sm:border-l border-slate-50 dark:border-zinc-800/50 sm:pl-4 flex flex-row sm:flex-col items-center justify-center gap-4 w-full sm:w-auto">
               <div class="flex flex-col items-center gap-1">
                  <button (click)="toggleHideShow(product)" 
                           class="w-10 h-6 rounded-full relative transition-all shadow-inner"
                           [class]="product.status === 'Active' ? 'bg-primary' : 'bg-slate-200 dark:bg-zinc-700'">
                     <div class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md"
                          [class]="product.status === 'Active' ? 'right-1' : 'left-1'"></div>
                   </button>
                   <span class="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Visibility</span>
               </div>

               <div class="flex flex-col items-center gap-1">
                  <button (click)="productService.toggleActive(product.id)" 
                           class="w-10 h-6 rounded-full relative transition-all shadow-inner"
                           [class]="product.active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'">
                     <div class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md"
                          [class]="product.active ? 'right-1' : 'left-1'"></div>
                   </button>
                   <span class="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Enabled</span>
               </div>
            </div>
          </div>
        } @empty {
          <div class="py-24 text-center space-y-6">
             <div class="w-20 h-20 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100 dark:border-zinc-800">
                <mat-icon class="text-4xl">inventory_2</mat-icon>
             </div>
             <div class="space-y-2">
               <p class="text-slate-500 font-black text-lg">Empty Inventory</p>
               <p class="text-slate-400 text-xs font-bold max-w-[200px] mx-auto">Start building your shop by adding your first product!</p>
             </div>
             <a routerLink="/admin/add-product" class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
               <mat-icon>add</mat-icon>
               Create First Product
             </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Products {
  location = inject(Location);
  router = inject(Router);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  private platformId = inject(PLATFORM_ID);

  searchQuery = signal('');
  activeCategory = signal('All');
  
  activeCategories = computed(() => this.categoryService.getActiveCategories());
  categories = computed<string[]>(() => ['All', ...this.activeCategories().map((c: {name: string}) => c.name)]);
  
  allProducts = this.productService.getProducts();

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();
    
    return this.allProducts().filter(p => {
      const matchSearch = p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query));
      const matchCat = cat === 'All' || p.category === cat;
      return matchSearch && matchCat;
    });
  });

  editProduct(id: number) {
    this.router.navigate(['/admin/edit-product', id]);
  }

  updateStatus(id: number, status: string) {
    const products = this.allProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      // Toggle logic if same status, otherwise set
      const newStatus = product.status === status ? 'Active' : status;
      this.productService.saveProduct({ 
        id, 
        status: newStatus as Product['status']
      } as Partial<Product>);
    }
  }

  toggleHideShow(product: Product) {
    const newStatus = product.status === 'Active' ? 'Hidden' : 'Active';
    this.productService.saveProduct({ 
      id: product.id, 
      status: newStatus as Product['status']
    } as Partial<Product>);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
    }
  }

  shareProduct(product: {name: string, id: number}) {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = window.location.origin + '/product/' + product.id;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on IYABD SHOP!`,
        url: url
      }).catch(() => {
        // Fallback for cancel or error in iframe
        navigator.clipboard.writeText(url).then(() => {
          alert('Product link copied to clipboard!');
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Product link copied to clipboard!');
      });
    }
  }
}


