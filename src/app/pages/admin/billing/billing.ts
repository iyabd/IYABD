import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Billing</h1>
      </header>

      <div class="space-y-4">
        @for (bill of bills(); track bill.id) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 space-y-4">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                    <mat-icon>receipt_long</mat-icon>
                  </div>
                  <div>
                    <h3 class="font-black text-sm">Invoice {{ bill.id }}</h3>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ bill.date }}</p>
                  </div>
               </div>
               <div [class]="bill.paid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'" 
                    class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                 {{ bill.paid ? 'Paid' : 'Unpaid' }}
               </div>
            </div>

            <div class="flex items-center justify-between py-4 border-t border-dashed border-slate-100 dark:border-zinc-800">
               <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                  <p class="font-black text-lg text-primary">৳{{ bill.amount }}</p>
               </div>
               <div class="text-right">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</p>
                  <p class="font-bold text-xs">{{ bill.method }}</p>
               </div>
            </div>
            
            <div class="flex items-center justify-between py-2 border-t border-dashed border-slate-100 dark:border-zinc-800">
               <div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</p>
                  <p class="font-bold text-xs">{{ bill.txnId || 'N/A' }}</p>
               </div>
               <div class="text-right">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Refund Status</p>
                  <p class="font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter"
                     [class]="bill.refunded ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'">
                    {{ bill.refunded ? 'Refunded' : 'None' }}
                  </p>
               </div>
            </div>
            
            <button class="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
               <mat-icon class="text-sm">download</mat-icon>
               Download Invoice
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Billing {
  location = inject(Location);
  bills = signal([
    { id: '#INV-9921', date: '26 April, 2024', amount: 1450, paid: true, method: 'bKash', txnId: '9K01LZM2', refunded: false },
    { id: '#INV-9920', date: '25 April, 2024', amount: 820, paid: true, method: 'Nagad', txnId: 'N112XM90', refunded: false },
    { id: '#INV-9919', date: '24 April, 2024', amount: 2100, paid: false, method: 'COD', txnId: '', refunded: false },
    { id: '#INV-9918', date: '20 April, 2024', amount: 4500, paid: true, method: 'bKash', txnId: '8J8892KL', refunded: true },
  ]);
}
