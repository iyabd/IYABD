import { ChangeDetectionStrategy, Component, inject, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product';
import { OrderService } from '../../../services/order';
import { StorageService } from '../../../services/storage';

interface DashboardItem {
  label: string;
  icon: string;
  link: string;
  badge?: boolean;
  action?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight">Greetings, IYABD Admin 🤝</h1>
          <p class="text-slate-500 dark:text-zinc-400 text-sm">Welcome back to your store overview today.</p>
        </div>
      </header>
      
      <!-- Stats Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] soft-shadow border border-slate-50 dark:border-zinc-800 flex flex-col justify-between group overflow-hidden relative">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div>
              <p class="text-2xl font-black font-heading text-slate-900 dark:text-white">{{ stat.value }}</p>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ stat.label }}</p>
            </div>
            @if (stat.badge) {
              <div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"></div>
            }
          </div>
        }
      </div>

      <!-- Admin Modules -->
      @for (category of categories; track category.title) {
        <section>
          <h2 class="text-sm font-black mb-4 font-heading tracking-widest text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary/40"></span>
            {{ category.title }}
          </h2>
          <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            @for (action of category.items; track action.label) {
              <button (click)="handleAction(action)" class="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-[2rem] soft-shadow border border-slate-50 dark:border-zinc-800/50 hover:border-primary/50 transition-all group overflow-hidden relative">
                <div class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <mat-icon class="!text-[20px]">{{ action.icon }}</mat-icon>
                </div>
                <span class="text-[9px] font-black text-center uppercase tracking-tight text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors line-clamp-1 h-3">{{ action.label }}</span>
                
                @if (action.badge) {
                  <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                }
              </button>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Dashboard {
  location = inject(Location);
  router = inject(Router);
  productService = inject(ProductService);
  orderService = inject(OrderService);
  private storage = inject(StorageService);
  private platformId = inject(PLATFORM_ID);

  allProducts = this.productService.getProducts();

  stats = computed(() => {
    const products = this.allProducts();
    const orders = this.orderService.orders();
    
    const lowStockCount = products.filter(p => p.stock <= 10).length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);

    return [
      { label: 'Total Products', value: products.length, icon: 'inventory_2' },
      { label: 'Pending Orders', value: pendingOrders, icon: 'pending_actions', badge: pendingOrders > 0 },
      { label: 'Low Stock Items', value: lowStockCount, icon: 'warning', badge: lowStockCount > 0 },
      { label: 'Total Sales', value: '৳' + totalSales.toLocaleString(), icon: 'payments' },
    ];
  });

  categories: { title: string, items: DashboardItem[] }[] = [
    {
      title: 'Store Operations',
      items: [
        { label: 'Dashboard', icon: 'grid_view', link: '/admin/dashboard' },
        { label: 'Products', icon: 'list', link: '/admin/products' },
        { label: 'Add Product', icon: 'add_circle', link: '/admin/add-product' },
        { label: 'Orders', icon: 'shopping_bag', link: '/admin/orders' },
        { label: 'Categories', icon: 'category', link: '/admin/categories' },
        { label: 'Inventory / Stock', icon: 'inventory', link: '/admin/inventory' },
        { label: 'Return / Refund', icon: 'assignment_return', link: '/admin/returns' },
        { label: 'Fake / Fraud', icon: 'gpp_bad', link: '/admin/fraud' },
        { label: 'Q&A', icon: 'forum', link: '/admin/qa' },
        { label: 'Customers', icon: 'people', link: '/admin/customers' },
        { label: 'Cust. Accounts', icon: 'manage_accounts', link: '/admin/customer-accounts' },
        { label: 'Order Tracking', icon: 'local_shipping', link: '/admin/order-tracking' },
      ]
    },
    {
      title: 'Marketing & SEO',
      items: [
        { label: 'Promo Codes', icon: 'loyalty', link: '/admin/promo-codes' },
        { label: 'Banners', icon: 'view_carousel', link: '/admin/banners' },
        { label: 'Featured', icon: 'star', link: '/admin/featured' },
        { label: 'FB / Meta', icon: 'facebook', link: '/admin/tracking-settings' },
        { label: 'Feed Sync', icon: 'rss_feed', link: '/admin/catalog-settings' },
        { label: 'TikTok Pixel', icon: 'videocam', link: '/admin/tiktok-pixel' },
        { label: 'Google / GTM', icon: 'analytics', link: '/admin/google-analytics' },
        { label: 'Script Manager', icon: 'code', link: '/admin/script-manager' },
      ]
    },
    {
      title: 'Store Settings',
      items: [
        { label: 'Delivery Config', icon: 'local_shipping', link: '/admin/delivery' },
        { label: 'Payment Method', icon: 'account_balance_wallet', link: '/admin/payment-settings' },
        { label: 'Courier API', icon: 'local_post_office', link: '/admin/courier-settings' },
        { label: 'Staff / Roles', icon: 'admin_panel_settings', link: '/admin/staff' },
        { label: 'Backup / Export', icon: 'settings_backup_restore', link: '/admin/backup' },
        { label: 'Notifications', icon: 'notifications_active', link: '/admin/notifications' },
        { label: 'SMS / WhatsApp', icon: 'message', link: '/admin/messaging' },
        { label: 'Invoice Settings', icon: 'receipt_long', link: '/admin/invoice-settings' },
        { label: 'General Info', icon: 'settings', link: '/admin/shop-settings' },
        { label: 'Logo & Brand', icon: 'palette', link: '/admin/logo-settings' },
        { label: 'Shop Address', icon: 'location_on', link: '/admin/address-settings' },
      ]
    },
    {
      title: 'Reports & Account',
      items: [
        { label: 'Analytics', icon: 'insert_chart', link: '/admin/analytics' },
        { label: 'Sales Report', icon: 'bar_chart', link: '/admin/sales-report' },
        { label: 'Billing/Invoice', icon: 'receipt_long', link: '/admin/billing' },
        { label: 'Stock Alert', icon: 'warning', link: '/admin/low-stock', badge: true },
        { label: 'My Account', icon: 'person', link: '/admin/profile' },
        { label: 'Visit Site', icon: 'public', link: '/' },
        { label: 'Copy Link', icon: 'content_copy', action: 'copy', link: '' },
        { label: 'Day/Night', icon: 'dark_mode', action: 'theme', link: '' },
        { label: 'Help Center', icon: 'help', link: '/admin/help' },
        { label: 'Logout', icon: 'logout', action: 'logout', link: '' },
      ]
    }
  ];

  handleAction(action: DashboardItem) {
    if (action.action === 'copy') {
      if (isPlatformBrowser(this.platformId)) {
        const url = window.location.origin;
        navigator.clipboard.writeText(url).then(() => {
          alert('Website link copied: ' + url);
        });
      }
    } else if (action.action === 'theme') {
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.classList.toggle('dark');
        this.storage.setItem('iyabd_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      }
    } else if (action.action === 'logout') {
      if (confirm('Are you sure you want to logout?')) {
        this.storage.removeItem('admin_token');
        this.router.navigate(['/admin/login']);
      }
    } else {
      this.router.navigate([action.link]);
    }
  }

  quickActions = [
    { label: 'Add Product', icon: 'add_circle', link: '/admin/add-product' },
    { label: 'All Products', icon: 'list', link: '/admin/products' },
    { label: 'Categories', icon: 'category', link: '/admin/categories' },
    { label: 'Orders', icon: 'shopping_bag', link: '/admin/orders' },
    { label: 'Promo Codes', icon: 'token', link: '/admin/promo-codes' },
    { label: 'Analytics', icon: 'analytics', link: '/admin/analytics' },
    { label: 'Shop Settings', icon: 'settings', link: '/admin/shop-settings' },
    { label: 'Website', icon: 'open_in_new', link: '/' },
  ];
}

