import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Payment Settings</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        @for (method of paymentMethods; track method.name) {
          <div class="space-y-3">
             <div class="flex items-center justify-between pl-4">
                <label [for]="'pay_' + method.name" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ method.name }} Number</label>
                <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500"></div>
             </div>
             <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" [style.background]="method.color + '20'" [style.color]="method.color">
                   <mat-icon class="text-lg">account_balance_wallet</mat-icon>
                </div>
                <input [id]="'pay_' + method.name" type="text" [(ngModel)]="method.number" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 pl-14 text-sm font-black tracking-widest focus:ring-2 focus:ring-primary/20">
             </div>
          </div>
        }

        <div class="space-y-2 pt-4">
           <label for="pay_instructions" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Payment Instruction</label>
           <textarea id="pay_instructions" rows="4" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm resize-none" placeholder="Enter instructions for customers..."></textarea>
        </div>

        <button class="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-4 hover:scale-[1.01] transition-all">
           Save Payment Options
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class PaymentSettings {
  location = inject(Location);
  
  paymentMethods = [
    { name: 'bKash', number: '01671060679', color: '#D12053' },
    { name: 'Nagad', number: '01671060679', color: '#F7941E' },
    { name: 'Rocket', number: '01671060679', color: '#8C3494' },
  ];
}
