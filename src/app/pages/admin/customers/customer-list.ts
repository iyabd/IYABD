import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  clv: number;
  totalOrders: number;
  blocked: boolean;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="location.back()" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-heading font-black tracking-tight">Customers</h1>
        </div>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-3xl soft-shadow border border-slate-100 dark:border-zinc-800 flex items-center px-4 py-1">
        <mat-icon class="text-slate-400">search</mat-icon>
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name or mobile..." 
               class="flex-1 bg-transparent border-none py-4 px-3 text-sm focus:ring-0">
      </div>

      <div class="space-y-4">
        @for (customer of filteredCustomers(); track customer.id) {
          <div class="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] soft-shadow border border-slate-50 dark:border-zinc-800/10 group hover:border-primary/30 transition-all">
            <div class="flex items-start justify-between mb-4">
              <div class="flex gap-4">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                  {{ customer.name.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-black font-heading tracking-tight text-lg">{{ customer.name }}</h3>
                  <p class="text-xs text-slate-400 font-bold tracking-widest">{{ customer.email }}</p>
                  <p class="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1">{{ customer.address }}</p>
                </div>
              </div>
              <button (click)="toggleBlock(customer)" 
                      [class]="customer.blocked ? 'text-red-500 bg-red-50' : 'text-slate-400 bg-slate-50'" 
                      class="p-2 rounded-xl transition-colors">
                <mat-icon>{{ customer.blocked ? 'block' : 'person' }}</mat-icon>
              </button>
            </div>
            
            <div class="grid grid-cols-3 gap-2 pb-4 border-b border-dashed border-slate-100 dark:border-zinc-800 mb-4">
               <div>
                 <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Orders</p>
                 <p class="font-black text-primary">{{ customer.totalOrders }}</p>
               </div>
               <div>
                 <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">CLV (Spent)</p>
                 <p class="font-black text-emerald-500 taka-symbol">{{ customer.clv }}</p>
               </div>
               <div>
                 <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mobile</p>
                 <p class="font-bold text-[10px]">{{ customer.mobile }}</p>
               </div>
            </div>

            <div class="flex items-center gap-2">
              <button class="flex-1 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">View All Orders</button>
              <button (click)="toggleBlock(customer)" 
                      class="flex-1 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                      [class]="customer.blocked ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-red-50 hover:text-red-600'">
                {{ customer.blocked ? 'Unblock User' : 'Block User' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; } .taka-symbol::before { content: '৳'; }`]
})
export class CustomerList {
  location = inject(Location);
  searchQuery = '';
  
  customers = signal([
    { id: 1, name: 'Arif Rahman', email: 'arif@gmail.com', mobile: '01712345678', address: 'Dhanmondi, Dhaka', clv: 12500, totalOrders: 12, blocked: false },
    { id: 2, name: 'Sultana Ahmed', email: 'sultana.a@gmail.com', mobile: '01887654321', address: 'Banani, Dhaka', clv: 4200, totalOrders: 5, blocked: false },
    { id: 3, name: 'Kamal Pasha', email: 'kamal.p@gmail.com', mobile: '01900112233', address: 'Mirpur, Dhaka', clv: 45800, totalOrders: 28, blocked: true },
    { id: 4, name: 'Tina Islam', email: 'tina@gmail.com', mobile: '01677889900', address: 'Gulshan, Dhaka', clv: 1500, totalOrders: 3, blocked: false },
  ]);

  toggleBlock(customer: Customer) {
    this.customers.update(list => list.map(c => 
      c.id === customer.id ? { ...c, blocked: !c.blocked } : c
    ));
  }

  filteredCustomers() {
    return this.customers().filter(c => 
      c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      c.mobile.includes(this.searchQuery)
    );
  }
}
