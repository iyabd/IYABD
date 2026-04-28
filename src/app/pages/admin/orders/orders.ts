import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, Order } from '../../../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Manage and fulfill purchases</p>
        </div>
        <button class="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
          <mat-icon>add</mat-icon>
        </button>
      </header>

      <!-- Stats Bar -->
      <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        @for (status of statuses; track status) {
          <button (click)="activeStatus.set(status)"
                  class="shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  [class]="activeStatus() === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-zinc-900 text-slate-400 border border-slate-100 dark:border-zinc-800'">
            {{ status }}
          </button>
        }
      </div>

      <!-- Action Bar -->
      <div class="bg-white dark:bg-zinc-900 p-4 rounded-3xl soft-shadow border border-slate-50 dark:border-zinc-800 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by Order ID or Phone..." 
                 class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20">
        </div>
        <div class="flex gap-2">
           <button class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-slate-400">
             <mat-icon>filter_list</mat-icon>
           </button>
           <button (click)="exportOrders()" class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-slate-400">
             <mat-icon>ios_share</mat-icon>
           </button>
        </div>
      </div>

      <!-- Order List -->
      <div class="space-y-4">
        @for (order of filteredOrders(); track order.id; let i = $index) {
          <div (click)="viewDetails(order)" (keyup.enter)="viewDetails(order)" tabindex="0" class="bg-white dark:bg-zinc-900 p-5 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800/50 space-y-4 group hover:border-primary/30 transition-all cursor-pointer">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex flex-col items-center justify-center font-black">
                  <span class="text-[8px] text-slate-400 leading-none">NO.</span>
                  <span class="text-sm">{{ filteredOrders().length - i }}</span>
                </div>
                <div>
                   <div class="text-[10px] font-black text-primary uppercase tracking-widest">Order #{{ order.id }}</div>
                   <div class="text-xs font-black text-slate-900 dark:text-white">{{ order.customerName }}</div>
                </div>
              </div>
              <div [class]="getStatusClass(order.status)" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {{ order.status }}
              </div>
            </div>

            <div class="flex gap-4 items-start border-y border-dashed border-slate-100 dark:border-zinc-800/50 py-4">
               <img [src]="order.items[0]?.image" alt="Product Image" class="w-16 h-16 rounded-2xl object-cover border border-slate-50">
               <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-slate-900 dark:text-white truncate">{{ order.items[0]?.name }}</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {{ order.items[0]?.qty }} • {{ order.paymentMethod }}</p>
                  <div class="flex items-center gap-2 mt-2">
                     <mat-icon class="text-[10px] w-[10px] h-[10px] text-slate-300">location_on</mat-icon>
                     <span class="text-[9px] text-slate-400 font-bold truncate">{{ order.address }}</span>
                  </div>
               </div>
               <div class="text-right">
                  <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p class="text-lg font-black text-primary taka-symbol">{{ order.total }}</p>
               </div>
            </div>

            <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                    <mat-icon class="text-sm">phone</mat-icon>
                  </div>
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ order.mobile }}</span>
               </div>
               <div class="flex gap-2">
                  <button (click)="$event.stopPropagation(); handleCourier(order)" class="p-2 bg-emerald-500/5 text-emerald-500 rounded-xl border border-emerald-500/10">
                    <mat-icon class="text-lg">local_shipping</mat-icon>
                  </button>
                  <button (click)="$event.stopPropagation(); triggerMetaCapiEvent(order, 'Purchase')" class="p-2 bg-blue-500/5 text-blue-500 rounded-xl border border-blue-500/10">
                    <mat-icon class="text-lg">api</mat-icon>
                  </button>
               </div>
            </div>
          </div>
        } @empty {
          <div class="text-center py-20 space-y-4">
             <div class="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                <mat-icon class="text-4xl font-black">inventory_2</mat-icon>
             </div>
             <p class="text-slate-400 font-black uppercase tracking-widest text-[10px]">No orders found for this filter</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Orders {
  orderService = inject(OrderService);
  router = inject(Router);

  activeStatus = signal('All');
  statuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Sent to Courier', 'Shipped', 'Delivered', 'Cancelled', 'Fraud', 'Returned'];
  
  searchQuery = '';

  filteredOrders = computed(() => {
    let list = this.orderService.orders();
    
    if (this.activeStatus() !== 'All') {
      list = list.filter(o => o.status === this.activeStatus());
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      list = list.filter(o => 
        o.id.includes(query) || 
        o.mobile.includes(query) || 
        o.customerName.toLowerCase().includes(query)
      );
    }
    
    return list;
  });

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500';
      case 'Confirmed': return 'bg-blue-500/10 text-blue-500';
      case 'Processing': return 'bg-indigo-500/10 text-indigo-500';
      case 'Shipped': return 'bg-purple-500/10 text-purple-500';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      case 'Fraud': return 'bg-black text-white';
      default: return 'bg-slate-100 text-slate-500';
    }
  }

  handleCourier(order: Order) {
    this.router.navigate(['/admin/order-details', order.id]);
  }

  viewDetails(order: Order) {
    this.router.navigate(['/admin/order-details', order.id]);
  }

  triggerMetaCapiEvent(order: Order, eventType: string) {
    alert(`Meta CAPI Event "${eventType}" triggered for Order #${order.id}`);
  }

  exportOrders() {
    alert('Exporting orders as Excel... (Demo)');
  }
}
