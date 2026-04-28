import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-staff',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Staff Management</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assign roles & permissions</p>
        </div>
      </header>

      <button (click)="addStaff()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
        <mat-icon>person_add</mat-icon>
        Add New Staff
      </button>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Active Staff</h2>
        
        <div class="space-y-4">
           @for (member of staff; track member.id) {
             <div class="p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-700/50 flex items-center justify-between">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                     {{ member.name.charAt(0) }}
                   </div>
                   <div>
                     <p class="text-xs font-black">{{ member.name }}</p>
                     <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{{ member.role }}</p>
                   </div>
                </div>
                <div class="flex items-center gap-2">
                   <button (click)="editPermissions(member)" class="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400">
                     <mat-icon class="text-lg">tune</mat-icon>
                   </button>
                   <button (click)="removeStaff(member.id)" class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-400">
                     <mat-icon class="text-lg">delete_outline</mat-icon>
                   </button>
                </div>
             </div>
           }
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Role Permissions Matrix</h2>
        
        <div class="space-y-4">
           @for (role of roles; track role.name) {
             <div class="space-y-2">
               <h3 class="text-[10px] font-black uppercase text-primary tracking-widest pl-2">{{ role.name }}</h3>
               <div class="flex flex-wrap gap-2">
                 @for (perm of role.permissions; track perm) {
                   <span class="px-3 py-1 bg-slate-50 dark:bg-zinc-800 rounded-lg text-[8px] font-black uppercase tracking-tight text-slate-500">{{ perm }}</span>
                 }
               </div>
             </div>
           }
        </div>
      </section>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class StaffManagement {
  location = inject(Location);

  staff = [
    { id: 1, name: 'Owner IYABD', role: 'Owner' },
    { id: 2, name: 'Sabbir Ahmed', role: 'Order Manager' },
    { id: 3, name: 'Nabila Karim', role: 'Product Manager' },
  ];

  roles = [
    { name: 'Owner', permissions: ['Full Access', 'Delete Store', 'Financials'] },
    { name: 'Admin', permissions: ['Manage Staff', 'Settings', 'Products', 'Orders', 'Reports'] },
    { name: 'Order Manager', permissions: ['View Orders', 'Update Status', 'Order Tracking', 'Customer Support'] },
    { name: 'Product Manager', permissions: ['Add Products', 'Edit Products', 'Categories', 'Inventory Management'] },
    { name: 'Delivery Manager', permissions: ['Courier Management', 'Update Tracking', 'Packing Labels'] },
  ];

  addStaff() {
    alert('Feature coming soon: Invite staff via email. (Demo)');
  }

  editPermissions(member: {name: string}) {
    alert('Editing permissions for ' + member.name + '... (Demo)');
  }

  removeStaff(id: number) {
    if(confirm('Are you sure you want to remove this staff member?')) {
      this.staff = this.staff.filter(s => s.id !== id);
    }
  }
}
