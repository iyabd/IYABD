import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-catalog-settings',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">FB Catalog Feed</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect products to Meta Business Manager</p>
        </div>
      </header>

      <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-amber-500">campaign</mat-icon>
        <p class="text-[10px] text-amber-700/80 dark:text-amber-300/70 font-bold leading-relaxed uppercase tracking-wide">
          Changes to product mapping or feed URL will require a re-sync in your Meta Commerce Manager account.
        </p>
      </div>

      <!-- Feed Connection -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading">Feed URL</h2>
          <div (click)="catalog['enabled'] = !catalog['enabled']" 
               (keyup.enter)="catalog['enabled'] = !catalog['enabled']"
               tabindex="0"
               [class]="catalog['enabled'] ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
               class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
            {{ catalog['enabled'] ? 'Active' : 'Inactive' }}
          </div>
        </div>

        <div class="space-y-2">
          <label for="feed_url" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Feed URL (Copy to Meta Commerce Manager)</label>
          <div class="flex gap-2">
            <input id="feed_url" type="text" readonly [value]="feedUrl" class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono opacity-70">
            <button (click)="copyUrl()" class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform active:scale-90">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Sync Logic -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Sync Configuration</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
           @for (field of syncFields; track field.id) {
             <div class="space-y-2">
               <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
               @if (field.type === 'select') {
                 <select [id]="field.id" [(ngModel)]="catalog[field.key]" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 appearance-none">
                    @for (opt of field.options; track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                 </select>
               } @else if (field.type === 'toggle') {
                 <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between h-[52px]">
                   <span class="text-[10px] font-black uppercase">{{ field.label }}</span>
                   <button (click)="catalog[field.key] = !catalog[field.key]" 
                           [class]="catalog[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                           class="w-8 h-4 rounded-full relative transition-all">
                     <div [class]="catalog[field.key] ? 'translate-x-4' : 'translate-x-1'" class="absolute -top-1 w-3 h-3 rounded-full bg-white transition-transform shadow-sm"></div>
                   </button>
                 </div>
               } @else {
                 <input [id]="field.id" [type]="field.type" [(ngModel)]="catalog[field.key]" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
               }
             </div>
           }
        </div>
      </section>

      <!-- Mapping -->
      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Product Attributes Mapping</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
           @for (field of mapFields; track field.id) {
             <div class="space-y-2">
               <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
               <input [id]="field.id" type="text" [(ngModel)]="catalog[field.key]" 
                      class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
             </div>
           }
        </div>
      </section>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-4">
        <button (click)="reset()" class="py-5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
          Reset
        </button>
        <button (click)="forceSync()" class="py-5 bg-zinc-900 dark:bg-zinc-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
          <mat-icon class="text-sm">sync</mat-icon>
          Force Re-Sync
        </button>
      </div>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Catalog Settings
      </button>
    </div>
  `,
  styles: [`:host { display: block; } select { -webkit-appearance: none; }`]
})
export class CatalogSettings implements OnInit {
  location = inject(Location);
  private storage = inject(StorageService);
  private platformId = inject(PLATFORM_ID);
  feedUrl = 'https://iyabd.com/api/v1/meta-catalog-feed';

  catalog: Record<string, string | boolean> = {
    enabled: true,
    catalogId: '',
    refreshSchedule: 'Every Hour',
    autoSync: true,
    condition: 'new',
    availability: 'in stock',
    urlBase: 'https://iyabd.com/product/',
    imageField: 'featured_image',
    brand: 'IYABD SHOP',
    googleCategory: 'Apparel & Accessories',
    fbCategory: 'Clothing'
  };

  syncFields = [
    { id: 'c_id', label: 'Meta Catalog ID', key: 'catalogId', type: 'text' },
    { id: 'c_sched', label: 'Refresh Schedule', key: 'refreshSchedule', type: 'select', options: ['Every Hour', 'Every 6 Hours', 'Daily', 'Weekly'] },
    { id: 'c_auto', label: 'Auto Sync on Update', key: 'autoSync', type: 'toggle' },
    { id: 'c_cond', label: 'Default Condition', key: 'condition', type: 'select', options: ['new', 'refurbished', 'used'] },
    { id: 'c_avail', label: 'Default Availability', key: 'availability', type: 'select', options: ['in stock', 'out of stock', 'preorder'] },
  ];

  mapFields = [
    { id: 'm_base', label: 'Product URL Base', key: 'urlBase' },
    { id: 'm_img', label: 'Image URL Field', key: 'imageField' },
    { id: 'm_brand', label: 'Brand Name', key: 'brand' },
    { id: 'm_gcat', label: 'Google Product Category', key: 'googleCategory' },
    { id: 'm_fcat', label: 'Facebook Product Category', key: 'fbCategory' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_catalog', JSON.stringify(this.catalog));
    alert('FB Catalog settings saved to local storage!');
  }

  load() {
    const data = this.storage.getItem('iyabd_catalog');
    if (data) {
      this.catalog = { ...this.catalog, ...JSON.parse(data) };
    }
  }

  reset() {
    if(confirm('Reset all catalog mapping to defaults?')) {
      this.storage.removeItem('iyabd_catalog');
      if (isPlatformBrowser(this.platformId)) {
        window.location.reload();
      }
    }
  }

  copyUrl() {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(this.feedUrl).then(() => {
        alert('Catalog Feed URL copied to clipboard!');
      });
    }
  }

  forceSync() {
    alert('Initiating forced catalog sync... (Simulation)');
    setTimeout(() => alert('Syncing 482 products to Meta Catalog ' + (this.catalog['catalogId'] || '[Global]') + '... Complete!'), 2000);
  }
}

