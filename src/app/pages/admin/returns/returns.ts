import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-returns',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Returns & Refunds</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Handle customer return requests</p>
        </div>
      </header>

      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        @for (status of statuses; track status) {
          <button (click)="activeStatus.set(status)"
                  class="whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border"
                  [class]="activeStatus() === status ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-500'">
            {{ status }}
          </button>
        }
      </div>

      <div class="space-y-4">
        @for (item of filteredRequests(); track item.id) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800/50 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Order #{{ item.orderId }} • {{ item.date }}</p>
                <h3 class="font-black text-sm">{{ item.customer }}</h3>
              </div>
              <span [class]="getStatusClass(item.status)" class="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {{ item.status }}
              </span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl">
              <p class="text-[10px] font-bold text-slate-500 uppercase mb-1">Reason for Return</p>
              <p class="text-xs italic text-slate-600 dark:text-slate-300">"{{ item.reason }}"</p>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="approve(item.id)" class="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                Approve
              </button>
              <button (click)="reject(item.id)" class="flex-1 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                Reject
              </button>
            </div>
          </div>
        } @empty {
          <div class="py-20 text-center">
             <mat-icon class="text-slate-200 text-6xl mb-4">assignment_return</mat-icon>
             <p class="text-slate-400 font-bold">No return requests found.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ReturnsManagement {
  location = inject(Location);
  activeStatus = signal('Pending');
  statuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

  requests = [
    { id: 1, orderId: 'ORD-5542', customer: 'Rakibul Islam', date: '2026-04-26', status: 'Pending', reason: 'Size mismatch, want to exchange' },
    { id: 2, orderId: 'ORD-5530', customer: 'Tanvir Ahmed', date: '2026-04-25', status: 'Approved', reason: 'Defective product received' },
    { id: 3, orderId: 'ORD-5512', customer: 'Nila Akhter', date: '2026-04-24', status: 'Pending', reason: 'Changed my mind' },
  ];

  filteredRequests = () => this.requests.filter(r => r.status === this.activeStatus());

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500';
      case 'Approved': return 'bg-emerald-500/10 text-emerald-500';
      case 'Rejected': return 'bg-red-500/10 text-red-500';
      case 'Completed': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  approve(id: number) {
     alert(`Return request ${id} approved. (Demo)`);
  }

  reject(id: number) {
     alert(`Return request ${id} rejected. (Demo)`);
  }
}
