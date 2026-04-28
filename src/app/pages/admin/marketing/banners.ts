import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banners',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Banner / Slider</h1>
        </div>
        <button (click)="isAdding.set(true)" class="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20">
          <mat-icon>add_photo_alternate</mat-icon>
        </button>
      </header>

      @if (isAdding()) {
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] soft-shadow border-2 border-primary animate-in zoom-in-95 duration-300 space-y-6">
           <h3 class="text-xl font-black font-heading tracking-tight text-center">Upload New Banner</h3>
           <div class="aspect-[21/9] rounded-3xl bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <mat-icon class="text-4xl">cloud_upload</mat-icon>
              <span class="text-[10px] font-black uppercase tracking-widest">Tap to upload banner image</span>
           </div>
            <div class="space-y-4">
              <div class="space-y-2">
                 <label for="bannerLink" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Banner Link (Optional)</label>
                 <input id="bannerLink" type="text" placeholder="https://..." class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm">
              </div>
              <div class="flex gap-3">
                 <button (click)="isAdding.set(false)" class="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                 <button (click)="isAdding.set(false)" class="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Save Banner</button>
              </div>
           </div>
        </div>
      }

      <div class="grid grid-cols-1 gap-6">
        @for (banner of banners(); track banner.id) {
          <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden soft-shadow border border-slate-50 dark:border-zinc-800/10 group">
             <div class="aspect-[21/9] bg-slate-100 relative overflow-hidden">
                <img [src]="banner.image" alt="Banner" class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                   <div class="flex-1">
                      <h3 class="text-white font-black font-heading text-lg leading-tight">{{ banner.title }}</h3>
                      <p class="text-white/70 text-[10px] font-bold uppercase tracking-widest">Order: {{ banner.order }}</p>
                   </div>
                   <div class="flex gap-2">
                      <button class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors">
                        <mat-icon class="text-lg">edit</mat-icon>
                      </button>
                      <button class="w-10 h-10 rounded-xl bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                        <mat-icon class="text-lg">delete</mat-icon>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Banners {
  location = inject(Location);
  isAdding = signal(false);
  banners = signal([
    { id: 1, title: 'Summer Collection 2024', image: 'https://picsum.photos/seed/banner1/1200/500', order: 1, active: true },
    { id: 2, title: 'Big Sale: Up to 50% Off', image: 'https://picsum.photos/seed/banner2/1200/500', order: 2, active: true },
    { id: 3, title: 'New Arrival: Premium Wallets', image: 'https://picsum.photos/seed/banner3/1200/500', order: 3, active: true },
  ]);
}
