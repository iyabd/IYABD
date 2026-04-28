import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FacebookService } from '../../../services/facebook';
import { ConfigService } from '../../../services/config';

@Component({
  selector: 'app-facebook-updates',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Header -->
      <div class="text-center space-y-4 pt-4">
        <div class="w-20 h-20 bg-[#1877F2]/10 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-[#1877F2]/5">
           <svg class="w-10 h-10 text-[#1877F2] fill-current" viewBox="0 0 24 24">
             <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
           </svg>
        </div>
        <div class="space-y-1">
          <h1 class="text-3xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">Facebook Updates</h1>
          <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Latest from {{ config.companyName }}</p>
        </div>
        
        <a [href]="config.facebookUrl" 
           target="_blank"
           class="inline-flex items-center gap-2 bg-[#1877F2] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#1877F2]/30 hover:scale-105 active:scale-95 transition-all">
          <mat-icon class="text-sm">open_in_new</mat-icon>
          Visit Facebook Page
        </a>
      </div>

      <!-- Feed -->
      @if (fbService.loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           @for (i of [1,2,4,4]; track i) {
             <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 space-y-4 animate-pulse">
                <div class="w-full aspect-square bg-slate-100 dark:bg-zinc-800 rounded-3xl"></div>
                <div class="h-4 bg-slate-100 dark:bg-zinc-800 rounded-full w-3/4"></div>
                <div class="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-1/2"></div>
             </div>
           }
        </div>
      } @else if (fbService.posts().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           @for (post of fbService.posts(); track post.id) {
             <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 overflow-hidden group flex flex-col">
                <!-- Post Image -->
                @if (post.full_picture) {
                  <div class="relative aspect-video overflow-hidden bg-slate-100 dark:bg-zinc-800">
                     <img [src]="post.full_picture" 
                          referrerpolicy="no-referrer"
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt="Facebook Post">
                  </div>
                }

                <!-- Post Content -->
                <div class="p-8 space-y-4 flex-1 flex flex-col">
                   <div class="flex items-center justify-between">
                     <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">
                       {{ post.created_time | date:'mediumDate' }}
                     </span>
                     <div class="w-6 h-6 rounded-lg bg-[#1877F2]/10 flex items-center justify-center">
                        <svg class="w-3 h-3 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                     </div>
                   </div>
                   
                   @if (post.message) {
                     <p class="text-sm font-medium text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-4 flex-1">
                       {{ post.message }}
                     </p>
                   }

                   <a [href]="post.permalink_url" 
                      target="_blank"
                      class="pt-4 flex items-center justify-between text-[#1877F2] group/link">
                      <span class="text-[10px] font-black uppercase tracking-widest">Read More</span>
                      <mat-icon class="text-lg group-hover/link:translate-x-1 transition-transform">arrow_forward</mat-icon>
                   </a>
                </div>
             </div>
           }
        </div>
      } @else {
        <!-- Empty State / Not Connected -->
        <div class="bg-white dark:bg-zinc-900 rounded-[3rem] p-12 text-center space-y-6 soft-shadow border border-slate-50 dark:border-zinc-800">
           <div class="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mx-auto">
              <mat-icon class="text-5xl text-slate-300">dynamic_feed</mat-icon>
           </div>
           <div class="space-y-2">
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Updates loading...</h2>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                We are fetching the latest posts from our Facebook page. If they don't appear, you can visit our direct page below.
              </p>
           </div>
           <button (click)="load()" class="text-primary text-[10px] font-black uppercase tracking-widest">Try Refreshing</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; padding-bottom: 2rem; }
  `]
})
export class FacebookUpdates implements OnInit {
  fbService = inject(FacebookService);
  configService = inject(ConfigService);
  config = this.configService.config();

  ngOnInit() {
    this.load();
  }

  load() {
    this.fbService.fetchUpdates();
  }
}
