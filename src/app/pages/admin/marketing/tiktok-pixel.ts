import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-tiktok-pixel',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">TikTok Pixel</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect your TikTok Ads</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
          <h2 class="font-black text-lg font-heading">TikTok Ad Tracking</h2>
          <div (click)="tiktok['enabled'] = !tiktok['enabled']"
               (keyup.enter)="tiktok['enabled'] = !tiktok['enabled']"
               tabindex="0"
               [class]="tiktok['enabled'] ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'"
               class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
            {{ tiktok['enabled'] ? 'Active' : 'Inactive' }}
          </div>
        </div>

        <div class="space-y-4">
           @for (field of fields; track field.id) {
             <div class="space-y-2">
               <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
               @if (field.type === 'toggle') {
                 <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between">
                   <span class="text-[10px] font-black uppercase tracking-tight">{{ field.label }}</span>
                   <button (click)="tiktok[field.key] = !tiktok[field.key]" 
                           [class]="tiktok[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                           class="w-10 h-6 rounded-full relative transition-all">
                     <div [class]="tiktok[field.key] ? 'translate-x-5' : 'translate-x-1'" class="absolute -top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"></div>
                   </button>
                 </div>
               } @else {
                 <input [id]="field.id" [type]="field.type" [(ngModel)]="tiktok[field.key]" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
               }
             </div>
           }
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save TikTok Settings
      </button>

      <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-amber-500">info</mat-icon>
        <p class="text-[10px] text-amber-700/80 dark:text-amber-300/70 font-bold leading-relaxed uppercase tracking-wide">
          Events API helps bypass iOS tracking limitations for better conversion measurement.
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TiktokPixelSettings implements OnInit {
  location = inject(Location);
  private storage = inject(StorageService);

  tiktok: Record<string, string | boolean> = {
    enabled: false,
    pixelId: '',
    accessToken: '',
    eventsApi: true,
    testEventCode: ''
  };

  fields = [
    { id: 'tt_pixel', label: 'TikTok Pixel ID', key: 'pixelId', type: 'text' },
    { id: 'tt_token', label: 'Access Token (CAPI)', key: 'accessToken', type: 'password' },
    { id: 'tt_events', label: 'Events API ON/OFF', key: 'eventsApi', type: 'toggle' },
    { id: 'tt_test', label: 'Test Event Code', key: 'testEventCode', type: 'text' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_tiktok', JSON.stringify(this.tiktok));
    alert('TikTok Pixel settings saved! (Demo)');
  }

  load() {
    const data = this.storage.getItem('iyabd_tiktok');
    if (data) this.tiktok = { ...this.tiktok, ...JSON.parse(data) };
  }
}
