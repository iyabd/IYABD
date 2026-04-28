import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promo-codes',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-heading font-black tracking-tight">Promo Codes</h1>
        </div>
        <button (click)="isAdding.set(true)" class="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
          <mat-icon>add</mat-icon>
        </button>
      </header>

      @if (isAdding()) {
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] soft-shadow border-2 border-primary animate-in zoom-in-95 duration-300 space-y-6">
           <h3 class="text-xl font-black font-heading tracking-tight">Create Coupon</h3>
           <div class="space-y-4">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div class="space-y-2">
                 <label for="promoCode" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Coupon Code</label>
                 <input id="promoCode" type="text" placeholder="e.g. SAVE20" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 uppercase">
               </div>
               <div class="space-y-2">
                 <label for="promoDisc" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Discount Amount (৳)</label>
                 <input id="promoDisc" type="number" placeholder="0.00" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20">
               </div>
             </div>
             <div class="flex gap-3 pt-2">
               <button (click)="isAdding.set(false)" class="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest">Cancel</button>
               <button (click)="isAdding.set(false)" class="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Save Coupon</button>
             </div>
           </div>
        </div>
      }

      <div class="space-y-4">
        @for (promo of promoCodes(); track promo.code) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800/10 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <mat-icon>loyalty</mat-icon>
              </div>
              <div>
                <h3 class="font-black font-heading text-lg tracking-tight">{{ promo.code }}</h3>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Discount: ৳{{ promo.discount }} • Min: ৳{{ promo.min }}</p>
              </div>
            </div>
            <button class="p-2 text-slate-300 hover:text-red-500 transition-colors">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class PromoCodes {
  location = inject(Location);
  isAdding = signal(false);
  promoCodes = signal([
    { code: 'IYABD100', discount: 100, min: 1000, active: true },
    { code: 'EID2024', discount: 200, min: 2000, active: true },
    { code: 'NEWUSER', discount: 50, min: 500, active: true },
  ]);
}
