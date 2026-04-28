import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-tag-manager',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header class="flex items-center gap-4">
        <button type="button" (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-heading font-black tracking-tight">Tag Manager & Scripts</h1>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-8">
        <div class="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl flex gap-4">
          <mat-icon class="text-amber-500">warning</mat-icon>
          <div class="space-y-1">
            <h3 class="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Developer Warning</h3>
            <p class="text-xs text-amber-700/70 dark:text-amber-300/70 leading-relaxed font-bold">Injecting custom scripts can affect site performance and security. Only paste verified tracking codes here.</p>
          </div>
        </div>

        <div class="space-y-6">
           <div class="space-y-2">
              <label for="header_scripts" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Header Scripts (&lt;head&gt;)</label>
              <textarea id="header_scripts" [(ngModel)]="headerScripts" rows="5" placeholder="<!-- Paste GTM or Meta tags here -->" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono"></textarea>
           </div>

           <div class="space-y-2">
              <label for="body_scripts" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Body Scripts (After &lt;body&gt;)</label>
              <textarea id="body_scripts" [(ngModel)]="bodyScripts" rows="5" placeholder="<!-- Paste No-Script tags here -->" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono"></textarea>
           </div>

           <div class="space-y-2">
              <label for="footer_scripts" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Footer Scripts (Before &lt;/body&gt;)</label>
              <textarea id="footer_scripts" [(ngModel)]="footerScripts" rows="5" placeholder="<!-- Paste Chat or Analytics scripts here -->" 
                        class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono"></textarea>
           </div>
        </div>

        <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 mt-6 hover:scale-[1.01] active:scale-95 transition-all">
          Deploy Scripts to Site
        </button>
      </section>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TagManager {
  location = inject(Location);
  
  headerScripts = '';
  bodyScripts = '';
  footerScripts = '';

  save() {
    alert('Custom scripts deployed successfully! Your site tracking is now active.');
  }
}
