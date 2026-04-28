import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../../services/config';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="text-center space-y-2">
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <mat-icon class="text-3xl">chat</mat-icon>
        </div>
        <h1 class="text-3xl font-heading font-black tracking-tight">Need Help?</h1>
        <p class="text-slate-500 text-sm">Our team is ready to assist you. Choose your preferred way to contact us.</p>
      </header>

      <div class="grid gap-4">
        <!-- WhatsApp -->
        <a [href]="'https://wa.me/' + configService.config().whatsapp" target="_blank"
           class="bg-[#25D366]/10 p-6 rounded-[2.5rem] border border-[#25D366]/20 flex items-center gap-6 group hover:bg-[#25D366]/20 transition-all">
          <div class="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/20">
            <mat-icon class="text-3xl">WhatsApp</mat-icon>
          </div>
          <div class="flex-1">
             <h3 class="text-lg font-black font-heading text-[#075e54]">Chat on WhatsApp</h3>
             <p class="text-[10px] uppercase font-bold tracking-widest text-[#25D366]">Available 24/7</p>
          </div>
          <mat-icon class="text-[#25D366]">open_in_new</mat-icon>
        </a>

        <!-- Call -->
        <a href="tel:01719188777" 
           class="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 flex items-center gap-6 group hover:bg-primary/10 transition-all">
          <div class="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <mat-icon class="text-3xl">phone</mat-icon>
          </div>
          <div class="flex-1">
             <h3 class="text-lg font-black font-heading text-slate-800 dark:text-white">Emergency Call</h3>
             <p class="text-[10px] uppercase font-bold tracking-widest text-primary">Customer Care</p>
          </div>
          <mat-icon class="text-primary">call</mat-icon>
        </a>

        <!-- FAQ Sections -->
        <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-100 dark:border-zinc-800 space-y-6">
           <h3 class="font-black text-xl font-heading tracking-tight">Common Topics</h3>
           <div class="grid grid-cols-2 gap-4">
              <button class="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl text-left space-y-1">
                 <mat-icon class="text-primary">local_shipping</mat-icon>
                 <div class="text-[10px] font-black uppercase tracking-widest">Delivery Info</div>
              </button>
              <button class="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl text-left space-y-1">
                 <mat-icon class="text-primary">payments</mat-icon>
                 <div class="text-[10px] font-black uppercase tracking-widest">Payment Help</div>
              </button>
              <button class="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl text-left space-y-1">
                 <mat-icon class="text-primary">sync_alt</mat-icon>
                 <div class="text-[10px] font-black uppercase tracking-widest">Returns</div>
              </button>
              <button class="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl text-left space-y-1">
                 <mat-icon class="text-primary">confirmation_number</mat-icon>
                 <div class="text-[10px] font-black uppercase tracking-widest">Promo Codes</div>
              </button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class Messenger {
  configService = inject(ConfigService);
}
