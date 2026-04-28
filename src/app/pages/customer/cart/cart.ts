import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart';
import { ConfigService } from '../../../services/config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 pb-32 max-w-6xl mx-auto px-4">
      <header class="pt-8">
        <h1 class="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-white">Your Cart</h1>
        <p class="text-slate-500 text-sm font-medium">Review your items before proceeding to checkout.</p>
      </header>

      @if (cart.items().length > 0) {
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Items List -->
          <div class="lg:w-2/3 space-y-4">
            @for (item of cart.items(); track item.id) {
              <div class="bg-white dark:bg-zinc-900 p-5 rounded-[2.5rem] soft-shadow border border-slate-100 dark:border-zinc-800 flex gap-6 animate-in slide-in-from-bottom-2 duration-300">
                <div class="relative">
                  <img [src]="item.image" alt="Product thumbnail" class="w-24 h-24 rounded-2xl object-cover bg-slate-50 border border-slate-100 dark:border-zinc-800 shrink-0">
                </div>
                <div class="flex-1 space-y-3 min-w-0">
                  <div class="flex justify-between items-start">
                    <h3 class="font-black text-sm text-slate-900 dark:text-white truncate">{{ item.name }}</h3>
                    <button (click)="cart.removeItem(item.id)" class="text-slate-300 hover:text-red-500 transition-colors">
                      <mat-icon class="text-xl">delete_outline</mat-icon>
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="text-primary font-black taka-symbol text-lg">{{ item.price }}</div>
                    
                    <div class="flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded-2xl border border-slate-100 dark:border-zinc-800">
                      <button (click)="cart.updateQuantity(item.id, item.quantity - 1)" 
                              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition-all">
                        <mat-icon class="text-base">remove</mat-icon>
                      </button>
                      <span class="font-black text-sm px-2 w-8 text-center text-slate-900 dark:text-white">{{ item.quantity }}</span>
                      <button (click)="cart.updateQuantity(item.id, item.quantity + 1)" 
                              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm transition-all">
                        <mat-icon class="text-base">add</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }

            <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Apply Promo Code</h4>
              <div class="flex gap-2">
                <input type="text" [(ngModel)]="couponCode" placeholder="Enter coupon..." 
                       class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20">
                <button (click)="applyCoupon()" class="px-8 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">Apply</button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="lg:w-1/3 relative">
           <div class="sticky top-24 space-y-6">
             <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
               <h2 class="font-black text-xl font-heading text-slate-900 dark:text-white">Order Summary</h2>
               
               <div class="space-y-4 text-sm font-black">
                 <div class="flex justify-between text-slate-500 uppercase text-[10px] tracking-widest">
                   <span>Subtotal</span>
                   <span class="text-slate-900 dark:text-white taka-symbol text-sm">{{ cart.subtotal() }}</span>
                 </div>
                 <div class="flex justify-between text-slate-500 uppercase text-[10px] tracking-widest">
                   <span>Delivery (Est.)</span>
                   <span class="text-slate-900 dark:text-white taka-symbol text-sm">60</span>
                 </div>
                 @if (discount() > 0) {
                   <div class="flex justify-between text-emerald-500 uppercase text-[10px] tracking-widest">
                     <span>Discount</span>
                     <span class="taka-symbol text-sm">-{{ discount() }}</span>
                   </div>
                 }
                 
                 <div class="pt-6 border-t border-dashed border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                   <span class="font-heading text-slate-900 dark:text-white uppercase tracking-tighter">Total Price</span>
                   <span class="text-2xl font-black text-primary taka-symbol">{{ cart.subtotal() + 60 - discount() }}</span>
                 </div>
               </div>
             </div>
             
             <button routerLink="/checkout" class="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
               Checkout Now
             </button>
             
             <a routerLink="/" class="block text-center text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
               Continue Shopping
             </a>
           </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20 px-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-slate-100 dark:border-zinc-800 soft-shadow animate-in zoom-in-95">
          <div class="w-24 h-24 bg-slate-50 dark:bg-zinc-800 text-slate-300 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12">
            <mat-icon class="text-6xl font-black">shopping_cart</mat-icon>
          </div>
          <h2 class="text-2xl font-black font-heading mb-2 text-slate-900 dark:text-white">Your cart is feeling lonely</h2>
          <p class="text-slate-500 text-sm font-medium mb-10 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Explore our latest products!</p>
          <a routerLink="/" class="inline-block bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
            Explore Shop
          </a>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Cart {
  cart = inject(CartService);
  config = inject(ConfigService);
  
  couponCode = '';
  discount = signal(0);

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'IYABD10') {
      const disc = Math.round(this.cart.subtotal() * 0.1);
      this.discount.set(disc);
      alert('Coupon applied! You got 10% discount.');
    } else {
      alert('Invalid coupon code.');
      this.discount.set(0);
    }
  }
}
