import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Shop Settings</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="space-y-2">
           <label for="shopName" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Shop Name</label>
           <input id="shopName" type="text" value="IYABD SHOP" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div class="space-y-2">
             <label for="waNum" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">WhatsApp Number</label>
             <input id="waNum" type="text" value="01719188777" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold">
           </div>
           <div class="space-y-2">
             <label for="callNum" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Call Number</label>
             <input id="callNum" type="text" value="01719188777" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold">
           </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div class="space-y-2">
             <label for="curr" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Currency</label>
             <select id="curr" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold">
                <option>BDT (৳)</option>
                <option>USD ($)</option>
             </select>
           </div>
           <div class="space-y-2">
             <label for="lang" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Language</label>
             <select id="lang" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold">
                <option>Bengali + English</option>
                <option>English Only</option>
             </select>
           </div>
        </div>

        <button class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-4">
           Save Shop Settings
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ShopSettings {
  location = inject(Location);
}
