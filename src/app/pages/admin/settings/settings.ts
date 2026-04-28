import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../services/config';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-heading font-bold">Settings</h1>
        <p class="text-slate-500 text-sm">Configure your shop details and branding.</p>
      </header>

      <div class="space-y-6 pb-12">
        <!-- Shop Info -->
        <section class="bg-white dark:bg-zinc-900 rounded-3xl p-6 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-4">
          <h2 class="font-bold flex items-center gap-2">
            <mat-icon class="text-primary">store</mat-icon>
            Shop Information
          </h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="compName" class="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                <input id="compName" type="text" [(ngModel)]="localConfig.companyName" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="space-y-1">
                <label for="waNum" class="text-xs font-bold text-slate-500 uppercase">WhatsApp Number</label>
                <input id="waNum" type="text" [(ngModel)]="localConfig.whatsapp" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
              </div>
            </div>
            
            <div class="space-y-1">
              <label for="addr" class="text-xs font-bold text-slate-500 uppercase">Address</label>
              <textarea id="addr" rows="3" [(ngModel)]="localConfig.address" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20"></textarea>
            </div>
          </div>
        </section>

        <!-- Payment Info -->
        <section class="bg-white dark:bg-zinc-900 rounded-3xl p-6 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-4">
          <h2 class="font-bold flex items-center gap-2">
            <mat-icon class="text-primary">payments</mat-icon>
            Payment Methods
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label for="bkashNum" class="text-xs font-bold text-slate-500 uppercase">bKash Personal</label>
              <input id="bkashNum" type="text" [(ngModel)]="localConfig.bkash" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono">
            </div>
            <div class="space-y-1">
              <label for="nagadNum" class="text-xs font-bold text-slate-500 uppercase">Nagad Personal</label>
              <input id="nagadNum" type="text" [(ngModel)]="localConfig.nagad" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono">
            </div>
            <div class="space-y-1">
              <label for="rocketNum" class="text-xs font-bold text-slate-500 uppercase">Rocket Personal</label>
              <input id="rocketNum" type="text" [(ngModel)]="localConfig.rocket" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 font-mono">
            </div>
          </div>
        </section>

        <!-- Delivery Charges -->
        <section class="bg-white dark:bg-zinc-900 rounded-3xl p-6 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-4">
          <h2 class="font-bold flex items-center gap-2">
            <mat-icon class="text-primary">local_shipping</mat-icon>
            Delivery Charges
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="delInside" class="text-xs font-bold text-slate-500 uppercase">Inside Dhaka</label>
              <div class="relative">
                <input id="delInside" type="number" [(ngModel)]="localConfig.deliveryChargeInside" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 pl-8">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
              </div>
            </div>
            <div class="space-y-1">
              <label for="delOutside" class="text-xs font-bold text-slate-500 uppercase">Outside Dhaka</label>
              <div class="relative">
                <input id="delOutside" type="number" [(ngModel)]="localConfig.deliveryChargeOutside" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 pl-8">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Facebook Integration -->
        <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
          <h2 class="font-black text-xl font-heading flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
              <mat-icon class="font-black">facebook</mat-icon>
            </div>
            Facebook Integration
          </h2>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <label for="fbUrl" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Facebook Page URL</label>
              <input id="fbUrl" type="text" [(ngModel)]="localConfig.facebookUrl" placeholder="https://facebook.com/yourpage" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="fbId" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Facebook Page ID</label>
                <input id="fbId" type="text" [(ngModel)]="localConfig.facebookPageId" placeholder="e.g. 1029384756" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="space-y-1">
                <label for="fbToken" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Page Access Token</label>
                <input id="fbToken" type="password" [(ngModel)]="localConfig.facebookAccessToken" placeholder="EAAb..." class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
              </div>
            </div>
            <div class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
               <div class="flex items-start gap-3">
                  <mat-icon class="text-blue-500 text-sm">info</mat-icon>
                  <div class="space-y-1">
                     <p class="text-[10px] font-black text-blue-900 dark:text-blue-200 uppercase tracking-widest">Setup Instructions</p>
                     <p class="text-[10px] font-medium text-blue-700 dark:text-blue-300 leading-relaxed uppercase">
                        Generate a Page Access Token with <span class="bg-blue-500/10 px-1 rounded">pages_manage_posts</span> permission from Facebook Developers portal. This allows automatic product sharing and live updates fetch.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <!-- SEO Settings -->
        <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
          <h2 class="font-black text-xl font-heading flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <mat-icon class="font-black">search</mat-icon>
            </div>
            SEO Settings
          </h2>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <label for="seoTitle" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Website Title</label>
              <input id="seoTitle" type="text" [(ngModel)]="localConfig.seoTitle" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
            </div>
            <div class="space-y-1">
              <label for="seoDesc" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Meta Description</label>
              <textarea id="seoDesc" rows="3" [(ngModel)]="localConfig.seoDescription" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary/20"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="seoKeywords" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Keywords (Comma separated)</label>
                <input id="seoKeywords" type="text" [(ngModel)]="localConfig.seoKeywords" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
              </div>
              <div class="space-y-1">
                <label for="seoGoogle" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Google Verification Code</label>
                <input id="seoGoogle" type="text" [(ngModel)]="localConfig.googleVerification" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20" placeholder="e.g. g-xv...">
              </div>
            </div>
            <div class="space-y-1">
              <label for="seoImg" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Meta/OG Image URL</label>
              <input id="seoImg" type="text" [(ngModel)]="localConfig.seoImage" class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-2 focus:ring-primary/20">
            </div>
          </div>
        </section>

        <!-- Branding -->
        <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
          <h2 class="font-black text-xl font-heading flex items-center gap-3">
             <div class="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <mat-icon class="font-black">branding_watermark</mat-icon>
             </div>
             Branding
          </h2>
          <div class="flex items-center gap-6 p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-700">
             <div class="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800">
                <img [src]="localConfig.logo" alt="Shop Logo" class="max-w-[80%] max-h-[80%] object-contain">
             </div>
             <div class="flex-1 space-y-2">
                <p class="text-xs font-black uppercase tracking-widest text-slate-400 leading-none">Shop Logo</p>
                <p class="text-[10px] font-bold text-slate-500">Update your brand identity instantly.</p>
                <button (click)="logoInput.click()" class="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Upload New</button>
                <input #logoInput type="file" class="hidden" (change)="onLogoUpload($event)" accept="image/*">
             </div>
          </div>
        </section>

        <div class="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 z-50 animate-in slide-in-from-bottom-10">
          <button (click)="saveSettings()" class="w-full bg-slate-900 dark:bg-primary text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Settings {
  configService = inject(ConfigService);
  localConfig = { ...this.configService.config() };

  saveSettings() {
    this.configService.updateConfig(this.localConfig);
    alert('Settings Updated Successfully! All changes are now live.');
  }

  onLogoUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file) {
      // In a real app we'd upload this. For demo, we use a FileReader or random images for effect.
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.localConfig.logo = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
