import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-invoice-settings',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Invoice Settings</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Customize your orders' invoices</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Standard Invoice Info</h2>
        
        <div class="space-y-4">
           <div class="space-y-2 text-center">
              <label for="invType" class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Invoice Logo</label>
              <div id="invType" class="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center relative group border border-slate-100 dark:border-zinc-700/50">
                 <mat-icon class="text-slate-300">business</mat-icon>
                 <button class="absolute inset-0 bg-black/40 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <mat-icon>upload</mat-icon>
                 </button>
              </div>
           </div>

           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="inv_prefix" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Invoice Prefix</label>
                <input id="inv_prefix" type="text" [(ngModel)]="data['prefix']" placeholder="INV-" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="space-y-2">
                <label for="inv_start" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Next Number</label>
                <input id="inv_start" type="number" [(ngModel)]="data['nextNumber']" placeholder="1001" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
              </div>
           </div>

           <div class="space-y-2">
             <label for="shop_addr" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Shop Address (For Invoice)</label>
             <textarea id="shop_addr" [(ngModel)]="data['address']" rows="3" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20"
                       placeholder="Mirpur, Dhaka..."></textarea>
           </div>
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Footer Notes & Terms</h2>
        
        <div class="space-y-2">
            <textarea [(ngModel)]="data['footerNote']" rows="4" 
                      class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                      placeholder="Thank you for shopping!"></textarea>
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Invoice Settings
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class InvoiceSettings implements OnInit {
  location = inject(Location);

  data: Record<string, string | number> = {
    logo: '',
    prefix: 'INV-',
    nextNumber: 1001,
    address: 'IYABD SHOP\nMirpur 10, Dhaka 1216\nBangladesh',
    footerNote: 'Terms: 7-day return policy applies. Please keep the invoice for warranty claims.'
  };

  ngOnInit() {
    this.load();
  }

  save() {
    localStorage.setItem('iyabd_invoice', JSON.stringify(this.data));
    alert('Invoice settings updated! (Demo)');
  }

  load() {
    const data = localStorage.getItem('iyabd_invoice');
    if (data) this.data = { ...this.data, ...JSON.parse(data) };
  }
}
