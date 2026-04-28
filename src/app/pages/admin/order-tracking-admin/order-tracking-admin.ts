import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface AdminOrder {
  id: string;
  customerName?: string;
  date?: string;
  status: string;
  phone?: string;
  itemsCount?: number;
  total?: number;
  items?: unknown[];
}

@Component({
  selector: 'app-order-tracking-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Order Tracking</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="trackSearchId" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Search Order ID</label>
            <div class="flex gap-2">
              <input id="trackSearchId" type="text" [(ngModel)]="searchId" placeholder="e.g. #77281" 
                     class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20">
              <button (click)="findOrder()" class="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
                <mat-icon>search</mat-icon>
              </button>
            </div>
          </div>
        </div>

        @if (foundOrder()) {
          <div class="pt-6 border-t border-slate-100 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
            <div class="bg-slate-50 dark:bg-zinc-800 rounded-3xl p-6 mb-8">
               <h3 class="font-black text-lg mb-1">Update Tracking Status</h3>
               <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Order ID: {{ foundOrder()?.id }}</p>
            </div>

            <div class="space-y-1">
              @for (step of trackingSteps; track step) {
                @let order = foundOrder();
                <button (click)="updateStatus(step)" 
                        class="w-full flex items-center justify-between p-5 rounded-2xl transition-all border-2 mb-3"
                        [class]="order && order.status === step ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800'">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                         [class]="order && order.status === step ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'">
                      <mat-icon class="text-lg">{{ getStepIcon(step) }}</mat-icon>
                    </div>
                    <span class="font-black text-sm">{{ step }}</span>
                  </div>
                  @if (order && order.status === step) {
                    <mat-icon class="text-primary">check_circle</mat-icon>
                  }
                </button>
              }
            </div>
            
            <button (click)="saveTracking()" class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-6 hover:scale-[1.01] active:scale-95 transition-all">
               Update Progress
            </button>
          </div>
        } @else if (hasSearched()) {
          <div class="text-center py-12 space-y-4">
            <div class="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <mat-icon class="text-4xl">search_off</mat-icon>
            </div>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No active order found with this ID</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OrderTrackingAdmin {
  location = inject(Location);
  searchId = '';
  hasSearched = signal(false);
  foundOrder = signal<AdminOrder | null>(null);

  trackingSteps = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered'
  ];

  findOrder() {
    this.hasSearched.set(true);
    if (this.searchId.includes('77281')) {
      this.foundOrder.set({ id: '#77281', status: 'Processing' });
    } else {
      this.foundOrder.set(null);
    }
  }

  updateStatus(status: string) {
    const order = this.foundOrder();
    if (order) {
      this.foundOrder.set({ ...order, status });
    }
  }

  getStepIcon(step: string) {
    const icons: Record<string, string> = {
      'Order Placed': 'inventory_2',
      'Confirmed': 'verified',
      'Processing': 'sync',
      'Shipped': 'local_shipping',
      'Delivered': 'auto_awesome'
    };
    return icons[step] || 'circle';
  }

  saveTracking() {
    const order = this.foundOrder();
    if (order) {
      alert('Tracking updated successfully to: ' + order.status);
    }
  }
}
