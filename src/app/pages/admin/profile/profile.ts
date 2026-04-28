import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex items-center gap-4">
        <button (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">My Account</h1>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
        <div class="flex flex-col items-center bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] p-8 border-2 border-dashed border-primary/20">
          <div class="w-24 h-24 rounded-[2rem] bg-primary text-white flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-primary/40">
            {{ (auth.currentUser()?.name || 'A').charAt(0) }}
          </div>
          <button class="text-primary font-black text-xs uppercase tracking-widest hover:underline">Change Photo</button>
        </div>

        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="fullName" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Full Name</label>
              <input id="fullName" type="text" [value]="auth.currentUser()?.name" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20">
            </div>
            <div class="space-y-2">
              <label for="emailAddr" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Email Address</label>
              <input id="emailAddr" type="email" [value]="auth.currentUser()?.email" readonly class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm opacity-60">
            </div>
          </div>

          <div class="h-px bg-slate-100 dark:bg-zinc-800"></div>

          <div>
             <h3 class="text-lg font-black font-heading mb-4 pl-1">Security Settings</h3>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="space-y-2">
                 <label for="newPass" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">New Password</label>
                 <input id="newPass" type="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20">
               </div>
               <div class="space-y-2">
                 <label for="confirmPass" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Confirm Password</label>
                 <input id="confirmPass" type="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20">
               </div>
             </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button type="submit" class="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Save Changes</button>
            <button type="button" (click)="logout()" class="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all">Logout Session</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AdminProfile {
  auth = inject(AuthService);
  location = inject(Location);
  private platformId = inject(PLATFORM_ID);

  logout() {
    this.auth.logout();
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }
}
