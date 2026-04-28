import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-backup',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Backup & Export</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Keep your data safe</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Export Tools</h2>
        
        <div class="grid grid-cols-1 gap-4">
           @for (tool of exportTools; track tool.label) {
             <button (click)="export(tool.type)" class="p-6 bg-slate-50 dark:bg-zinc-800 rounded-3xl border border-slate-100 dark:border-zinc-700/50 flex items-center justify-between group hover:border-primary/50 transition-all">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                     <mat-icon>{{ tool.icon }}</mat-icon>
                   </div>
                   <div class="text-left">
                     <p class="text-sm font-black">{{ tool.label }}</p>
                     <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{{ tool.desc }}</p>
                   </div>
                </div>
                <mat-icon class="text-slate-300 group-hover:text-primary transition-colors">download</mat-icon>
             </button>
           }
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Full Store Backup</h2>
        
        <div class="space-y-4">
           <div class="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
              <mat-icon class="text-primary text-3xl">cloud_upload</mat-icon>
              <div>
                <p class="text-xs font-black">Latest Backup: Today, 09:00 AM</p>
                <p class="text-[8px] text-primary font-bold uppercase tracking-widest">Automatic Daily Backup Enabled</p>
              </div>
           </div>
           
           <div class="flex gap-4">
              <button (click)="backupNow()" class="flex-1 py-5 bg-primary text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30">
                Backup Now
              </button>
              <button (click)="restore()" class="flex-1 py-5 bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-zinc-700 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest">
                Restore
              </button>
           </div>
        </div>
      </section>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class BackupExport {
  location = inject(Location);

  exportTools = [
    { type: 'products', label: 'Export Products', icon: 'inventory_2', desc: 'CSV, Excel, XML Format' },
    { type: 'orders', label: 'Export Orders', icon: 'shopping_bag', desc: 'Financial Records & Shipping Info' },
    { type: 'customers', label: 'Export Customers', icon: 'people', desc: 'Email/Phone List for Marketing' },
    { type: 'settings', label: 'Backup Settings', icon: 'settings', desc: 'Save App Configuration' },
  ];

  export(type: string) {
    alert('Generating ' + type + ' export file... (Demo)');
    setTimeout(() => alert(type.charAt(0).toUpperCase() + type.slice(1) + ' exported successfully!'), 1500);
  }

  backupNow() {
    alert('Full store backup initiated... (Demo)');
  }

  restore() {
    alert('Restoration requires a valid backup file. (Demo)');
  }
}
