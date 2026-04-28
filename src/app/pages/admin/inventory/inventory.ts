import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center gap-4">
        <button type="button" (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl font-heading font-black tracking-tight">Inventory Manage</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Track & adjust stock levels</p>
        </div>
      </header>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-[2rem] p-6 text-center">
           <p class="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest mb-1">Stock In</p>
           <h3 class="text-2xl font-black text-emerald-700 dark:text-emerald-300">+450</h3>
        </div>
        <div class="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-[2rem] p-6 text-center">
           <p class="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-widest mb-1">Stock Out</p>
           <h3 class="text-2xl font-black text-orange-700 dark:text-orange-300">-120</h3>
        </div>
      </div>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Adjust Stock</h2>
        
        <div class="space-y-4">
           <div class="space-y-2">
             <label for="invProduct" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Product</label>
             <select id="invProduct" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black appearance-none">
                <option>Genuine Leather Wallet</option>
                <option>Minimalist Gold Watch</option>
             </select>
           </div>
           
           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="invQty" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Quantity</label>
                <input id="invQty" type="number" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black" placeholder="0">
              </div>
              <div class="space-y-2">
                <label for="invType" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Type</label>
                <select id="invType" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black appearance-none">
                  <option>Stock In</option>
                  <option>Stock Out</option>
                  <option>Damage</option>
                </select>
              </div>
           </div>

           <button (click)="saveAdjustment()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-4">
             Submit Adjustment
           </button>
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Stock History</h2>
        
        <div class="space-y-4">
           @for (log of history; track $index) {
             <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700/50">
               <div>
                 <p class="text-[10px] font-black uppercase text-slate-400">{{ log.date }}</p>
                 <p class="text-xs font-bold">{{ log.product }}</p>
               </div>
               <div [class]="log.type === 'IN' ? 'text-emerald-500' : 'text-orange-500'" class="text-sm font-black">
                 {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }}
               </div>
             </div>
           }
        </div>
      </section>
    </div>
  `,
  styles: [`:host { display: block; } select { -webkit-appearance: none; }`]
})
export class InventoryManagement {
  location = inject(Location);

  history = [
    { date: '2026-04-26 10:30', product: 'Genuine Leather Wallet', type: 'IN', qty: 50 },
    { date: '2026-04-25 15:45', product: 'Minimalist Gold Watch', type: 'OUT', qty: 2 },
    { date: '2026-04-24 09:20', product: 'Genuine Leather Wallet', type: 'OUT', qty: 5 },
    { date: '2026-04-23 11:10', product: 'Minimalist Gold Watch', type: 'DAMAGE', qty: 1 },
  ];

  saveAdjustment() {
    alert('Stock adjustment saved successfully! (Demo)');
  }
}
