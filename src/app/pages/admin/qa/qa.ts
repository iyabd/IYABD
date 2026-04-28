import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { QaService } from '../../../services/qa';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-admin-qa',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl font-heading font-black tracking-tight">Q&A Management</h1>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Answer customer questions</p>
          </div>
        </div>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-8 soft-shadow border border-slate-50 dark:border-zinc-800">
        @if (allQuestions().length === 0) {
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <mat-icon class="text-4xl text-slate-300 dark:text-zinc-600">forum</mat-icon>
            </div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">No Questions Yet</h3>
            <p class="text-sm font-medium text-slate-500 mt-2">When customers ask questions about products, they will appear here.</p>
          </div>
        } @else {
          <div class="space-y-6">
            @for (q of allQuestions(); track q.id) {
              <div class="border border-slate-100 dark:border-zinc-800 rounded-[1.5rem] p-6 hover:shadow-md transition-shadow bg-slate-50 dark:bg-zinc-800/50">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-black text-sm">{{ q.customerName }}</span>
                      <span class="text-[10px] text-slate-400 font-bold bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700">Product: {{ getProductName(q.productId) }}</span>
                    </div>
                    <div class="text-[10px] font-bold text-slate-400">{{ q.createdAt | date:'medium' }}</div>
                  </div>
                  <button (click)="deleteQuestion(q.id)" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-colors">
                    <mat-icon class="text-sm">delete</mat-icon>
                  </button>
                </div>
                
                <p class="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 border-l-4 border-l-amber-400">
                  <span class="text-amber-500 font-black mr-2">Q:</span>{{ q.questionText }}
                </p>

                @if (q.answerText) {
                  <div class="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <div class="flex items-center gap-2 mb-2">
                       <span class="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-widest font-black">Admin Replied</span>
                       <span class="text-[10px] text-slate-400 font-bold">{{ q.answeredAt | date:'short' }}</span>
                    </div>
                    <p class="text-sm font-medium text-slate-700 dark:text-zinc-300">{{ q.answerText }}</p>
                  </div>
                } @else {
                  <div class="mt-4 flex gap-2">
                    <input type="text" #answerInput placeholder="Type your answer here..." class="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <button (click)="submitAnswer(q.id, answerInput.value); answerInput.value = ''" class="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-transform shadow-md shadow-primary/20">Reply</button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AdminQa {
  location = inject(Location);
  qaService = inject(QaService);
  productService = inject(ProductService);

  allQuestions = computed(() => {
    // Sort by unanswered first, then by date descending
    const qs = [...this.qaService.getQuestions()()];
    return qs.sort((a, b) => {
      if (!a.answerText && b.answerText) return -1;
      if (a.answerText && !b.answerText) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  getProductName(id: number) {
    const p = this.productService.getProductById(id);
    return p ? p.name : 'Unknown Product';
  }

  submitAnswer(id: number, answerText: string) {
    if (!answerText.trim()) return;
    this.qaService.answerQuestion(id, answerText);
  }

  deleteQuestion(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.qaService.deleteQuestion(id);
    }
  }
}
