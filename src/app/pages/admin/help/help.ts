import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-help',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Need Help?</h1>
      </header>

      <div class="space-y-6">
        <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
           <div class="text-center space-y-4">
              <div class="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <mat-icon class="text-4xl">support_agent</mat-icon>
              </div>
              <h2 class="font-black font-heading text-xl tracking-tight">How can we help you?</h2>
              <p class="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                If you face any issues while managing your shop, please contact our support team.
              </p>
           </div>

           <div class="grid grid-cols-1 gap-4">
              <button class="flex items-center gap-4 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:scale-[1.02] transition-all">
                 <mat-icon class="text-3xl">chat</mat-icon>
                 <div class="text-left">
                    <p class="font-black text-sm">WhatsApp Support</p>
                    <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">01719188777</p>
                 </div>
              </button>

              <button class="flex items-center gap-4 p-6 rounded-3xl bg-primary/5 text-primary hover:scale-[1.02] transition-all">
                 <mat-icon class="text-3xl">call</mat-icon>
                 <div class="text-left">
                    <p class="font-black text-sm">Call Center</p>
                    <p class="text-[10px] font-bold uppercase tracking-widest opacity-70">01719188777</p>
                 </div>
              </button>
           </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
           <h3 class="font-black font-heading text-lg tracking-tight">Common Guides</h3>
           <div class="space-y-3">
              @for (guide of guides; track guide) {
                <button class="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-zinc-700">
                   <span class="font-bold text-sm">{{ guide }}</span>
                   <mat-icon class="text-slate-300">chevron_right</mat-icon>
                </button>
              }
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AdminHelp {
  location = inject(Location);
  guides = [
    'How to add product',
    'How to manage order',
    'How to change payment number',
    'Promo code usage guide',
    'Banner setup instructions'
  ];
}
