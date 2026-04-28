import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Sales Report</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
         <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
               <label for="startDate" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Start Date</label>
               <input id="startDate" type="date" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold">
            </div>
            <div class="space-y-2">
               <label for="endDate" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">End Date</label>
               <input id="endDate" type="date" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold">
            </div>
         </div>

         <div class="space-y-4 pt-4">
            <h3 class="font-black font-heading text-sm uppercase tracking-widest text-slate-400 pl-1">Quick Filters</h3>
            <div class="flex flex-wrap gap-2">
               @for (filter of ['Daily', 'Weekly', 'Monthly', 'Yearly']; track filter) {
                 <button class="px-6 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    {{ filter }}
                 </button>
               }
            </div>
         </div>

         <div class="flex flex-col sm:flex-row gap-3 pt-6">
            <button class="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
               <mat-icon class="text-sm">download</mat-icon>
               Download PDF
            </button>
            <button class="flex-1 py-4 bg-slate-900 dark:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
               <mat-icon class="text-sm">table_view</mat-icon>
               Export CSV
            </button>
         </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class SalesReport {
  location = inject(Location);
}
