import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { BannerService } from '../../../services/banner';
import { CategoryService } from '../../../services/category';
import { ProductService, Product } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { SeoService } from '../../../services/seo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 pb-12 animate-in fade-in duration-700">
      
      <!-- Dynamic Banner Slider -->
      @if (activeBanners().length > 0) {
        <div class="relative w-full aspect-[3/1] sm:aspect-[4/1] rounded-[2rem] overflow-hidden group soft-shadow">
          <div class="flex transition-transform duration-500 h-full"
               [style.transform]="'translateX(-' + (currentBannerIndex() * 100) + '%)'">
            @for (banner of activeBanners(); track banner.id) {
              <div class="min-w-full h-full relative cursor-pointer" [routerLink]="banner.link">
                <img [src]="banner.image" 
                     class="w-full h-full object-cover" 
                     referrerpolicy="no-referrer"
                     alt="Promo Banner">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span class="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{{ banner.subtitle }}</span>
                  <h2 class="text-xl sm:text-3xl font-heading font-black tracking-tighter uppercase leading-none">{{ banner.title }}</h2>
                  <p class="text-[10px] sm:text-sm font-medium opacity-80 line-clamp-1">{{ banner.buttonText }}</p>
                </div>
              </div>
            }
          </div>
          
          <!-- Banner Indicators -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            @for (banner of activeBanners(); track banner.id; let i = $index) {
              <button (click)="currentBannerIndex.set(i)"
                      aria-label="Current Banner Indicator"
                      class="w-2 h-2 rounded-full transition-all duration-300"
                      [class]="currentBannerIndex() === i ? 'bg-white w-6' : 'bg-white/40'"></button>
            }
          </div>
        </div>
      }

      <!-- Circular Category Horizontal Slider -->
      <section class="space-y-4">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-sm font-black uppercase tracking-widest text-slate-400">Shop by Category</h2>
          <a routerLink="/categories" class="text-primary text-[10px] font-black uppercase tracking-widest">See All</a>
        </div>
        <div class="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none px-1" id="category-scroll">
          @for (cat of activeCategories(); track cat.id) {
            <a [routerLink]="['/products']" [queryParams]="{category: cat.name}" 
               class="flex flex-col items-center gap-2 min-w-[70px] group transition-all">
              <div class="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border-4 border-slate-50 dark:border-zinc-800 text-slate-600 dark:text-slate-300 group-hover:border-primary/20 group-hover:scale-105 transition-all">
                @if (cat.icon.startsWith('http')) {
                  <img [src]="cat.icon" class="w-10 h-10 rounded-full object-cover" alt="Category Icon">
                } @else {
                  <mat-icon class="text-2xl">{{ cat.icon }}</mat-icon>
                }
              </div>
              <span class="text-[9px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400 text-center">{{ cat.name }}</span>
            </a>
          }
        </div>
      </section>

      <!-- Category-wise Product Sections -->
      @for (cat of activeCategories(); track cat.id) {
        @if (getProductsByCategory(cat.name).length > 0) {
          <section class="space-y-6">
            <div class="flex items-center justify-between px-1">
              <h2 class="text-lg font-heading font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1 h-6 bg-primary rounded-full"></span>
                {{ cat.name }}
              </h2>
              <a [routerLink]="['/products']" [queryParams]="{category: cat.name}" 
                 class="bg-slate-100 dark:bg-zinc-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary/10 hover:text-primary transition-all">
                View All
              </a>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
              @for (product of getProductsByCategory(cat.name).slice(0, 4); track product.id) {
                <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 overflow-hidden group relative">
                  <!-- Wishlist -->
                  <button class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
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
                    <img [src]="product.images[0]" 
                         loading="lazy"
                         alt="product thumbnail"
                         referrerpolicy="no-referrer"
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    
                    @if (product.regularPrice > (product.salePrice ?? product.regularPrice)) {
                      <div class="absolute bottom-4 left-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                        -{{ Math.round((1 - (product.salePrice! / product.regularPrice)) * 100) }}% OFF
                      </div>
                    }
                  </a>

                  <!-- Info -->
                  <div class="p-5 space-y-4">
                    <div class="space-y-1">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ product.category }}</p>
                      <h3 class="font-black text-sm text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem] tracking-tight group-hover:text-primary transition-colors">
                        {{ product.name }}
                      </h3>
                    </div>

                    <div class="flex items-center justify-between gap-2">
                      <div class="flex flex-col">
                        @if (product.salePrice) {
                          <span class="text-[10px] text-slate-400 font-bold line-through taka-symbol">{{ product.regularPrice }}</span>
                          <span class="text-lg font-black text-primary taka-symbol">{{ product.salePrice }}</span>
                        } @else {
                          <span class="text-lg font-black text-primary taka-symbol">{{ product.regularPrice }}</span>
                        }
                      </div>
                      <button (click)="addToCart(product)" 
                              [disabled]="product.status === 'Stock Out'"
                              [class.opacity-50]="product.status === 'Stock Out'"
                              class="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                        <mat-icon class="font-black">add_shopping_cart</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }
      
      <!-- Facebook Updates Card -->
      <section class="px-1 overflow-hidden">
        <a routerLink="/facebook-updates" class="flex items-center gap-6 p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 soft-shadow group hover:border-[#1877F2]/30 transition-all active:scale-[0.98]">
           <div class="w-16 h-16 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
           </div>
           <div class="flex-1 space-y-1">
              <h3 class="text-lg font-heading font-black tracking-tight text-[#1877F2] uppercase">Facebook Updates</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Check our latest posts, reels, and exclusive offers directly from our Facebook page!</p>
           </div>
           <mat-icon class="text-[#1877F2] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">chevron_right</mat-icon>
        </a>
      </section>

      <!-- Newsletter/Banner -->
      <div class="bg-primary/5 dark:bg-zinc-900 rounded-[3rem] p-10 text-center space-y-6 border border-primary/10">
        <div class="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto">
          <mat-icon class="text-4xl text-primary font-bold">notifications_active</mat-icon>
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-heading font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Join the Elite</h3>
          <p class="text-xs font-bold text-slate-500 dark:text-zinc-400 max-w-xs mx-auto uppercase tracking-widest">Get notified about new drops, exclusive sales, and limited editions via WhatsApp.</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <input type="text" placeholder="PHONE NUMBER" class="flex-1 bg-white dark:bg-zinc-800 border-none rounded-2xl p-5 text-xs font-black focus:ring-2 focus:ring-primary/20 shadow-sm uppercase tracking-widest">
          <button class="bg-primary text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Notify Me</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    #category-scroll {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    #category-scroll::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class Home implements OnInit, OnDestroy {
  bannerService = inject(BannerService);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  seoService = inject(SeoService);
  router = inject(Router);
  
  activeBanners = computed(() => this.bannerService.getActiveBanners());
  activeCategories = computed(() => this.categoryService.getActiveCategories());
  products = this.productService.getCustomerProducts();
  
  currentBannerIndex = signal(0);
  bannerInterval: ReturnType<typeof setInterval> | undefined;
  categoryInterval: ReturnType<typeof setInterval> | undefined;
  
  Math = Math;

  ngOnInit() {
    this.seoService.updateMeta({});
    this.seoService.generateSchema('Store', {});

    // Auto slide banners
    this.bannerInterval = setInterval(() => {
      if (this.activeBanners().length > 0) {
        this.currentBannerIndex.update(i => (i + 1) % this.activeBanners().length);
      }
    }, 3000);

    // Auto scroll categories (slow)
    this.categoryInterval = setInterval(() => {
       const el = document.getElementById('category-scroll');
       if (el) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
             el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
             el.scrollBy({ left: 100, behavior: 'smooth' });
          }
       }
    }, 4000);
  }

  ngOnDestroy() {
    if (this.bannerInterval) clearInterval(this.bannerInterval);
    if (this.categoryInterval) clearInterval(this.categoryInterval);
  }

  getProductsByCategory(category: string) {
    return this.products().filter((p: Product) => p.category === category && p.active);
  }

  addToCart(product: Product) {
    if ((product.variants && product.variants.length > 0) || (product.sizeVariants && product.sizeVariants.length > 0)) {
       // redirect to details to select variants
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
