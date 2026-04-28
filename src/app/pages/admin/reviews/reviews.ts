import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../../../services/review';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-admin-reviews',
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
            <h1 class="text-2xl font-heading font-black tracking-tight flex items-center gap-2">
              Reviews Management
            </h1>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ reviews().length }} total reviews</p>
          </div>
        </div>
      </header>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 overflow-hidden">
         <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
               <thead>
                  <tr class="bg-slate-50 dark:bg-zinc-800/50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                     <th class="p-6">Product</th>
                     <th class="p-6">Customer</th>
                     <th class="p-6">Rating</th>
                     <th class="p-6">Review</th>
                     <th class="p-6">Status</th>
                     <th class="p-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody class="text-sm font-bold divide-y divide-slate-100 dark:divide-zinc-800/50">
                  @for (review of reviews(); track review.id) {
                     <tr class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td class="p-6">
                           <div class="flex items-center gap-3">
                              <img [src]="getProductName(review.productId).img" class="w-10 h-10 rounded-xl object-cover" [alt]="getProductName(review.productId).name">
                              <span class="truncate max-w-[150px] block" [title]="getProductName(review.productId).name">{{ getProductName(review.productId).name }}</span>
                           </div>
                        </td>
                        <td class="p-6">{{ review.customerName }}</td>
                        <td class="p-6">
                           <div class="flex items-center gap-1 text-amber-400">
                              <mat-icon class="text-sm">star</mat-icon>
                              <span>{{ review.rating }}</span>
                           </div>
                        </td>
                        <td class="p-6">
                           <div class="max-w-[200px] truncate" [title]="review.text">{{ review.text }}</div>
                           @if (review.images.length) {
                             <div class="flex gap-1 mt-1">
                               @for (img of review.images; track img) {
                               <img [src]="img" alt="Review submission image" class="w-6 h-6 rounded-md object-cover">
                               }
                             </div>
                           }
                        </td>
                        <td class="p-6">
                           <span [class]="review.isApproved ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'"
                                 class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                 [class.border-emerald-200]="review.isApproved"
                                 [class.dark:border-emerald-800]="review.isApproved"
                                 [class.border-amber-200]="!review.isApproved"
                                 [class.dark:border-amber-800]="!review.isApproved">
                              {{ review.isApproved ? 'Approved' : 'Pending' }}
                           </span>
                        </td>
                        <td class="p-6 text-right">
                           <div class="flex justify-end gap-2">
                              <button (click)="reviewService.toggleApproval(review.id)"
                                      [class]="review.isApproved ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'"
                                      class="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                                      [title]="review.isApproved ? 'Reject' : 'Approve'">
                                 <mat-icon class="text-[20px]">{{ review.isApproved ? 'unpublished' : 'check_circle' }}</mat-icon>
                              </button>
                              <button (click)="deleteReview(review.id)"
                                      class="w-8 h-8 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                      title="Delete">
                                 <mat-icon class="text-[20px]">delete</mat-icon>
                              </button>
                           </div>
                        </td>
                     </tr>
                  } @empty {
                     <tr>
                        <td colspan="6" class="p-12 text-center text-slate-400 font-bold">No reviews found.</td>
                     </tr>
                  }
               </tbody>
            </table>
         </div>
      </div>
    </div>
  `
})
export class AdminReviews {
  location = inject(Location);
  reviewService = inject(ReviewService);
  productService = inject(ProductService);

  reviews = this.reviewService.getReviews();

  getProductName(productId: number) {
    const p = this.productService.getProductById(productId);
    return { name: p?.name || 'Unknown', img: p?.images?.[0] || 'https://picsum.photos/seed/pl/100/100' };
  }

  deleteReview(id: number) {
    if (confirm('Delete this review?')) {
      this.reviewService.deleteReview(id);
    }
  }
}
