import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-fraud',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Fraud Prevention</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Identify & block fake orders</p>
        </div>
      </header>

      <div class="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] p-6 flex items-center gap-4">
        <mat-icon class="text-red-500">security</mat-icon>
        <p class="text-[10px] text-red-700/80 dark:text-red-300/70 font-bold uppercase tracking-wide leading-relaxed">
          Suspicious activities are flagged based on multiple orders from same IP/Phone or high cancellation history.
        </p>
      </div>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Blacklisted Customers</h2>
        
        <div class="space-y-4">
           @for (customer of blacklist; track $index) {
             <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                   <mat-icon>block</mat-icon>
                 </div>
                 <div>
                   <p class="text-xs font-black">{{ customer.phone }}</p>
                   <p class="text-[8px] text-slate-400 font-bold uppercase">{{ customer.reason }}</p>
                 </div>
               </div>
               <button (click)="unblock(customer.phone)" class="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl">Unblock</button>
             </div>
           } @empty {
             <p class="text-center text-slate-400 text-xs font-bold py-4">No blocked numbers yet.</p>
           }
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Recent Fraud Alerts</h2>
        
        <div class="space-y-4">
           @for (alert of alerts; track alert.id) {
             <div class="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-700/50 space-y-3">
               <div class="flex items-center justify-between">
                 <span class="text-[8px] font-black uppercase text-red-500 px-2 py-0.5 bg-red-100 dark:bg-red-900/20 rounded-md">High Risk</span>
                 <p class="text-[8px] font-black text-slate-400 uppercase">{{ alert.date }}</p>
               </div>
               <p class="text-xs font-black">Order #{{ alert.orderId }} - {{ alert.customer }}</p>
               <p class="text-[10px] text-slate-500 leading-relaxed">{{ alert.description }}</p>
               
               <div class="flex items-center gap-2 pt-2">
                 <button (click)="cancelAndBlock(alert)" class="flex-1 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                   Block & Cancel
                 </button>
                 <button (click)="ignore(alert.id)" class="px-4 py-3 bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest">
                   Ignore
                 </button>
               </div>
             </div>
           }
        </div>
      </section>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class FraudManagement {
  location = inject(Location);

  blacklist = [
    { phone: '01712345678', reason: 'Multiple Fake Orders' },
    { phone: '01888888888', reason: 'Abusive Behavior' },
  ];

  alerts = [
    { id: 101, orderId: 'ORD-8890', customer: 'Mr. X', date: 'Just now', description: 'Address seems invalid/random. Phone has 3 previous cancellations.' },
    { id: 102, orderId: 'ORD-8885', customer: 'Unknown', date: '2 hours ago', description: 'IP address matches 5 other orders placed in last 10 minutes.' },
  ];

  unblock(phone: string) {
    alert('Phone number ' + phone + ' unblocked. (Demo)');
  }

  cancelAndBlock(alertItem: { orderId: string }) {
    alert('Order ' + alertItem.orderId + ' cancelled and customer blocked. (Demo)');
  }

  ignore(id: number) {
    this.alerts = this.alerts.filter(a => a.id !== id);
    alert('Alert ignored. (Demo)');
  }
}
