import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../../../services/order';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0">
      <header class="text-center space-y-2 pt-8">
        <div class="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
          <mat-icon class="text-4xl font-black">local_shipping</mat-icon>
        </div>
        <h1 class="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Track Your Order</h1>
        <p class="text-slate-500 text-sm font-medium">Real-time updates for your IYABD purchases.</p>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
         <div class="space-y-4">
           <div class="space-y-2">
             <label for="trackId" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Order ID or Phone Number</label>
             <input id="trackId" type="text" [(ngModel)]="searchId" placeholder="e.g. 1001 or 017..." 
                    class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20">
           </div>
           <button (click)="trackOrder()" class="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:brightness-110 active:scale-95">
             Track Now
           </button>
         </div>
      </div>

      @if (error()) {
        <div class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] text-center animate-in zoom-in-95">
           <mat-icon class="text-red-500 mb-2">gpp_bad</mat-icon>
           <p class="text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-tight leading-relaxed">{{ error() }}</p>
        </div>
      }

      @if (orderData(); as data) {
        <div class="space-y-6 animate-in zoom-in-95 duration-500">
          <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-8">
             <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-6">
                <div class="min-w-0 flex-1">
                   <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order #{{ data.id }}</div>
                   <div class="font-black text-xl font-heading text-slate-900 dark:text-white truncate">{{ data.customerName }}</div>
                </div>
                <div [class]="getStatusClass(data.status)" class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shrink-0">
                  {{ data.status }}
                </div>
             </div>

             <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-800">
                <div class="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-zinc-800 shrink-0">
                   <img [src]="data.items[0]?.image" alt="Product" class="w-12 h-12 rounded-lg object-cover">
                </div>
                <div class="min-w-0">
                   <p class="text-xs font-black text-slate-900 dark:text-white truncate">{{ data.items[0]?.name }}</p>
                   <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Courier: {{ data.courierName || 'Pending Assignment' }}</p>
                </div>
             </div>

             @if (data.status === 'Cancelled') {
               <div class="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] text-center">
                  <mat-icon class="text-red-500 mb-2">cancel</mat-icon>
                  <p class="text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-tight leading-relaxed">
                    Order Cancelled: {{ data.cancelReason || 'Customer requested' }}
                  </p>
               </div>
             }

             <!-- Stepper -->
             <div class="space-y-10 pl-6 border-l-2 border-dashed border-slate-100 dark:border-zinc-800 ml-2">
                @for (step of timelineSteps; track step.key) {
                  <div class="relative">
                    <div [class]="isStepCompleted(step.key) ? 'bg-primary scale-110' : 'bg-slate-200 dark:bg-zinc-800'" 
                         class="absolute -left-[33px] top-0.5 w-4 h-4 rounded-full border-4 border-white dark:border-zinc-900 transition-all shadow-sm"></div>
                    <div [class]="isStepCompleted(step.key) ? 'opacity-100' : 'opacity-40'" class="space-y-1">
                       <div class="text-sm font-black text-slate-900 dark:text-white">{{ step.label }}</div>
                       <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                         @if (data.status === step.label) {
                           Recently Updated: {{ data.lastUpdate }}
                         } @else if (isStepCompleted(step.key)) {
                           Completed
                         } @else {
                            Awaiting
                         }
                       </div>
                    </div>
                  </div>
                }
             </div>

             @if (data.trackingId) {
               <div class="pt-4 space-y-4">
                  <div class="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <div>
                        <p class="text-[8px] font-black uppercase text-primary/60 tracking-widest">Tracking ID</p>
                        <p class="text-sm font-black text-primary">{{ data.trackingId }}</p>
                     </div>
                     <button (click)="liveTrack()" class="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">
                       Live Track
                     </button>
                  </div>
               </div>
             }
          </div>
          
          <button class="w-full py-5 rounded-[2rem] border-2 border-slate-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:border-slate-200 transition-all">
            Need Help? Contact Support
          </button>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OrderTracking implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  searchId = '';
  orderData = signal<Order | null>(null);
  error = signal('');

  timelineSteps = [
    { label: 'Pending', key: 'Pending' },
    { label: 'Confirmed', key: 'Confirmed' },
    { label: 'Processing', key: 'Processing' },
    { label: 'Sent to Courier', key: 'Sent to Courier' },
    { label: 'Shipped', key: 'Shipped' },
    { label: 'Delivered', key: 'Delivered' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.searchId = params['id'];
        this.trackOrder();
      }
    });
  }

  trackOrder() {
    this.error.set('');
    this.orderData.set(null);

    if (!this.searchId) return;

    let order = this.orderService.getOrderById(this.searchId);
    
    // If not found by ID, try searching by Mobile
    if (!order) {
       const userOrders = this.orderService.orders().filter(o => o.mobile === this.searchId);
       if (userOrders.length > 0) {
          // just grab the latest one
          order = userOrders[0];
       }
    }

    const user = this.authService.currentUser();

    if (!order) {
      this.error.set('Order not found. Please check your Order ID or Phone Number.');
      return;
    }

    // Security Rule: Customer can only view their own order
    if (user?.role !== 'admin' && order.customerId !== user?.email && order.mobile !== this.searchId) {
       this.error.set('YOU ARE NOT ALLOWED TO VIEW THIS ORDER. PLEASE LOGIN WITH THE ACCOUNT USED TO PLACE THIS ORDER.');
       return;
    }

    this.orderData.set(order);
  }

  isStepCompleted(stepKey: string): boolean {
    const status = this.orderData()?.status;
    const order = this.timelineSteps.findIndex(s => s.key === status);
    const current = this.timelineSteps.findIndex(s => s.key === stepKey);
    return current <= order;
  }

  getStatusClass(status: string) {
    if (status === 'Delivered') return 'bg-emerald-500/10 text-emerald-500';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-500';
    if (status === 'Pending') return 'bg-slate-100 text-slate-500';
    return 'bg-primary/10 text-primary';
  }

  liveTrack() {
    alert('Redirecting to courier tracking page... (Demo)');
  }
}
