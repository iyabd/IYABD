import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../services/theme';
import { ConfigService } from '../../services/config';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 font-sans">
      <!-- Top Header -->
      <header class="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-1">
          <button (click)="isMenuOpen.set(!isMenuOpen())" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <mat-icon>menu</mat-icon>
          </button>
          <button (click)="location.back()" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <mat-icon>arrow_back</mat-icon>
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <span class="font-heading font-black text-lg tracking-tighter text-primary">IYABD SHOP</span>
            <img [src]="configService.config().logo" alt="Logo" class="w-7 h-7 rounded-md object-contain">
          </div>
          <button (click)="themeService.toggleTheme()" class="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <mat-icon class="text-xl">{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </header>

      <!-- Sidebar Menu -->
      @if (isMenuOpen()) {
        <div (click)="isMenuOpen.set(false)" 
             (keyup.enter)="isMenuOpen.set(false)"
             tabindex="0"
             class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"></div>
        <aside class="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-white dark:bg-zinc-900 shadow-2xl transition-transform transform translate-x-0 flex flex-col overflow-hidden">
          <!-- Profile Header -->
          <div class="p-6 bg-primary text-white space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black">
                {{ (auth.currentUser()?.name || 'A').charAt(0) }}
              </div>
              <button (click)="isMenuOpen.set(false)" class="p-1 hover:bg-white/10 rounded-full">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div>
              <h2 class="font-black tracking-tight">{{ auth.currentUser()?.name }}</h2>
              <p class="text-xs text-white/70">{{ auth.currentUser()?.email }}</p>
            </div>
          </div>
          
          <nav class="flex-1 overflow-y-auto p-4 space-y-1">
            @for (item of menuItems; track item.label) {
              @if (item.label === 'SEPARATOR') {
                <div class="h-px bg-slate-100 dark:bg-zinc-800 my-4 mx-2"></div>
              } @else {
                <button (click)="handleMenuClick(item)"
                   class="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 group text-left">
                  <div class="flex items-center gap-3 w-full">
                     <mat-icon class="text-slate-400 group-hover:text-primary !text-[20px]">{{ item.icon }}</mat-icon>
                     <span class="font-bold text-sm">{{ item.label }}</span>
                  </div>
                  @if (item.label === 'Orders' && orderService.unreadCount() > 0) {
                     <div class="bg-red-500 text-white text-[10px] font-black rounded-full px-2 py-0.5">{{ orderService.unreadCount() }}</div>
                  }
                </button>
              }
            }
          </nav>
          
          <div class="p-4 border-t border-slate-100 dark:border-zinc-800">
             <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 group">
                <mat-icon>logout</mat-icon>
                <span class="font-bold text-sm uppercase tracking-widest">Logout</span>
              </button>
          </div>
        </aside>
      }

      <!-- Main Content -->
      <main class="flex-1 overflow-x-hidden pt-4 pb-[90px] px-4 w-full max-w-7xl mx-auto">
        <router-outlet />
      </main>

      <!-- Admin Bottom Navigation -->
      <nav class="admin-bottom-nav">
        <a routerLink="/admin/products" routerLinkActive="active" class="admin-nav-item">
          <span class="nav-icon"><mat-icon>shopping_bag</mat-icon></span>
          <span class="nav-text">Products</span>
        </a>

        <a routerLink="/admin/orders" routerLinkActive="active" class="admin-nav-item">
          <span class="nav-icon relative">
             <mat-icon>assignment</mat-icon>
             @if (orderService.unreadCount() > 0) {
               <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm ring-2 ring-white dark:ring-zinc-900">{{ orderService.unreadCount() }}</div>
             }
          </span>
          <span class="nav-text">Orders</span>
        </a>

        <a routerLink="/admin/categories" routerLinkActive="active" class="admin-nav-item">
          <span class="nav-icon"><mat-icon>category</mat-icon></span>
          <span class="nav-text">Categories</span>
        </a>

        <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="admin-nav-item">
          <span class="nav-icon"><mat-icon>home</mat-icon></span>
          <span class="nav-text">Home</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .admin-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 74px;
      background: #ffffff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #eeeeee;
      box-shadow: 0 -6px 20px rgba(0,0,0,0.08);
      z-index: 9999;
    }

    [class*="dark"] .admin-bottom-nav {
      background: #18181b;
      border-top-color: #27272a;
      box-shadow: 0 -6px 20px rgba(0,0,0,0.3);
    }

    .admin-nav-item {
      width: 25%;
      height: 100%;
      text-decoration: none;
      color: #9ca3af;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      position: relative;
      transition: all 0.25s ease;
      cursor: pointer;
    }

    .admin-nav-item .nav-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .admin-nav-item .nav-icon mat-icon {
      font-size: 21px;
      width: 21px;
      height: 21px;
    }

    .admin-nav-item .nav-text {
      font-size: 11px;
      font-weight: 600;
    }

    .admin-nav-item.active {
      color: #6C2CFF;
    }

    .admin-nav-item.active .nav-icon {
      background: linear-gradient(135deg, #6C2CFF, #9B6CFF);
      color: #ffffff;
      transform: translateY(-8px) scale(1.08);
      box-shadow: 0 8px 18px rgba(108,44,255,0.35);
    }

    .admin-nav-item.active .nav-text {
      color: #6C2CFF;
      font-weight: 800;
      transform: translateY(-4px);
    }

    .admin-nav-item.active::after {
      content: "";
      position: absolute;
      bottom: 6px;
      width: 6px;
      height: 6px;
      background: #6C2CFF;
      border-radius: 50%;
    }
  `]
})
export class AdminLayout {
  themeService = inject(ThemeService);
  configService = inject(ConfigService);
  auth = inject(AuthService);
  router = inject(Router);
  orderService = inject(OrderService);
  location = inject(Location);
  isMenuOpen = signal(false);

  constructor() {
    // Basic session guard check
    if (!this.auth.currentUser() || this.auth.currentUser()?.role !== 'admin') {
      this.router.navigate(['/my-account']);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  menuItems = [
    { label: 'My Account', icon: 'person', path: '/admin/profile' },
    { label: 'Dashboard', icon: 'grid_view', path: '/admin/dashboard' },
    { label: 'Products', icon: 'shopping_bag', path: '/admin/products' },
    { label: 'Add Product', icon: 'add_circle', path: '/admin/add-product' },
    { label: 'Orders', icon: 'assignment', path: '/admin/orders' },
    { label: 'Reviews', icon: 'star_rate', path: '/admin/reviews' },
    { label: 'Categories', icon: 'category', path: '/admin/categories' },
    { label: 'Customers', icon: 'people', path: '/admin/customers' },
    { label: 'Customer Accounts', icon: 'manage_accounts', path: '/admin/customer-accounts' },
    { label: 'Order Tracking', icon: 'local_shipping', path: '/admin/order-tracking' },
    { label: 'Promo Codes', icon: 'loyalty', path: '/admin/promo-codes' },
    { label: 'Banner / Slider', icon: 'view_carousel', path: '/admin/banners' },
    { label: 'Featured Products', icon: 'star', path: '/admin/featured' },
    { label: 'Delivery Charge', icon: 'local_shipping', path: '/admin/delivery' },
    { label: 'Payment Settings', icon: 'account_balance_wallet', path: '/admin/payment-settings' },
    { label: 'Billing', icon: 'receipt_long', path: '/admin/billing' },
    { label: 'Analytics', icon: 'analytics', path: '/admin/analytics' },
    { label: 'Sales Report', icon: 'bar_chart', path: '/admin/sales-report' },
    { label: 'Low Stock Alert', icon: 'warning', path: '/admin/low-stock' },
    { label: 'SEPARATOR', icon: '', path: '' },
    { label: 'Website / Customer Panel', icon: 'public', path: '/' },
    { label: 'Copy Website Link', icon: 'content_copy', action: 'copy' },
    { label: 'Shop Settings', icon: 'store', path: '/admin/shop-settings' },
    { label: 'Logo & Brand Settings', icon: 'palette', path: '/admin/logo-settings' },
    { label: 'Address Settings', icon: 'location_on', path: '/admin/address-settings' },
    { label: 'Courier Settings', icon: 'local_post_office', path: '/admin/courier-settings' },
    { label: 'Tracking Settings', icon: 'track_changes', path: '/admin/tracking-settings' },
    { label: 'Meta Catalog', icon: 'rss_feed', path: '/admin/catalog-settings' },
    { label: 'Tag Manager', icon: 'code', path: '/admin/tag-manager' },
    { label: 'Day/Night Mode', icon: 'dark_mode', action: 'theme' },
    { label: 'Need Help', icon: 'help', path: '/admin/help' },
  ];

  handleMenuClick(item: { path?: string, action?: string }) {
    if (item.action === 'copy') {
      const url = window.location.origin;
      navigator.clipboard.writeText(url).then(() => {
        alert('Website link copied: ' + url);
      });
      this.isMenuOpen.set(false);
    } else if (item.action === 'theme') {
      this.themeService.toggleTheme();
      this.isMenuOpen.set(false);
    } else {
      this.router.navigate([item.path]);
      this.isMenuOpen.set(false);
    }
  }
}
