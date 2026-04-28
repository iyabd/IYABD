import { ChangeDetectionStrategy, Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order, OrderStatus } from '../../../services/order';
import { ConfigService } from '../../../services/config';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0 max-w-6xl mx-auto">
      <header class="flex items-center gap-4 pt-6">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Order Details</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Manage fulfillment & courier</p>
        </div>
      </header>

      @if (order()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Details -->
          <div class="lg:col-span-2 space-y-6">
             <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
                <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-6">
                   <div>
                      <h2 class="font-black text-xl font-heading tracking-tight text-slate-900 dark:text-white">Order #{{ order()!.id }}</h2>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ order()!.date }}</p>
                   </div>
                   <select [ngModel]="order()!.status" (ngModelChange)="updateStatus($event)" 
                           class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                           [class]="getStatusClass(order()!.status)">
                      @for (s of statuses; track s) {
                         <option [value]="s">{{ s }}</option>
                      }
                   </select>
                </div>

                <div class="space-y-4">
                   @for (item of order()!.items; track $index) {
                     <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-800">
                        <img [src]="item.image" alt="Product" class="w-16 h-16 rounded-2xl object-cover bg-white dark:bg-zinc-900">
                        <div class="flex-1 min-w-0">
                           <p class="text-sm font-black truncate text-slate-900 dark:text-white">{{ item.name }}</p>
                           <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {{ item.qty }} • Size: {{ item.size || 'N/A' }}</p>
                        </div>
                        <div class="text-right">
                           <p class="text-sm font-black text-primary taka-symbol">{{ item.price }}</p>
                           <p class="text-[10px] text-slate-400 font-bold">৳{{ item.price * item.qty }}</p>
                        </div>
                     </div>
                  }
                </div>

                <div class="pt-6 border-t border-dashed border-slate-100 dark:border-zinc-800 space-y-2 text-sm font-black">
                   <div class="flex justify-between text-slate-400 font-bold">
                      <span class="uppercase text-[10px] tracking-widest">Payment Method</span>
                      <span>{{ order()!.paymentMethod }}</span>
                   </div>
                   @if (order()!.transactionId) {
                      <div class="flex justify-between text-slate-400 font-bold">
                         <span class="uppercase text-[10px] tracking-widest">Transaction ID</span>
                         <span class="text-primary">{{ order()!.transactionId }}</span>
                      </div>
                   }
                   <div class="flex justify-between text-lg pt-4 border-t border-slate-50 dark:border-zinc-800/50">
                      <span class="font-heading text-slate-900 dark:text-white uppercase tracking-tighter">Total Amount</span>
                      <span class="text-primary taka-symbol">{{ order()!.total }}</span>
                   </div>
                </div>
             </section>

             <!-- Courier Management Card -->
             <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border-2 border-primary/10 space-y-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 p-8 font-black text-[3.5rem] text-primary/5 select-none pointer-events-none uppercase tracking-tighter">COURIER</div>
                
                <h2 class="font-black text-lg font-heading flex items-center gap-2 text-slate-900 dark:text-white">
                   <mat-icon class="text-primary font-black">local_shipping</mat-icon>
                   Courier Fulfillment
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div class="space-y-2">
                      <label for="courier_select" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Selected Courier</label>
                      <select id="courier_select" [(ngModel)]="courierName" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black appearance-none focus:ring-2 focus:ring-primary/20">
                         <option value="">Choose Courier</option>
                         <option value="Steadfast">Steadfast Courier</option>
                         <option value="Pathao">Pathao Courier</option>
                      </select>
                   </div>
                   <div class="space-y-2">
                      <label for="cod_amount" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">COD Amount</label>
                      <input id="cod_amount" type="number" [(ngModel)]="codAmount" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
                   </div>
                </div>

                <div class="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6 animate-in zoom-in-95">
                   <div class="flex items-start justify-between">
                      <div class="space-y-1">
                         <p class="text-[10px] font-black text-primary uppercase tracking-widest">Status: {{ order()!.courierStatus || 'Not Processed' }}</p>
                         <p class="text-xs font-bold text-slate-600 dark:text-slate-300">Tracking: {{ order()!.trackingId || 'N/A' }}</p>
                      </div>
                      @if (order()!.trackingId) {
                         <span class="px-3 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Booked</span>
                      }
                   </div>

                   <div class="grid grid-cols-2 gap-3">
                      <button (click)="sendToCourier()" class="py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50" [disabled]="!courierName">
                         Send to {{ courierName || 'Courier' }}
                      </button>
                      <button (click)="checkStatus()" class="py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                         Check Status
                      </button>
                      <button (click)="showInvoice = true" class="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                         Show Invoice
                      </button>
                      <button (click)="cancelCourier()" class="py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 dark:border-red-900/20">
                         Cancel
                      </button>
                   </div>
                </div>
             </section>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
             <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
                <h3 class="font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Customer Info</h3>
                <div class="space-y-4">
                   <div>
                      <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Name</p>
                      <p class="text-sm font-black text-slate-900 dark:text-white">{{ order()!.customerName }}</p>
                   </div>
                   <div>
                      <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Phone</p>
                      <div class="flex items-center justify-between">
                         <p class="text-sm font-black text-slate-900 dark:text-white">{{ order()!.mobile }}</p>
                         <button (click)="copyPhone()" class="text-primary"><mat-icon class="text-lg">content_copy</mat-icon></button>
                      </div>
                   </div>
                   <div>
                      <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">District / Area</p>
                      <p class="text-xs font-bold text-slate-900 dark:text-white">{{ order()!.district }} - {{ order()!.area }}</p>
                   </div>
                   <div>
                      <p class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Address</p>
                      <p class="text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-300">{{ order()!.address }}</p>
                   </div>
                   @if (order()!.note) {
                     <div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
                        <p class="text-[9px] font-black uppercase text-amber-600 tracking-widest mb-1">Customer Note</p>
                        <p class="text-xs font-bold text-amber-800 dark:text-amber-400 italic">"{{ order()!.note }}"</p>
                     </div>
                   }
                   <button (click)="whatsappCustomer()" class="w-full py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 flex items-center justify-center gap-2">
                      <mat-icon class="text-lg font-black">chat_bubble_outline</mat-icon>
                      WhatsApp Customer
                   </button>
                </div>
             </section>

             <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
                <h3 class="font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Internal Actions</h3>
                <div class="space-y-3">
                   <button (click)="promptMarkConfirmed()" class="w-full py-4 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20">Confirm Order</button>
                   <button (click)="promptMarkCancelled()" class="w-full py-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400">Cancel Order</button>
                   <button (click)="promptMarkFraud()" class="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20">Mark as Fraud</button>
                </div>
             </section>
          </div>
        </div>
      }

      <!-- Invoice Overlay -->
      @if (showInvoice) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div class="bg-white text-black w-full max-w-2xl h-[90vh] overflow-y-auto rounded-[2rem] p-10 space-y-8 relative shadow-2xl">
              <button (click)="showInvoice = false" class="absolute top-6 right-6 text-slate-400 hover:text-black">
                <mat-icon>close</mat-icon>
              </button>

              <div id="invoice-content" class="space-y-10">
                <header class="flex justify-between items-start border-b-2 border-slate-100 pb-10">
                   <div class="space-y-2">
                      <h1 class="text-4xl font-black font-heading text-primary tracking-tighter">{{ config.config().companyName }}</h1>
                      <div class="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Invoice</div>
                   </div>
                   <div class="text-right">
                      <p class="text-xs font-black">Date: {{ order()?.date }}</p>
                      <p class="text-xs font-black">Order ID: #{{ order()?.id }}</p>
                   </div>
                </header>

                <div class="grid grid-cols-2 gap-10">
                   <div class="space-y-4">
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Bill To:</h4>
                      <div class="space-y-1">
                         <p class="font-black text-lg">{{ order()?.customerName }}</p>
                         <p class="text-xs font-bold text-slate-600">{{ order()?.mobile }}</p>
                         <p class="text-xs text-slate-600 leading-relaxed">{{ order()?.address }}</p>
                         <p class="text-xs text-slate-600">{{ order()?.district }}, {{ order()?.area }}</p>
                      </div>
                   </div>
                   <div class="text-right space-y-4">
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">From:</h4>
                      <div class="space-y-1 text-xs font-bold text-slate-600">
                         <p>{{ config.config().companyName }}</p>
                         <p>{{ config.config().address }}</p>
                         <p>WhatsApp: {{ config.config().whatsapp }}</p>
                      </div>
                   </div>
                </div>

                <table class="w-full text-left">
                   <thead class="bg-slate-50 border-y border-slate-100">
                      <tr>
                         <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                         <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                         <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-right">Price</th>
                         <th class="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody>
                      @for (item of order()?.items; track $index) {
                        <tr class="border-b border-slate-50">
                           <td class="py-5 px-4">
                              <p class="text-sm font-black">{{ item.name }}</p>
                              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ item.size || 'N/A' }}</p>
                           </td>
                           <td class="py-5 px-4 text-sm font-black text-center">{{ item.qty }}</td>
                           <td class="py-5 px-4 text-sm font-black text-right">৳{{ item.price }}</td>
                           <td class="py-5 px-4 text-sm font-black text-right">৳{{ item.price * item.qty }}</td>
                        </tr>
                      }
                   </tbody>
                </table>

                <div class="flex justify-end p-8 bg-slate-50 rounded-3xl">
                   <div class="w-full max-w-[240px] space-y-3 text-sm font-black">
                      <div class="flex justify-between text-slate-400">
                         <span class="uppercase text-[9px] tracking-widest">Subtotal</span>
                         <span>৳{{ order()?.total! - 60 }}</span>
                      </div>
                      <div class="flex justify-between text-slate-400">
                         <span class="uppercase text-[9px] tracking-widest">Delivery Charge</span>
                         <span>৳60</span>
                      </div>
                      <div class="flex justify-between text-xl pt-4 border-t-2 border-slate-200">
                         <span class="font-heading uppercase tracking-tighter">TOTAL</span>
                         <span class="text-primary">৳{{ order()?.total }}</span>
                      </div>
                      <div class="pt-4 text-center">
                         <div class="px-4 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full inline-block">
                           Payment: {{ order()?.paymentMethod }}
                         </div>
                      </div>
                   </div>
                </div>

                <footer class="text-center space-y-2 pt-4">
                   <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Thank you for shopping with US!</p>
                </footer>
              </div>

              <div class="flex justify-center pt-6 gap-4 no-print">
                 <button (click)="printInvoice()" class="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2">
                    <mat-icon>print</mat-icon>
                    Print Invoice
                 </button>
                 <button (click)="showInvoice = false" class="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Close</button>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; } select { -webkit-appearance: none; } @media print { .no-print { display: none; } }`]
})
export class OrderDetails implements OnInit {
  location = inject(Location);
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  config = inject(ConfigService);
  private platformId = inject(PLATFORM_ID);

