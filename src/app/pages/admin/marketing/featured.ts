import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Featured Products</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 soft-shadow border border-slate-50 dark:border-zinc-800">
        <div class="space-y-4">
          @for (product of products(); track product.id) {
            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
               <div class="flex items-center gap-4">
                  <img [src]="product.image" class="w-12 h-12 rounded-xl object-cover" alt="">
                  <div>
                    <h3 class="font-black text-sm">{{ product.name }}</h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ product.category }}</p>
                  </div>
               </div>
               
               <div class="flex gap-2">
                  <div class="flex flex-col items-end gap-1">
                     <span class="text-[8px] font-black uppercase text-slate-400">Featured</span>
                     <button (click)="product.featured = !product.featured" 
                             [class]="product.featured ? 'bg-primary text-white border-primary' : 'bg-white text-slate-300 border-slate-200'"
                             class="w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all shadow-sm">
                        <mat-icon class="text-sm">star</mat-icon>
                     </button>
                  </div>
                  <div class="flex flex-col items-end gap-1">
                     <span class="text-[8px] font-black uppercase text-slate-400">Arrival</span>
                     <button (click)="product.newArrival = !product.newArrival" 
                             [class]="product.newArrival ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-300 border-slate-200'"
                             class="w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all shadow-sm">
                        <mat-icon class="text-sm">new_releases</mat-icon>
                     </button>
                  </div>
               </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class FeaturedProducts {
  location = inject(Location);
  products = signal([
    { id: 1, name: 'Premium Leather Wallet', category: 'Wallets', image: 'https://picsum.photos/seed/p1/100/100', featured: true, newArrival: true },
    { id: 2, name: 'Cotton Polo Shirt', category: 'Clothing', image: 'https://picsum.photos/seed/p2/100/100', featured: false, newArrival: true },
    { id: 3, name: 'Minimalist Watch', category: 'Watches', image: 'https://picsum.photos/seed/p3/100/100', featured: true, newArrival: false },
    { id: 4, name: 'Bluetooth Earbuds', category: 'Electronics', image: 'https://picsum.photos/seed/p4/100/100', featured: false, newArrival: false },
  ]);
}
