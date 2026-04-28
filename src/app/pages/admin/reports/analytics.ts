import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Analytics</h1>
      </header>

      <div class="grid grid-cols-2 gap-4">
         @for (stat of stats; track stat.label) {
           <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] soft-shadow border border-slate-50 dark:border-zinc-800 flex flex-col justify-between">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" [class]="stat.bg">
                 <mat-icon class="text-white text-lg">{{ stat.icon }}</mat-icon>
              </div>
              <div>
                 <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
                 <p class="text-xl font-black font-heading tracking-tight mt-1">{{ stat.value }}</p>
              </div>
           </div>
         }
      </div>

      <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
         <h3 class="font-black font-heading text-lg tracking-tight">Performance Summary</h3>
         <div class="space-y-6">
            @for (item of performance; track item.label) {
              <div class="space-y-2">
                 <div class="flex items-center justify-between px-1">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">{{ item.label }}</span>
                    <span class="text-xs font-black">{{ item.percent }}%</span>
                 </div>
                 <div class="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000" [style.width.%]="item.percent"></div>
                 </div>
              </div>
            }
         </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Analytics {
  location = inject(Location);
  
  stats = [
    { label: 'Weekly Sales', value: '৳1,24,500', icon: 'trending_up', bg: 'bg-emerald-500' },
    { label: 'Monthly Sales', value: '৳4,82,000', icon: 'payments', bg: 'bg-primary' },
    { label: 'Best Product', value: 'Wallet-X', icon: 'star', bg: 'bg-amber-500' },
    { label: 'Conversion', value: '4.8%', icon: 'bolt', bg: 'bg-indigo-500' },
  ];

  performance = [
    { label: 'Direct Sales', percent: 84 },
    { label: 'Promo Sales', percent: 16 },
    { label: 'Returning Customers', percent: 42 },
  ];
}
