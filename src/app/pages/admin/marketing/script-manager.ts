import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-script-manager',
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
          <h1 class="text-2xl font-heading font-black tracking-tight">Script Manager</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inject custom code snippets</p>
        </div>
      </header>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Global Scripts</h2>
        
        <div class="space-y-4">
           @for (script of scripts; track script.id) {
             <div class="space-y-2">
               <label [for]="script.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ script.label }}</label>
               <textarea [id]="script.id" [(ngModel)]="data[script.key]" rows="4" 
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-primary/20"
                         placeholder="<!-- Enter code here -->"></textarea>
             </div>
           }
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6">
        <h2 class="font-black text-lg font-heading border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">Custom Styling</h2>
        
        <div class="space-y-2">
            <label for="custom_css" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Custom CSS</label>
            <textarea id="custom_css" [(ngModel)]="data['customCss']" rows="6" 
                      class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-primary/20"
                      placeholder="body { color: purple; }"></textarea>
        </div>
      </section>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Apply Scripts & Styles
      </button>

      <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-amber-500">warning</mat-icon>
        <p class="text-[10px] text-amber-700/80 dark:text-amber-300/70 font-bold leading-relaxed uppercase tracking-wide">
          Incorrect scripts can break your website. Use with caution.
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ScriptManagerSettings implements OnInit {
  location = inject(Location);
  private storage = inject(StorageService);

  data: Record<string, string> = {
    headerScript: '',
    bodyScript: '',
    footerScript: '',
    customCss: '',
    customJs: ''
  };

  scripts = [
    { id: 'h_script', label: 'Header Script (<head>)', key: 'headerScript' },
    { id: 'b_script', label: 'Body Script (After <body>)', key: 'bodyScript' },
    { id: 'f_script', label: 'Footer Script (Before </body>)', key: 'footerScript' },
    { id: 'js_script', label: 'Custom JS Snippet', key: 'customJs' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_scripts', JSON.stringify(this.data));
    alert('Scripts and styles applied! (Demo)');
  }

  load() {
    const data = this.storage.getItem('iyabd_scripts');
    if (data) this.data = { ...this.data, ...JSON.parse(data) };
  }
}
