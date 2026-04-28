import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-notifications',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Notifications</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage alerts & updates</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Admin Alerts</h2>
        
        <div class="space-y-2">
           @for (pref of adminPrefs; track pref.key) {
             <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
               <div>
                 <p class="text-[10px] font-black uppercase text-slate-500 tracking-tight">{{ pref.label }}</p>
                 <p class="text-[8px] text-slate-300 font-bold uppercase">{{ pref.desc }}</p>
               </div>
               <button (click)="adminSettings[pref.key] = !adminSettings[pref.key]" 
                       [class]="adminSettings[pref.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-zinc-700'"
                       class="w-10 h-6 rounded-full relative transition-all">
                 <div [class]="adminSettings[pref.key] ? 'translate-x-5' : 'translate-x-1'" class="absolute -top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"></div>
               </button>
             </div>
           }
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Customer Updates</h2>
        
        <div class="space-y-2">
           @for (pref of customerPrefs; track pref.key) {
             <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
               <div>
                 <p class="text-[10px] font-black uppercase text-slate-500 tracking-tight">{{ pref.label }}</p>
                 <p class="text-[8px] text-slate-300 font-bold uppercase">{{ pref.desc }}</p>
               </div>
               <button (click)="customerSettings[pref.key] = !customerSettings[pref.key]" 
                       [class]="customerSettings[pref.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                       class="w-10 h-6 rounded-full relative transition-all">
                 <div [class]="customerSettings[pref.key] ? 'translate-x-5' : 'translate-x-1'" class="absolute -top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"></div>
               </button>
             </div>
           }
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Notification Preferences
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class NotificationSettings implements OnInit {
  location = inject(Location);

  adminSettings: Record<string, boolean> = {
    newOrder: true,
    lowStock: true,
    payout: true,
    support: false
  };

  customerSettings: Record<string, boolean> = {
    orderConfirm: true,
    shipped: true,
    cancelled: true,
    marketing: false
  };

  adminPrefs = [
    { key: 'newOrder', label: 'New Order Alert', desc: 'Notify on every new sale' },
    { key: 'lowStock', label: 'Low Stock Alert', desc: 'Notify when products are running out' },
    { key: 'payout', label: 'Payout Success', desc: 'Notify when payment is received' },
    { key: 'support', label: 'Support Ticket', desc: 'Notify on new customer query' },
  ];

  customerPrefs = [
    { key: 'orderConfirm', label: 'Order Confirmation', desc: 'Send email/SMS after order' },
    { key: 'shipped', label: 'Shipping Update', desc: 'Notify when item is dispatched' },
    { key: 'cancelled', label: 'Cancellation Alert', desc: 'Notify if order is cancelled' },
    { key: 'marketing', label: 'Marketing Emails', desc: 'Occasional promo updates' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    localStorage.setItem('iyabd_notif_admin', JSON.stringify(this.adminSettings));
    localStorage.setItem('iyabd_notif_customer', JSON.stringify(this.customerSettings));
    alert('Notification settings updated! (Demo)');
  }

  load() {
    const a = localStorage.getItem('iyabd_notif_admin');
    const c = localStorage.getItem('iyabd_notif_customer');
    if (a) this.adminSettings = JSON.parse(a);
    if (c) this.customerSettings = JSON.parse(c);
  }
}
