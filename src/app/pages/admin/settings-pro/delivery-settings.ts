import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Delivery Charge</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div class="space-y-2">
             <label for="insideDhaka" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Inside Dhaka (৳)</label>
             <input id="insideDhaka" type="number" [(ngModel)]="insideDhaka" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black text-primary">
           </div>
           <div class="space-y-2">
             <label for="outsideDhaka" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Outside Dhaka (৳)</label>
             <input id="outsideDhaka" type="number" [(ngModel)]="outsideDhaka" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black text-primary">
           </div>
        </div>

        <div class="space-y-2">
          <label for="freeDel" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Free Delivery Above (৳)</label>
          <input id="freeDel" type="number" [(ngModel)]="freeDeliveryLimit" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black text-emerald-500">
        </div>

        <div class="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-between">
           <div>
              <p class="font-black text-sm">Cash on Delivery</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Allow customers to pay on delivery</p>
           </div>
           <button (click)="cod = !cod" 
                   [class]="cod ? 'bg-primary border-primary' : 'bg-white border-slate-200'"
                   class="w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm">
              <mat-icon [class]="cod ? 'text-white' : 'text-slate-200'">check</mat-icon>
           </button>
        </div>

        <button class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-4">
           Save Delivery Rules
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class DeliverySettings {
  location = inject(Location);
  insideDhaka = 60;
  outsideDhaka = 120;
  freeDeliveryLimit = 2000;
  cod = true;
}