  order = signal<Order | null>(null);
  statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Sent to Courier', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Fraud'];
  
  courierName = '';
  codAmount = 0;
  showInvoice = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
       this.loadOrder(id);
    }
  }

  loadOrder(id: string) {
    const found = this.orderService.getOrderById(id);
    if (found) {
      if (!found.isRead) {
         this.orderService.markAsRead(id);
         found.isRead = true;
      }
      this.order.set(found);
      this.courierName = found.courierName || '';
      this.codAmount = found.total;
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-amber-500 text-white';
      case 'Confirmed': return 'bg-blue-500 text-white';
      case 'Processing': return 'bg-indigo-500 text-white';
      case 'Shipped': return 'bg-purple-500 text-white';
      case 'Delivered': return 'bg-emerald-500 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      case 'Fraud': return 'bg-black text-white';
      default: return 'bg-slate-100 text-slate-500';
    }
  }

  updateStatus(status: OrderStatus, options?: Partial<Order>) {
    if (!this.order()) return;
    this.orderService.updateOrderStatus(this.order()!.id, status, options);
    this.loadOrder(this.order()!.id);
  }

  sendToCourier() {
    if (!this.order()) return;
    alert(`Initiating API call to ${this.courierName}... (Simulation)`);
    
    setTimeout(() => {
      const trackingId = this.courierName === 'Steadfast' ? 'SF-' + Math.floor(Math.random()*100000) : 'PT-' + Math.floor(Math.random()*100000);
      this.updateStatus('Sent to Courier', {
        courierName: this.courierName,
        trackingId: trackingId,
        courierStatus: 'Booking Confirmed'
      });
      alert(`Success! Order sent to ${this.courierName}. Tracking ID generated.`);
    }, 1500);
  }

  checkStatus() {
    if (!this.order()?.trackingId) {
      alert('Please send to courier first.');
      return;
    }
    alert(`Checking status for ${this.order()!.trackingId}... API responded: In Transit`);
  }

  printInvoice() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  cancelCourier() {
    if(confirm('Are you sure you want to cancel the courier request?')) {
      this.updateStatus('Confirmed', {
        trackingId: '',
        courierStatus: 'Cancelled'
      });
    }
  }

  promptMarkConfirmed() {
    if(confirm('Confirm this order?')) {
      this.updateStatus('Confirmed');
    }
  }

  promptMarkCancelled() {
    const reason = prompt('Cancellation Reason:');
    if (reason !== null) {
      this.updateStatus('Cancelled', { cancelReason: reason });
    }
  }

  promptMarkFraud() {
    if(confirm('Mark this customer as FRAUD? This will flag their phone number.')) {
      this.updateStatus('Fraud', { isFake: true });
    }
  }

  copyPhone() {
    if (this.order() && isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(this.order()!.mobile);
      alert('Phone number copied!');
    }
  }

  whatsappCustomer() {
    if (this.order() && isPlatformBrowser(this.platformId)) {
      const url = `https://wa.me/${this.order()!.mobile}?text=Assalamu Alaikum, I am from IYABD SHOP. Your order #${this.order()!.id} is confirmed.`;
      window.open(url, '_blank');
    }
  }
}
