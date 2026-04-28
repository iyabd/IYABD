import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logo-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Logo & Branding</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
           <div class="space-y-4">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Shop Logo</span>
              <div class="aspect-square rounded-[2rem] bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-100 transition-all p-8">
                 <img src="https://iyabd.com/wp-content/uploads/2023/07/Untitled-design-20.png" class="w-full h-full object-contain mb-2" alt="Logo">
                 <span class="text-[9px] font-black uppercase tracking-widest">Change Logo</span>
              </div>
           </div>
           <div class="space-y-4">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Favicon</span>
              <div class="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-100 transition-all mx-auto">
                 <mat-icon>insert_photo</mat-icon>
                 <span class="text-[8px] font-black uppercase tracking-widest">Change</span>
              </div>
           </div>
        </div>

        <div class="h-px bg-slate-100 dark:bg-zinc-800"></div>

        <div class="space-y-6">
           <h3 class="font-black font-heading text-lg tracking-tight">Theme Colors</h3>
           <div class="grid grid-cols-2 gap-4">
              @for (color of ['Primary', 'Secondary']; track color) {
                <div class="space-y-2">
                  <label [for]="'color_' + color" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ color }} Color</label>
                  <div class="flex gap-2">
                    <div class="w-12 h-12 rounded-xl" [class]="color === 'Primary' ? 'bg-primary' : 'bg-slate-900'"></div>
                    <input [id]="'color_' + color" type="text" [value]="color === 'Primary' ? '#6C2CFF' : '#111827'" 
                           class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-xs font-mono">
                  </div>
                </div>
              }
           </div>
        </div>

        <button class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-4">
           Apply Brand Settings
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class LogoSettings {
  location = inject(Location);
}
