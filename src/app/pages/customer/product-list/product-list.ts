import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product';
import { CategoryService } from '../../../services/category';
import { CartService } from '../../../services/cart';
import { SeoService } from '../../../services/seo';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 pb-12 animate-in fade-in duration-500">
      <!-- Category Banner -->
      @if (activeCategoryData(); as cat) {
        @if (cat.bannerImage) {
          <div class="relative w-full h-48 sm:h-64 rounded-[3rem] overflow-hidden soft-shadow mb-8 group">
             <img [src]="cat.bannerImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" [alt]="cat.name">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12">
                <h2 class="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter">{{ cat.bannerTitle || cat.name }}</h2>
                <p class="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-[0.2em] mt-2">{{ cat.bannerSubtitle || 'Explore our latest collection' }}</p>
             </div>
          </div>
        } @else {
          <header class="space-y-1">
            <h1 class="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {{ activeCategory() === 'All' ? 'Curated Drops' : activeCategory() }}
            </h1>
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">
              {{ filteredProducts().length }} Items Found {{ searchQuery() ? 'for "' + searchQuery() + '"' : '' }}
            </p>
          </header>
        }
      }

      <!-- Category Filter Horizontal -->
      <div class="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
        @for (cat of categories(); track cat) {
          <button (click)="setActiveCategory(cat)"
                  class="whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm"
                  [class]="activeCategory() === cat ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500 hover:border-primary/50'">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Main Products Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        @for (product of filteredProducts(); track product.id) {
          <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 overflow-hidden group relative flex flex-col h-full">
            <!-- Wishlist -->
            <button class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
              <mat-icon class="text-lg">favorite_border</mat-icon>
            </button>

            <!-- Image -->
            <a [routerLink]="['/product', product.id]" class="block relative aspect-square bg-slate-50 dark:bg-zinc-800 overflow-hidden">
            
            <!-- Badges -->
            <div class="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
               @if (product.badges?.newArrival || product.newArrival) {
                  <span class="bg-indigo-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">New</span>
               }
               @if (product.badges?.bestSeller || product.bestSelling) {
                  <span class="bg-amber-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">Best Seller</span>
               }
               @if (product.badges?.specialOffer || product.offerProduct) {
                  <span class="bg-rose-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">Offer</span>
               }
               @if (product.badges?.featured || product.featured) {
                  <span class="bg-blue-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">Featured</span>
               }
            </div>

              @if (product.status === 'Stock Out') {
                 <div class="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div class="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                       Stock Out
                    </div>
                 </div>
              }
              <img [src]="product.images[0]" loading="lazy" referrerpolicy="no-referrer" alt="Product" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              
              @if (product.salePrice && product.salePrice < product.regularPrice) {
                <div class="absolute bottom-4 left-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                  Save {{ Math.round((1 - (product.salePrice / product.regularPrice)) * 100) }}%
                </div>
              }
            </a>

            <!-- Info -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-1">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ product.category }}</p>
                <h3 class="font-black text-sm text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem] tracking-tight group-hover:text-primary transition-colors">
                  {{ product.name }}
                </h3>
              </div>

              <div class="flex items-center justify-between gap-2 pt-2">
                <div class="flex flex-col">
                  @if (product.salePrice) {
                    <span class="text-[9px] text-slate-400 font-bold line-through taka-symbol">{{ product.regularPrice }}</span>
                    <span class="text-lg font-black text-primary taka-symbol">{{ product.salePrice }}</span>
                  } @else {
                    <span class="text-lg font-black text-primary taka-symbol">{{ product.regularPrice }}</span>
                  }
                </div>
                <button (click)="addToCart(product)" 
                        [disabled]="product.status === 'Stock Out'"
                        [class.opacity-50]="product.status === 'Stock Out'"
                        class="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                  <mat-icon class="font-black !text-[20px]">add_shopping_cart</mat-icon>
                </button>
              </div>
            </div>
          </div>
        } @empty {
           <div class="col-span-full py-32 text-center space-y-6">
              <div class="w-24 h-24 bg-slate-50 dark:bg-zinc-900 rounded-[3rem] flex items-center justify-center mx-auto border border-slate-100 dark:border-zinc-800">
                 <mat-icon class="text-5xl text-slate-200">sentiment_dissatisfied</mat-icon>
              </div>
              <div class="space-y-2">
                 <p class="text-2xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-tight italic">No Drops Found</p>
                 <p class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] max-w-xs mx-auto">Try a different category or search term to discover other hidden gems.</p>
              </div>
           </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ProductList implements OnInit {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  seoService = inject(SeoService);
  router = inject(Router);

  activeCategory = signal('All');
  searchQuery = signal('');
  
  activeCategoryData = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'All') return null;
    return this.categoryService.getActiveCategories().find(c => c.name === cat) || null;
  });

  activeCategories = computed(() => this.categoryService.getActiveCategories());
  categories = computed(() => ['All', ...this.activeCategories().map(c => c.name)]);
  
  Math = Math;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.activeCategory.set(params['category']);
      }
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      
      this.seoService.updateMeta({
        title: this.activeCategory() !== 'All' ? this.activeCategory() : 'All Products',
        description: `Browse our exclusive collection of ${this.activeCategory().toLowerCase()} products.`
      });
    });
  }

  setActiveCategory(cat: string) {
    this.activeCategory.set(cat);
    this.searchQuery.set('');
  }

  filteredProducts = computed(() => {
    const all = this.productService.getCustomerProducts()();
    const cat = this.activeCategory();
    const query = this.searchQuery().toLowerCase().trim();
    
    return all.filter((p: Product) => {
      const matchCat = cat === 'All' || p.category === cat;
      const matchSearch = !query || p.name.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query);
      return p.active && matchCat && matchSearch;
    });
  });

  addToCart(product: Product) {
    if ((product.variants && product.variants.length > 0) || (product.sizeVariants && product.sizeVariants.length > 0)) {
       this.router.navigate(['/product', product.id]);
       return;
    }
    this.cartService.addToCart({
      id: String(product.id),
      productId: String(product.id),
      name: product.name,
      price: product.salePrice ?? product.regularPrice,
      image: product.images[0],
      quantity: 1
    });
    alert('Added to Cart!');
  }
}
