import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Address Settings</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="space-y-2">
           <label for="full_addr" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Shop Full Address</label>
           <textarea id="full_addr" rows="6" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-bold resize-none">{{ address }}</textarea>
        </div>

        <div class="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-3xl space-y-4">
           <div class="flex items-center gap-3 text-primary">
              <mat-icon>info</mat-icon>
              <h4 class="font-black text-xs uppercase tracking-widest">Visibility</h4>
           </div>
           <p class="text-xs text-slate-500 font-medium leading-relaxed">
             This address will be automatically displayed on the Customer Panel Contact page and during the Checkout process for clarity.
           </p>
        </div>

        <button class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-4 hover:scale-[1.01] transition-all">
           Update Office Address
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AddressSettings {
  location = inject(Location);
  address = 'রায়েরবাগ, হাজী ওয়াসিমুদ্দিন ভূঁইয়া রোড, ওয়ার্ড নং–৬০, ঢাকা দক্ষিণ সিটি কর্পোরেশন, ঢাকা–১২৩৬, বাংলাদেশ';
}
