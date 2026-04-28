import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-messaging',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">SMS & Messaging</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect SMS & WhatsApp APIs</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">API Configuration</h2>
        
        <div class="space-y-4">
           <div class="space-y-2">
             <label for="wa_num" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">WhatsApp Number</label>
             <input id="wa_num" type="text" [(ngModel)]="data['whatsappNumber']" placeholder="+880..." 
                    class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
           </div>
           <div class="space-y-2">
             <label for="sms_api" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">SMS API Key (Bulk SMS)</label>
             <input id="sms_api" type="password" [(ngModel)]="data['smsApiKey']" placeholder="Enter API Key" 
                    class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
           </div>
           <div class="space-y-2">
             <label for="sms_sid" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Sender ID / Masking</label>
             <input id="sms_sid" type="text" [(ngModel)]="data['smsSenderId']" placeholder="IYABD" 
                    class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
           </div>
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Message Templates</h2>
        
        <div class="space-y-4">
           @for (tmpl of templates; track tmpl.key) {
             <div class="space-y-2">
               <label [for]="tmpl.key" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ tmpl.label }}</label>
               <textarea [id]="tmpl.key" [(ngModel)]="data[tmpl.key]" rows="3" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                         [placeholder]="tmpl.placeholder"></textarea>
             </div>
           }
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Messaging Settings
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class MessagingSettings implements OnInit {
  location = inject(Location);

  data: Record<string, string> = {
    whatsappNumber: '',
    smsApiKey: '',
    smsSenderId: '',
    confirmMsg: '',
    shippedMsg: '',
    cancelMsg: ''
  };

  templates = [
    { key: 'confirmMsg', label: 'Order Confirmation', placeholder: 'Hello {name}, your order #{orderId} is confirmed!' },
    { key: 'shippedMsg', label: 'Delivery Message', placeholder: 'Hi {name}, your order #{orderId} is on the way!' },
    { key: 'cancelMsg', label: 'Cancellation Message', placeholder: 'Sorry {name}, your order #{orderId} was cancelled.' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    localStorage.setItem('iyabd_messaging', JSON.stringify(this.data));
    alert('Messaging settings updated! (Demo)');
  }

  load() {
    const data = localStorage.getItem('iyabd_messaging');
    if (data) this.data = { ...this.data, ...JSON.parse(data) };
  }
}
