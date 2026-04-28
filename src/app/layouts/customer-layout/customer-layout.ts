import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme';
import { ConfigService } from '../../services/config';
import { CartService } from '../../services/cart';
import { ProductService, Product } from '../../services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 font-sans">
      <!-- Top Header -->
      <header class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 py-3">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2">
            <img [src]="configService.config().logo" alt="Logo" class="w-8 h-8 rounded-md object-contain">
            <span class="font-heading font-black text-lg tracking-tight uppercase text-primary">{{ configService.config().companyName }}</span>
          </a>
          
          <div class="flex items-center gap-2">
            <!-- Facebook Logo Header -->
             <a href="https://www.facebook.com/iyabdshop" target="_blank" class="w-10 h-10 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group">
                <svg class="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
             </a>

            <button (click)="themeService.toggleTheme()" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
              <mat-icon class="text-slate-500 dark:text-slate-400 font-black">{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <a routerLink="/cart" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all relative">
              <mat-icon class="text-slate-500 dark:text-slate-400 font-black">shopping_cart</mat-icon>
              @if (cartService.totalCount() > 0) {
                <span class="absolute top-1 right-1 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">{{ cartService.totalCount() }}</span>
              }
            </a>
          </div>
        </div>
        
        <!-- Smart Search Bar -->
        <div class="max-w-3xl mx-auto mt-3 relative">
          <div class="relative group">
            <input type="text" 
                   [(ngModel)]="searchQuery"
                   (input)="onSearchInput()"
                   (keypress)="onKeyPress($event)"
                   placeholder="Search products, categories..." 
                   class="w-full bg-slate-100 dark:bg-zinc-800 border-none rounded-[1.25rem] py-4 pl-12 pr-14 focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold shadow-sm">
            
            <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">search</mat-icon>
            
            <!-- Camera Icon -->
            <button (click)="openCameraPopup()" 
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary/60 hover:text-primary transition-colors">
              <mat-icon class="font-black">photo_camera</mat-icon>
            </button>
          </div>

          <!-- Live Suggestions -->
          @if (showSuggestions() && suggestions().length > 0) {
            <div class="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-zinc-900 rounded-[2rem] soft-shadow border border-slate-100 dark:border-zinc-800 overflow-hidden z-[60] animate-in zoom-in-95 duration-200">
               <div class="p-3">
                  <div class="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Products</div>
                  @for (p of suggestions().slice(0, 5); track p.id) {
                    <button (click)="selectProduct(p)" class="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group">
                       <img [src]="p.images[0]" alt="Product" class="w-10 h-10 rounded-xl object-cover">
                       <div class="flex-1 min-w-0">
                          <p class="text-xs font-black truncate text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ p.name }}</p>
                          <p class="text-[10px] text-slate-400 font-bold taka-symbol">{{ p.salePrice || p.regularPrice }}</p>
                       </div>
                       <mat-icon class="text-slate-300 text-lg">north_west</mat-icon>
                    </button>
                  }
               </div>
               <button (click)="performSearch()" class="w-full p-4 bg-slate-50 dark:bg-zinc-800 text-center text-[10px] font-black uppercase tracking-widest text-primary border-t border-slate-100 dark:border-zinc-700">
                  Show all results for "{{ searchQuery }}"
               </button>
            </div>
          }
        </div>
      </header>

      <!-- Camera Modal -->
      @if (showCameraModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div class="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl scale-in-95">
              <div class="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto">
                <mat-icon class="text-4xl text-primary font-black">photo_camera</mat-icon>
              </div>
              <div class="space-y-2">
                <h3 class="text-xl font-heading font-black text-slate-900 dark:text-white">IMAGE SEARCH</h3>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Find products by uploading an image</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                 <button (click)="triggerFileInput()" class="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-800 border-2 border-transparent hover:border-primary/20 transition-all">
                    <mat-icon class="text-slate-400">collections</mat-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                 </button>
                 <button (click)="triggerFileInput()" class="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-800 border-2 border-transparent hover:border-primary/20 transition-all">
                    <mat-icon class="text-slate-400">camera_alt</mat-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">Camera</span>
                 </button>
              </div>

              <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                 <p class="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">Image search is coming soon. For now, we'll just preview the image.</p>
              </div>

              <button (click)="showCameraModal.set(false)" class="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
              
              <input type="file" id="cameraInput" class="hidden" (change)="onFileSelected($event)" accept="image/*">
           </div>
        </div>
      }

      <!-- Main Content -->
      <main class="flex-1 overflow-x-hidden pt-4 pb-[85px] max-w-7xl mx-auto w-full px-4">
        <router-outlet />
      </main>

      <!-- Fixed Bottom Navigation for Customer Panel -->
      @if (!isProductDetails()) {
        <nav class="customer-bottom-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <span class="nav-icon"><mat-icon>home</mat-icon></span>
            <span class="nav-text">Home</span>
          </a>

          <a routerLink="/messenger" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><mat-icon>chat</mat-icon></span>
            <span class="nav-text">Messenger</span>
          </a>

          <a routerLink="/categories" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><mat-icon>grid_view</mat-icon></span>
            <span class="nav-text">Category</span>
          </a>

          <a routerLink="/cart" routerLinkActive="active" class="nav-item">
            <div class="relative flex flex-col items-center">
              <span class="nav-icon relative">
                <mat-icon>shopping_cart</mat-icon>
                @if (cartService.totalCount() > 0) {
                  <span class="cart-count">{{ cartService.totalCount() }}</span>
                }
              </span>
              <span class="nav-text">Cart</span>
            </div>
          </a>

          <a routerLink="/my-account" routerLinkActive="active" class="nav-item">
            <span class="nav-icon"><mat-icon>person</mat-icon></span>
            <span class="nav-text">Account</span>
          </a>
        </nav>
      }

      <!-- Floating WhatsApp -->
      <a [href]="'https://wa.me/' + configService.config().whatsapp" 
         target="_blank"
         aria-label="Contact on WhatsApp"
         class="fixed right-6 bottom-24 z-50 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-transform">
        <mat-icon class="text-3xl font-bold">chat</mat-icon>
      </a>
      
      <!-- Footer -->
      @if (!isProductDetails()) {
        <footer class="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 py-12 px-4 mt-auto">
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="space-y-4">
              <h3 class="font-heading font-bold text-xl uppercase">{{ configService.config().companyName }}</h3>
              <p class="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                {{ configService.config().address }}
              </p>
            </div>
            <div>
              <h4 class="font-bold mb-4">Quick Links</h4>
              <ul class="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                <li><a routerLink="/" class="hover:text-primary">Home</a></li>
                <li><a routerLink="/products" class="hover:text-primary">Products</a></li>
                <li><a routerLink="/about" class="hover:text-primary">About Us</a></li>
                <li><a routerLink="/contact" class="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Support</h4>
              <ul class="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                <li><a routerLink="/order-tracking" class="hover:text-primary">Order Tracking</a></li>
                <li><a routerLink="/privacy-policy" class="hover:text-primary">Privacy Policy</a></li>
                <li><a routerLink="/terms" class="hover:text-primary">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-4">Contact Us</h4>
              <div class="space-y-3">
                <a [href]="'tel:' + configService.config().phone" class="flex items-center gap-2 text-sm hover:text-primary">
                  <mat-icon class="text-lg">call</mat-icon>
                  {{ configService.config().phone }}
                </a>
                <a [href]="'https://wa.me/' + configService.config().whatsapp" class="flex items-center gap-2 text-sm hover:text-primary">
                  <mat-icon class="text-lg">chat</mat-icon>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div class="max-w-7xl mx-auto border-t border-slate-100 dark:border-zinc-800 mt-12 pt-8 text-center text-xs text-slate-400">
            © 2024 {{ configService.config().companyName }}. All rights reserved.
          </div>
        </footer>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .customer-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 74px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-top: 1px solid #eeeeee;
      box-shadow: 0 -6px 20px rgba(0,0,0,0.08);
      z-index: 9999;
    }

    [class*="dark"] .customer-bottom-nav {
      background: #18181b;
      border-top-color: #27272a;
      box-shadow: 0 -6px 20px rgba(0,0,0,0.3);
    }

    .customer-bottom-nav .nav-item {
      width: 20%;
      height: 100%;
      color: #9ca3af;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      position: relative;
      transition: all 0.25s ease;
      cursor: pointer;
    }

    .customer-bottom-nav .nav-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .customer-bottom-nav .nav-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .customer-bottom-nav .nav-text {
      font-size: 11px;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    .customer-bottom-nav .nav-item.active {
      color: #6C2CFF;
    }

    .customer-bottom-nav .nav-item.active .nav-icon {
      background: linear-gradient(135deg, #6C2CFF, #9B6CFF);
      color: #ffffff;
      transform: translateY(-8px) scale(1.08);
      box-shadow: 0 8px 18px rgba(108,44,255,0.35);
    }

    .customer-bottom-nav .nav-item.active .nav-text {
      color: #6C2CFF;
      font-weight: 800;
      transform: translateY(-4px);
    }

    .customer-bottom-nav .nav-item.active::after {
      content: "";
      position: absolute;
      bottom: 6px;
      width: 6px;
      height: 6px;
      background: #6C2CFF;
      border-radius: 50%;
    }

    .cart-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ff2d55;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      min-width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      z-index: 10;
    }

    [class*="dark"] .cart-count {
      border-color: #18181b;
    }

    @media (min-width: 640px) {
      /* Maintaining desktop consistency if needed, but user request implies mobile behavior primarily */
    }
  `]
})
export class CustomerLayout {
  themeService = inject(ThemeService);
  configService = inject(ConfigService);
  cartService = inject(CartService);
  productService = inject(ProductService);
  router = inject(Router);

  searchQuery = '';
  showSuggestions = signal(false);
  showCameraModal = signal(false);
  
  allProducts = this.productService.getProducts();
  
  isProductDetails = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects.includes('/product/'))
    ),
    { initialValue: this.router.url.includes('/product/') }
  );

  suggestions = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return [];
    return this.allProducts().filter(p => 
      p.active && (
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      )
    );
  });

  onSearchInput() {
    this.showSuggestions.set(this.searchQuery.length > 1);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      this.showSuggestions.set(false);
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
    }
  }

  selectProduct(product: Product) {
    this.showSuggestions.set(false);
    this.searchQuery = '';
    this.router.navigate(['/product', product.id]);
  }

  openCameraPopup() {
    this.showCameraModal.set(true);
  }

  triggerFileInput() {
    document.getElementById('cameraInput')?.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      alert('Visual Search Processing... Image received. This feature is coming soon!');
      this.showCameraModal.set(false);
    }
  }
}
