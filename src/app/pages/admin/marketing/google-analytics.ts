import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-google-analytics',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Google Analytics</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Track website traffic & behavior</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading">Google Tracking</h2>
          <div (click)="google['enabled'] = !google['enabled']" 
               (keyup.enter)="google['enabled'] = !google['enabled']"
               tabindex="0"
               [class]="google['enabled'] ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
               class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
            {{ google['enabled'] ? 'Active' : 'Inactive' }}
          </div>
        </div>

        <div class="space-y-4">
           @for (field of fields; track field.id) {
             <div class="space-y-2">
               <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
               <input [id]="field.id" [type]="field.type" [(ngModel)]="google[field.key]" 
                      class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
             </div>
           }
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Google Settings
      </button>

      <div class="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-emerald-500">ads_click</mat-icon>
        <p class="text-[10px] text-emerald-700/80 dark:text-emerald-300/70 font-bold leading-relaxed uppercase tracking-wide">
          Measurement ID is usually in G-XXXXXXXXXX format. GTM ID is GTM-XXXXXXX.
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class GoogleAnalyticsSettings implements OnInit {
  location = inject(Location);
  private storage = inject(StorageService);

  google: Record<string, string | boolean> = {
    enabled: true,
    measurementId: '',
    apiSecret: '',
    gtmId: '',
    adsConversionId: '',
    conversionLabel: ''
  };

  fields = [
    { id: 'ga_id', label: 'GA4 Measurement ID', key: 'measurementId', type: 'text' },
    { id: 'ga_secret', label: 'GA4 API Secret', key: 'apiSecret', type: 'password' },
    { id: 'gtm_id', label: 'Google Tag Manager ID', key: 'gtmId', type: 'text' },
    { id: 'gads_id', label: 'Google Ads Conversion ID', key: 'adsConversionId', type: 'text' },
    { id: 'gads_lbl', label: 'Conversion Label', key: 'conversionLabel', type: 'text' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_google', JSON.stringify(this.google));
    alert('Google Analytics settings saved! (Demo)');
  }

  load() {
    const data = this.storage.getItem('iyabd_google');
    if (data) this.google = { ...this.google, ...JSON.parse(data) };
  }
}
