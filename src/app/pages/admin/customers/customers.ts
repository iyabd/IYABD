import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-heading font-bold">Customers</h1>
        <p class="text-slate-500 text-sm">Review your shop's registered customers and their activities.</p>
      </header>

      <div class="relative">
        <input type="text" placeholder="Search by name or phone..." 
               class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm">
        <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
      </div>

      <div class="space-y-4">
        @for (customer of customers(); track customer.id) {
          <div class="bg-white dark:bg-zinc-900 p-5 rounded-3xl soft-shadow border border-slate-100 dark:border-zinc-800 flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
               {{ customer.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
               <div class="font-bold truncate">{{ customer.name }}</div>
               <div class="text-xs text-slate-400">{{ customer.phone }}</div>
            </div>
            <div class="text-right">
               <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ customer.ordersCount }} Orders</div>
               <div class="text-sm font-black text-primary taka-symbol">{{ customer.totalSpent }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class Customers {
  customers = signal([
    { id: 1, name: 'Rahat Islam', phone: '01712345678', ordersCount: 3, totalSpent: 7500 },
    { id: 2, name: 'Sumaiya Akter', phone: '01887654321', ordersCount: 1, totalSpent: 850 },
    { id: 3, name: 'Tanvir Hossain', phone: '01612121212', ordersCount: 5, totalSpent: 12400 },
  ]);
}
