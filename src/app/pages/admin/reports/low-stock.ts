import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Low Stock Alert</h1>
      </header>

      <div class="space-y-4">
        @for (product of lowStockProducts(); track product.id) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-red-100 dark:border-red-950/30 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center">
                <mat-icon>warning</mat-icon>
              </div>
              <div>
                <h3 class="font-black font-heading text-lg tracking-tight">{{ product.name }}</h3>
                <div class="flex items-center gap-2">
                   <p class="text-[10px] text-red-500 font-bold uppercase tracking-widest">Stock Left: {{ product.stock }}</p>
                   <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                   <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ product.category }}</p>
                </div>
              </div>
            </div>
            <button class="px-5 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
               Restock
            </button>
          </div>
        } @empty {
          <div class="text-center py-24 space-y-4">
             <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <mat-icon class="text-4xl">check_circle</mat-icon>
             </div>
             <p class="text-slate-400 font-black uppercase tracking-widest text-xs">All products are healthy in stock!</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class LowStock {
  location = inject(Location);
  lowStockProducts = signal([
    { id: 1, name: 'Premium Leather Wallet', stock: 3, category: 'Wallets' },
    { id: 2, name: 'Minimalist Watch', stock: 1, category: 'Watches' },
    { id: 3, name: 'Power Bank 20k', stock: 2, category: 'Electronics' },
  ]);
}
