import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-marketing-tracking',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Marketing & Tracking</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage pixels, API and analytics integrations</p>
        </div>
      </header>

      <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-amber-500">security</mat-icon>
        <p class="text-[10px] text-amber-700/80 dark:text-amber-300/70 font-bold leading-relaxed uppercase tracking-wide">
          Pixel Tokens and API secrets are sensitive data. Always handle with caution and use environment secrets for production.
        </p>
      </div>

      <!-- Meta / Facebook Pixel -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading flex items-center gap-2">
            <mat-icon class="text-blue-600">facebook</mat-icon>
            Meta / Facebook Pixel
          </h2>
          <button (click)="meta['enabled'] = !meta['enabled']" 
                  [class]="meta['enabled'] ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
                  class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {{ meta['enabled'] ? 'Enabled' : 'Disabled' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (field of metaFields; track field.id) {
            <div class="space-y-2">
              <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
              @if (field.type === 'toggle') {
                <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between h-[52px]">
                  <span class="text-[10px] font-black uppercase tracking-tight">{{ field.label }}</span>
                  <button (click)="meta[field.key] = !meta[field.key]" 
                          [class]="meta[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-8 h-4 rounded-full relative transition-all">
                    <div [class]="meta[field.key] ? 'translate-x-4' : 'translate-x-1'" class="absolute -top-1 w-3 h-3 rounded-full bg-white transition-transform shadow-sm"></div>
                  </button>
                </div>
              } @else {
                <input [id]="field.id" [type]="field.type" [(ngModel)]="meta[field.key]" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
              }
            </div>
          }
        </div>
      </section>

      <!-- TikTok Pixel -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading flex items-center gap-2">
            <mat-icon class="text-black dark:text-white">music_note</mat-icon>
            TikTok Pixel
          </h2>
          <button (click)="tiktok['enabled'] = !tiktok['enabled']" 
                  [class]="tiktok['enabled'] ? 'bg-black dark:bg-zinc-700 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
                  class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {{ tiktok['enabled'] ? 'Enabled' : 'Disabled' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (field of tiktokFields; track field.id) {
            <div class="space-y-2">
              <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
              @if (field.type === 'toggle') {
                <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between h-[52px]">
                  <span class="text-[10px] font-black uppercase tracking-tight">{{ field.label }}</span>
                  <button (click)="tiktok[field.key] = !tiktok[field.key]" 
                          [class]="tiktok[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-8 h-4 rounded-full relative transition-all">
                    <div [class]="tiktok[field.key] ? 'translate-x-4' : 'translate-x-1'" class="absolute -top-1 w-3 h-3 rounded-full bg-white transition-transform shadow-sm"></div>
                  </button>
                </div>
              } @else {
                <input [id]="field.id" [type]="field.type" [(ngModel)]="tiktok[field.key]" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-black/20">
              }
            </div>
          }
        </div>
      </section>

      <!-- Google Analytics / GTM -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading flex items-center gap-2">
            <mat-icon class="text-orange-400">analytics</mat-icon>
            Google Tracking
          </h2>
          <button (click)="google['enabled'] = !google['enabled']" 
                  [class]="google['enabled'] ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
                  class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {{ google['enabled'] ? 'Enabled' : 'Disabled' }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (field of googleFields; track field.id) {
            <div class="space-y-2">
              <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
              @if (field.type === 'toggle') {
                <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between h-[52px]">
                  <span class="text-[10px] font-black uppercase tracking-tight">{{ field.label }}</span>
                  <button (click)="google[field.key] = !google[field.key]" 
                          [class]="google[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-8 h-4 rounded-full relative transition-all">
                    <div [class]="google[field.key] ? 'translate-x-4' : 'translate-x-1'" class="absolute -top-1 w-3 h-3 rounded-full bg-white transition-transform shadow-sm"></div>
                  </button>
                </div>
              } @else {
                <input [id]="field.id" [type]="field.type" [(ngModel)]="google[field.key]" 
                       class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-orange-500/20">
              }
            </div>
          }
        </div>
      </section>

      <!-- Custom Scripts -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading flex items-center gap-2 border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <mat-icon class="text-zinc-400">code</mat-icon>
          Website Tracking Scripts
        </h2>
        
        <div class="space-y-6">
          @for (script of scripts; track script.id) {
            <div class="space-y-2">
              <div class="flex items-center justify-between pl-4">
                <label [for]="script.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ script.label }}</label>
                <div class="flex items-center gap-2">
                   <span class="text-[8px] font-black uppercase text-slate-400">Active</span>
                   <button (click)="script.active = !script.active" 
                          [class]="script.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-6 h-3 rounded-full relative transition-all">
                    <div [class]="script.active ? 'translate-x-3' : 'translate-x-0.5'" class="absolute -top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform shadow-xs"></div>
                  </button>
                </div>
              </div>
              <textarea [id]="script.id" [(ngModel)]="script.content" rows="4" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono"></textarea>
            </div>
          }
        </div>
      </section>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-4">
        <button (click)="reset()" class="py-5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
          Reset
        </button>
        <button (click)="test()" class="py-5 bg-zinc-900 dark:bg-zinc-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
          <mat-icon class="text-sm">analytics</mat-icon>
          Test Pixels
        </button>
      </div>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Marketing Settings
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TrackingSettings implements OnInit {
  location = inject(Location);
  private storage = inject(StorageService);
  private platformId = inject(PLATFORM_ID);

  meta: Record<string, string | boolean> = {
    enabled: false,
    pixelId: '',
    accessToken: '',
    datasetId: '',
    testEventCode: '',
    businessId: '',
    adAccountId: '',
    catalogId: '',
    pageId: '',
    pageUrl: 'https://www.facebook.com/iyabdshop',
    domainMeta: '',
    advancedMatching: true,
    capi: true,
    deduplication: true
  };

  tiktok: Record<string, string | boolean> = {
    enabled: false,
    pixelId: '',
    accessToken: '',
    testEventCode: '',
    eventsApi: true,
    advancedMatching: true
  };

  google: Record<string, string | boolean> = {
    enabled: false,
    ga4Id: '',
    apiSecret: '',
    gtmId: '',
    adsId: '',
    adsLabel: ''
  };

  scripts = [
    { id: 'header_scripts', label: 'Header Script Box (<head>)', content: '', active: true },
    { id: 'body_scripts', label: 'Body Script Box (After <body>)', content: '', active: true },
    { id: 'footer_scripts', label: 'Footer Script Box (Before </body>)', content: '', active: true },
    { id: 'custom_css', label: 'Custom CSS Box', content: '', active: true },
    { id: 'custom_js', label: 'Custom JS Box', content: '', active: true },
  ];

  metaFields = [
    { id: 'm_pixel', label: 'Pixel ID', key: 'pixelId', type: 'text' },
    { id: 'm_dataset', label: 'Dataset ID', key: 'datasetId', type: 'text' },
    { id: 'm_access', label: 'Access Token', key: 'accessToken', type: 'password' },
    { id: 'm_test', label: 'Test Event Code', key: 'testEventCode', type: 'text' },
    { id: 'm_business', label: 'Business ID', key: 'businessId', type: 'text' },
    { id: 'm_page', label: 'Page URL', key: 'pageUrl', type: 'text' },
    { id: 'm_capi', label: 'Conversions API', key: 'capi', type: 'toggle' },
    { id: 'm_match', label: 'Advanced Matching', key: 'advancedMatching', type: 'toggle' },
    { id: 'm_dedup', label: 'Deduplication', key: 'deduplication', type: 'toggle' },
  ];

  tiktokFields = [
    { id: 'tt_pixel', label: 'Pixel ID', key: 'pixelId', type: 'text' },
    { id: 'tt_access', label: 'Access Token', key: 'accessToken', type: 'password' },
    { id: 'tt_test', label: 'Test Code', key: 'testEventCode', type: 'text' },
    { id: 'tt_capi', label: 'Events API', key: 'eventsApi', type: 'toggle' },
    { id: 'tt_match', label: 'Advanced Matching', key: 'advancedMatching', type: 'toggle' },
  ];

  googleFields = [
    { id: 'g_ga4', label: 'GA4 Measurement ID', key: 'ga4Id', type: 'text' },
    { id: 'g_secret', label: 'API Secret', key: 'apiSecret', type: 'password' },
    { id: 'g_gtm', label: 'GTM ID', key: 'gtmId', type: 'text' },
    { id: 'g_ads', label: 'Ads Conversion ID', key: 'adsId', type: 'text' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_marketing', JSON.stringify({
      meta: this.meta,
      tiktok: this.tiktok,
      google: this.google,
      scripts: this.scripts
    }));
    alert('Marketing & Tracking settings saved!');
  }

  load() {
    const data = this.storage.getItem('iyabd_marketing');
    if (data) {
      const parsed = JSON.parse(data);
      this.meta = { ...this.meta, ...parsed.meta };
      this.tiktok = { ...this.tiktok, ...parsed.tiktok };
      this.google = { ...this.google, ...parsed.google };
      this.scripts = parsed.scripts || this.scripts;
    }
  }

  reset() {
    if(confirm('Are you sure? This will clear all pixel IDs and tokens.')) {
      this.storage.removeItem('iyabd_marketing');
      if (isPlatformBrowser(this.platformId)) {
        window.location.reload();
      }
    }
  }

  test() {
    alert('Scanning website for active pixels... (Simulation)');
    setTimeout(() => alert('Found: FB Pixel ID ' + (this.meta['pixelId'] || '[Empty]') + ' - Status: Live'), 2000);
  }
}

