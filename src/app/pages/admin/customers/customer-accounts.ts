import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface UserAccount {
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-customer-accounts',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Customer Accounts</h1>
      </header>

      <div class="flex gap-2">
        <button (click)="exportAccounts()" class="flex-1 py-4 bg-white dark:bg-zinc-900 rounded-3xl soft-shadow border border-slate-100 dark:border-zinc-800 font-black text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400 flex items-center justify-center gap-2">
          <mat-icon>file_download</mat-icon> Export Customers
        </button>
      </div>

      <div class="space-y-4">
        @for (acc of accounts(); track acc.email) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                  <mat-icon>account_circle</mat-icon>
                </div>
                <div>
                  <h3 class="font-black text-sm">{{ acc.email }}</h3>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ acc.role }} account • Created: {{ acc.createdAt }}</p>
                </div>
              </div>
              <div [class]="acc.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'" 
                   class="w-2 h-2 rounded-full shadow-[0_0_8px] shadow-current"></div>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-4">
              <button (click)="viewOrders(acc)" class="py-3 bg-primary/5 text-primary rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">View Orders</button>
              <button (click)="resetPassword(acc)" class="py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all">Reset Password</button>
              <button (click)="toggleState(acc)" class="py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                      [class]="acc.status === 'Active' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'">
                {{ acc.status === 'Active' ? 'Suspended' : 'Activate' }}
              </button>
              <button (click)="deleteAccount(acc)" class="py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Delete Account</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class CustomerAccounts {
  location = inject(Location);
  
  accounts = signal([
    { email: 'customer@gmail.com', role: 'customer', status: 'Active', createdAt: '2024-03-12' },
    { email: 'user123@yahoo.com', role: 'customer', status: 'Active', createdAt: '2024-04-01' },
    { email: 'test@iyabd.com', role: 'customer', status: 'Suspended', createdAt: '2023-11-15' },
  ]);

  exportAccounts() {
    alert('Exporting customer account data to CSV...');
  }

  viewOrders(acc: UserAccount) {
    alert(`Showing orders for ${acc.email}...`);
  }

  resetPassword(acc: UserAccount) {
    alert(`Password reset link sent to ${acc.email}`);
  }

  toggleState(acc: UserAccount) {
    this.accounts.update(list => list.map(a => 
      a.email === acc.email ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a
    ));
  }

  deleteAccount(acc: UserAccount) {
    if (confirm(`Are you sure you want to PERMANENTLY delete the account: ${acc.email}?`)) {
      this.accounts.update(list => list.filter(a => a.email !== acc.email));
    }
  }
}
