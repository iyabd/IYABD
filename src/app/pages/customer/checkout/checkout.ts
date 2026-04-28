import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config';
import { CartService } from '../../../services/cart';
import { OrderService, OrderItem } from '../../../services/order';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 pb-32 max-w-6xl mx-auto px-4">
      <header class="pt-8">
        <h1 class="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Checkout</h1>
        <p class="text-slate-500 text-sm font-medium">Complete your order by providing delivery details.</p>
      </header>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Direct Checkout Form -->
        <div class="lg:w-2/3 space-y-6">
          <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
             <h2 class="font-black text-xl font-heading flex items-center gap-3 text-slate-900 dark:text-white">
               <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <mat-icon class="text-primary font-black">local_shipping</mat-icon>
               </div>
               Delivery Address
             </h2>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="space-y-2">
                 <label for="custName" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Full Name</label>
                 <input id="custName" type="text" [(ngModel)]="customerName" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. John Doe">
               </div>
               <div class="space-y-2">
                 <label for="custPhone" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Phone Number</label>
                 <input id="custPhone" type="tel" [(ngModel)]="customerPhone" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="017xxxxxxxx">
               </div>
               <div class="space-y-2">
                 <label for="custDist" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">District</label>
                 <input id="custDist" type="text" [(ngModel)]="district" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. Dhaka">
               </div>
               <div class="space-y-2">
                 <label for="custArea" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Area / Thana</label>
                 <input id="custArea" type="text" [(ngModel)]="areaName" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. Mirpur">
               </div>
               <div class="space-y-2">
                 <label for="custEmail" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Gmail / Email</label>
                 <input id="custEmail" type="email" [(ngModel)]="customerEmail" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. john@gmail.com">
               </div>
               <div class="space-y-2">
                 <label for="deliveryOpt" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Delivery Option</label>
                 <select id="deliveryOpt" [(ngModel)]="deliveryOption" class="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none">
                   <option value="Home Delivery">Home Delivery</option>
                   <option value="Point Collection">Point Collection (Courier Office)</option>
                 </select>
               </div>
               <div class="md:col-span-2 space-y-2">
                 <label for="custAddr" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Full Address</label>
                 <textarea id="custAddr" rows="3" [(ngModel)]="fullAddress" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="House no, Street, Landmark..."></textarea>
               </div>
               <div class="md:col-span-2 space-y-2">
                 <label for="orderNote" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Order Note (Optional)</label>
                 <input id="orderNote" type="text" [(ngModel)]="orderNote" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. Please call before arrival">
               </div>
             </div>
          </section>

          <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
             <h2 class="font-black text-xl font-heading flex items-center gap-3 text-slate-900 dark:text-white">
                <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <mat-icon class="text-primary font-black">wallet</mat-icon>
                </div>
               Payment Method
             </h2>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               @for (method of paymentMethods; track method.label) {
                 <button (click)="paymentMethod.set(method.label)"
                         class="flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left"
                         [class]="paymentMethod() === method.label ? 'border-primary bg-primary/5' : 'border-slate-50 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 border-transparent'">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-zinc-700 shadow-sm">
                       <mat-icon [class]="method.color">{{ method.icon }}</mat-icon>
                    </div>
                    <div>
                       <div class="font-black text-sm text-slate-900 dark:text-white">{{ method.label }}</div>
                       <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ method.desc }}</div>
                    </div>
                 </button>
               }
             </div>
             
             @if (paymentMethod() !== 'Cash on Delivery') {
               <div class="p-6 bg-primary/5 border border-primary/10 rounded-[2.5rem] animate-in zoom-in-95">
                 <div class="text-[10px] font-black text-primary mb-4 uppercase tracking-widest">Instructions</div>
                 <p class="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">Please send total amount using {{ paymentMethod() }} to: <span class="font-black text-primary text-lg">{{ getNumber() }}</span> (Personal/Send Money). Enter transaction ID below after payment.</p>
                 <div class="mt-4 space-y-2">
                   <label for="transactionId" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Transaction ID</label>
                   <input id="transactionId" type="text" [(ngModel)]="transactionId" placeholder="e.g. TR6X9902LM" 
                          class="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
                 </div>
               </div>
             }
          </section>
        </div>

        <!-- Summary Sticky -->
        <div class="lg:w-1/3 relative">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
              <h2 class="font-black text-xl font-heading text-slate-900 dark:text-white">Order Summary</h2>
              
              <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                @for (item of cart.items(); track item.id) {
                  <div class="flex items-center gap-4">
                    <img [src]="item.image" alt="Product" class="w-12 h-12 rounded-xl object-cover">
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-black truncate text-slate-900 dark:text-white">{{ item.name }}</p>
                      <p class="text-[10px] text-slate-400 font-bold uppercase">Qty: {{ item.quantity }}</p>
                    </div>
                    <p class="text-sm font-black taka-symbol text-slate-900 dark:text-white">{{ item.price * item.quantity }}</p>
                  </div>
                }
              </div>

              <div class="space-y-3 pt-6 border-t border-dashed border-slate-100 dark:border-zinc-800">
                <div class="flex justify-between text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span class="text-slate-900 dark:text-white taka-symbol">{{ cart.subtotal() }}</span>
                </div>
                <div class="flex justify-between text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <span>Delivery Charge</span>
                  <span class="text-slate-900 dark:text-white taka-symbol">{{ deliveryCharge() }}</span>
                </div>
                <div class="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-end">
                  <span class="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-1">Total</span>
                  <span class="font-black text-3xl text-primary taka-symbol">{{ cart.subtotal() + deliveryCharge() }}</span>
                </div>
              </div>
            </div>

            <button (click)="placeOrder()" 
                    [disabled]="cart.items().length === 0"
                    class="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50 disabled:grayscale">
              Place Order
            </button>
            <p class="text-[10px] text-center text-slate-400 font-bold tracking-widest uppercase">BY PLACING AN ORDER, YOU AGREE TO OUR POLICIES.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Checkout {
  config = inject(ConfigService);
  cart = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  router = inject(Router);

  // Form State
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  deliveryOption = 'Home Delivery';
  district = '';
  areaName = '';
  fullAddress = '';
  orderNote = '';
  transactionId = '';
  
  paymentMethod = signal('Cash on Delivery');

  paymentMethods = [
    { label: 'Cash on Delivery', icon: 'local_atm', desc: 'Pay when you receive', color: 'text-slate-500' },
    { label: 'bKash', icon: 'account_balance_wallet', desc: 'Personal (Send Money)', color: 'text-pink-600' },
    { label: 'Nagad', icon: 'account_balance_wallet', desc: 'Personal (Send Money)', color: 'text-orange-500' },
    { label: 'Rocket', icon: 'account_balance_wallet', desc: 'Personal (Send Money)', color: 'text-indigo-600' },
  ];

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      this.customerName = user.name;
      this.customerPhone = user.mobile || '';
      this.customerEmail = user.email || '';
      this.fullAddress = user.address || '';
    }
  }

  deliveryCharge() {
    return this.district.toLowerCase().includes('dhaka') 
      ? this.config.config().deliveryChargeInside 
      : this.config.config().deliveryChargeOutside;
  }

  getNumber() {
    switch (this.paymentMethod()) {
      case 'bKash': return this.config.config().bkash;
      case 'Nagad': return this.config.config().nagad;
      case 'Rocket': return this.config.config().rocket;
      default: return '';
    }
  }

  placeOrder() {
    if (!this.customerName || !this.customerPhone || !this.district || !this.areaName || !this.fullAddress) {
      alert('Please fill all required delivery details.');
      return;
    }

    if (this.paymentMethod() !== 'Cash on Delivery' && !this.transactionId) {
      alert('Please provide transaction ID for online payment.');
      return;
    }

    const items: OrderItem[] = this.cart.items().map(i => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      qty: i.quantity,
      price: i.price,
      size: i.size,
      color: i.color
    }));

    const order = this.orderService.placeOrder({
      customerId: this.customerEmail || 'guest_' + Date.now(),
      customerName: this.customerName,
      mobile: this.customerPhone,
      email: this.customerEmail,
      deliveryOption: this.deliveryOption,
      address: this.fullAddress,
      district: this.district,
      area: this.areaName,
      items,
      total: this.cart.subtotal() + this.deliveryCharge(),
      deliveryCharge: this.deliveryCharge(),
      paymentMethod: this.paymentMethod(),
      transactionId: this.transactionId,
      note: this.orderNote
    });

    // Auto decrease stock
    try {
       this.orderService.reduceStock(items);
    } catch(err) {
       console.error("Stock reduction failed", err);
    }

    this.cart.clear();
    alert(`Order Placed Succesfully! Your Order ID is: ${order.id}`);
    this.router.navigate(['/my-account']);
  }
}
