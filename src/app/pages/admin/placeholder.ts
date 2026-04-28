import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-placeholder',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
       <div class="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2">
         <mat-icon class="text-4xl">construction</mat-icon>
       </div>
       <h1 class="text-2xl font-heading font-black tracking-tight">{{ title }}</h1>
       <p class="text-slate-500 max-w-sm mx-auto text-sm font-medium">This section is currently under development to match IYABD SHOP's high standards.</p>
       <button (click)="location.back()" 
               class="mt-4 bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
         Go Back
       </button>
    </div>
  `
})
export class AdminPlaceholder {
  location = inject(Location);
  route = inject(ActivatedRoute);
  title = 'Section Under Way';

  constructor() {
    const segments = this.route.snapshot.url;
    if (segments.length > 0) {
      this.title = segments[segments.length - 1].path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}
