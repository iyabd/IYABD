import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BannerService, Banner } from '../../../services/banner';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-heading font-black tracking-tight">Banner / Slider</h1>
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ banners().length }} banners active</p>
          </div>
        </div>
        <button (click)="openAddModal()" aria-label="Add Banner" class="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
          <mat-icon>add</mat-icon>
        </button>
      </header>

      <div class="grid grid-cols-1 gap-6">
        @for (banner of banners(); track banner.id) {
          <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row group">
            <div class="md:w-64 aspect-[3/1] md:aspect-square relative overflow-hidden bg-slate-50 dark:bg-zinc-800">
              <img [src]="banner.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Banner">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            
            <div class="flex-1 p-8 space-y-6 flex flex-col justify-between">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="space-y-1">
                  <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{{ banner.subtitle }}</span>
                  <h3 class="text-2xl font-heading font-black tracking-tighter uppercase text-slate-900 dark:text-white leading-tight">{{ banner.title }}</h3>
                  <p class="text-xs font-bold text-slate-400">Order: {{ banner.order }} • Link: <span class="break-all">{{ banner.link }}</span></p>
                </div>
                <div class="flex items-center gap-3">
                   <div class="flex flex-col items-center gap-1">
                        <button (click)="bannerService.toggleActive(banner.id)" 
                                class="w-10 h-6 rounded-full relative transition-all shadow-inner"
                                [class]="banner.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-zinc-700'">
                          <div class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md"
                               [class]="banner.active ? 'right-1' : 'left-1'"></div>
                        </button>
                        <span class="text-[8px] font-black uppercase tracking-tighter text-slate-400">{{ banner.active ? 'On' : 'Off' }}</span>
                   </div>
                   <button (click)="openEditModal(banner)" class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                     <mat-icon class="text-lg">edit</mat-icon>
                   </button>
                   <button (click)="deleteBanner(banner.id)" class="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                     <mat-icon class="text-lg">delete_outline</mat-icon>
                   </button>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                 <div class="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-primary shadow-sm">
                    <mat-icon class="text-sm">link</mat-icon>
                 </div>
                 <div class="flex-1">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Button Action</p>
                    <p class="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-relaxed">{{ banner.buttonText }}</p>
                 </div>
              </div>
            </div>
          </div>
        } @empty {
           <div class="py-24 text-center space-y-6">
              <div class="w-20 h-20 bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100 dark:border-zinc-800">
                 <mat-icon class="text-4xl">view_carousel</mat-icon>
              </div>
              <div class="space-y-1">
                 <p class="text-slate-500 font-black text-lg">No Live Banners</p>
                 <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Create attention-grabbing sliders for your store.</p>
              </div>
           </div>
        }
      </div>

      <!-- Add/Edit Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 shadow-2xl scale-in-95 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-tight">
                   {{ editingId ? 'Update Banner' : 'New Hero Banner' }}
                </h3>
                <button (click)="showModal.set(false)" class="text-slate-400 hover:text-slate-600 transition-colors">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="bannerTitle" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Title</label>
                  <input id="bannerTitle" type="text" [(ngModel)]="formData.title" placeholder="e.g. Summer Sale" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="space-y-1">
                  <label for="bannerSubtitle" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Subtitle</label>
                  <input id="bannerSubtitle" type="text" [(ngModel)]="formData.subtitle" placeholder="e.g. Up to 50% Off" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="col-span-1 md:col-span-2 space-y-1">
                  <label for="bannerImage" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Image URL</label>
                  <input id="bannerImage" type="text" [(ngModel)]="formData.image" placeholder="http://..." 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="space-y-1">
                  <label for="bannerBtnText" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Button Text</label>
                  <input id="bannerBtnText" type="text" [(ngModel)]="formData.buttonText" placeholder="Shop Now" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="space-y-1">
                  <label for="bannerLink" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Link URL</label>
                  <input id="bannerLink" type="text" [(ngModel)]="formData.link" placeholder="/products" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="space-y-1">
                  <label for="bannerOrder" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Sort Order</label>
                  <input id="bannerOrder" type="number" [(ngModel)]="formData.order"
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                </div>
                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl">
                  <span class="text-[10px] font-black uppercase text-slate-500">Active</span>
                   <button type="button" (click)="formData.active = !formData.active"
                          [class]="formData.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-10 h-6 rounded-full relative transition-all">
                    <div [class]="formData.active ? 'translate-x-5' : 'translate-x-1'"
                         class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                  </button>
                </div>
              </div>

              <button (click)="onSubmit()" class="w-full py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                {{ editingId ? 'Update Banner' : 'Create Banner' }}
              </button>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Banners {
  location = inject(Location);
  bannerService = inject(BannerService);

  banners = this.bannerService.getBanners();
  showModal = signal(false);
  editingId: number | null = null;
  formData = { title: '', subtitle: '', image: '', link: '', buttonText: 'Shop Now', active: true, order: 0 };

  openAddModal() {
    this.editingId = null;
    this.formData = { title: '', subtitle: '', image: '', link: '', buttonText: 'Shop Now', active: true, order: 0 };
    this.showModal.set(true);
  }

  openEditModal(banner: Banner) {
    this.editingId = banner.id;
    this.formData = { ...banner };
    this.showModal.set(true);
  }

  deleteBanner(id: number) {
    if (confirm('Delete this banner from the slider?')) {
      this.bannerService.deleteBanner(id);
    }
  }

  onSubmit() {
    if (!this.formData.title || !this.formData.image) {
      alert('Title and Image URL are required.');
      return;
    }

    if (this.editingId) {
      this.bannerService.saveBanner({ ...this.formData, id: this.editingId } as Banner);
    } else {
      this.bannerService.saveBanner(this.formData as Banner);
    }

    this.showModal.set(false);
  }
}
