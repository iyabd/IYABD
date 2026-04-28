import { ChangeDetectionStrategy, Component, inject, signal, OnInit, PLATFORM_ID, computed, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../services/config';
import { ProductService, Product, ProductVariant } from '../../../services/product';
import { SeoService } from '../../../services/seo';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order';
import { ReviewService } from '../../../services/review';
import { QaService } from '../../../services/qa';
import { ViewHistoryService } from '../../../services/view-history';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product) {
      <div class="space-y-8 pb-32 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-0">
        
        <!-- Sticky Top Info Bar -->
        <div class="fixed top-0 left-0 right-0 z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800 p-2 transform transition-all duration-300 shadow-lg"
             [class.translate-y-0]="scrolled()" [class.-translate-y-full]="!scrolled()">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4">
             <div class="flex items-center gap-3">
                <img [src]="product.images[0]" alt="Sticky bar thumbnail" class="w-10 h-10 rounded-lg object-cover">
                <div class="hidden sm:block">
                   <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[200px]">{{ product.name }}</div>
                   <div class="text-sm font-black text-primary taka-symbol">{{ displayPrice() }}</div>
                </div>
             </div>
             <div class="flex items-center gap-2">
                <button (click)="orderNow()" class="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all">Order Now</button>
             </div>
          </div>
        </div>

        <!-- Breadcrumbs & Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a routerLink="/" class="hover:text-primary transition-colors">Home</a>
            <mat-icon class="text-[10px] w-auto h-auto">chevron_right</mat-icon>
            <a [routerLink]="['/products']" [queryParams]="{category: product.category}" class="hover:text-primary transition-colors">{{ product.category }}</a>
          </div>
          <div class="flex gap-2">
            <button (click)="share()" class="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-400 hover:text-primary transition-all">
              <mat-icon class="text-lg">share</mat-icon>
            </button>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <!-- Image Area -->
          <div class="lg:w-1/2 space-y-4">
             <div class="aspect-square bg-slate-50 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden soft-shadow border border-slate-100 dark:border-zinc-800 relative group">
               <img [src]="activeImage()" alt="Main product" loading="lazy" class="w-full h-full object-cover">
               
               <div class="absolute top-6 left-6 flex flex-col items-start gap-2 z-10">
                 @if (product.badges?.newArrival || product.newArrival) {
                   <div class="bg-indigo-500 text-white px-3 py-1 text-[8px] font-black rounded-lg shadow-lg uppercase tracking-widest">New Arrival</div>
                 }
                 @if (product.badges?.bestSeller || product.bestSelling) {
                   <div class="bg-amber-500 text-white px-3 py-1 text-[8px] font-black rounded-lg shadow-lg uppercase tracking-widest">Best Seller</div>
                 }
                 @if (product.badges?.specialOffer || product.offerProduct) {
                   <div class="bg-rose-500 text-white px-3 py-1 text-[8px] font-black rounded-lg shadow-lg uppercase tracking-widest">Special Offer</div>
                 }
                 @if (product.badges?.featured || product.featured) {
                   <div class="bg-blue-500 text-white px-3 py-1 text-[8px] font-black rounded-lg shadow-lg uppercase tracking-widest">Featured</div>
                 }
               </div>
               
               @if (product.salePrice) {
                 <div class="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-[1rem] shadow-lg shadow-red-500/20 uppercase tracking-widest z-10">
                   -{{ Math.round((1 - (product.salePrice / product.regularPrice)) * 100) }}% Off
                 </div>
               }
             </div>
             <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
               @for (img of productImages(); track img) {
                 <button (click)="activeImage.set(img)" 
                         class="w-20 h-24 sm:w-24 sm:h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all p-1 bg-white dark:bg-zinc-900 shrink-0"
                         [class]="activeImage() === img ? 'border-primary' : 'border-transparent'">
                   <img [src]="img" alt="Thumbnail" loading="lazy" class="w-full h-full object-cover rounded-xl">
                 </button>
               }
             </div>
          </div>

          <!-- Info Area -->
          <div class="lg:w-1/2 space-y-8">
             <div class="space-y-4">
               <div class="flex items-center justify-between">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-zinc-700 select-none">{{ product.category }}</div>
                 <div class="flex items-center gap-1 text-amber-400 text-xs">
                    <mat-icon class="text-sm">star</mat-icon>
                    <span class="font-bold text-slate-700 dark:text-zinc-300">{{ productRating() | number:'1.1-1' }}</span>
                    <span class="text-slate-400 ml-1">({{ approvedReviews().length }} reviews)</span>
                 </div>
               </div>
               <h1 class="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight text-slate-900 dark:text-white uppercase">{{ product.name }}</h1>
               <div class="flex items-center gap-4">
                  <div class="text-3xl font-black text-primary taka-symbol">{{ displayPrice() }}</div>
                  @if (displayDiscount() > 0) {
                    <div class="text-slate-400 font-bold line-through taka-symbol">{{ displayRegularPrice() }}</div>
                    <div class="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest animate-pulse">Save {{ displayDiscount() }}%</div>
                  }
               </div>

               @if (product.offerTitle) {
                 <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20">
                   <mat-icon class="text-sm">local_offer</mat-icon>
                   <span class="text-[10px] font-black uppercase tracking-widest">{{ product.offerTitle }}</span>
                 </div>
               }
             </div>

             <!-- Options (Size, Color, Qty) -->
             <div class="space-y-6 bg-slate-50 dark:bg-zinc-800/20 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800">
               @if (availableSizes().length > 0) {
                  <div id="size-options" class="space-y-3">
                    <div class="flex justify-between items-end">
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Choose Size</span>
                      <button (click)="showSizeChart.set(true)" class="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                         <mat-icon class="text-[14px] w-auto h-auto">straighten</mat-icon> Size Guide
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-2 text-primary">
                      @for (s of availableSizes(); track s) {
                        <button (click)="selectedSize.set(s)"
                                [disabled]="isOutOfStock(s)"
                                [class]="selectedSize() === s ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-primary/50'"
                                [class.opacity-30]="isOutOfStock(s)"
                                class="h-10 px-6 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden">
                          {{ s }}
                          @if (isOutOfStock(s)) {
                            <div class="absolute inset-0 bg-red-500/10 flex items-center justify-center -rotate-12 translate-y-1">
                              <div class="w-full h-px bg-red-500/40"></div>
                            </div>
                            <div class="absolute bottom-0 inset-x-0 text-[6px] bg-red-500 text-white font-black py-0.5">OUT</div>
                          }
                        </button>
                      }
                    </div>
                  </div>
                }

               @if (availableColors().length > 0) {
                  <div class="space-y-3">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Choose Color</span>
                    <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x">
                      @for (v of productVariants(); track v.id) {
                        <button (click)="selectVariant(v)"
                                [class]="selectedColor() === v.color ? 'border-primary ring-4 ring-primary/10 scale-105' : 'border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600'"
                                class="w-16 sm:w-20 snap-start shrink-0 aspect-[4/5] rounded-2xl border-2 transition-all p-1 bg-white dark:bg-zinc-900 overflow-hidden group">
                          <div class="w-full h-full relative rounded-xl overflow-hidden">
                            @if (v.images && v.images[0]) {
                              <img [src]="v.images[0]" [alt]="v.color" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                            } @else {
                              <div class="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-zinc-800">
                                <div class="w-6 h-6 rounded-full border border-slate-200" [style.background-color]="v.colorCode"></div>
                              </div>
                            }
                            <div class="absolute inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-sm p-1">
                              <p class="text-[6px] font-black text-white text-center uppercase truncate">{{ v.color }}</p>
                            </div>
                          </div>
                        </button>
                      }
                    </div>
                    @if (selectedColor()) {
                       <p class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Selected Color: <span class="text-primary">{{ selectedColor() }}</span></p>
                    }
                  </div>
                }

               <div class="flex items-center justify-between gap-4">
                 <div class="space-y-2">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</span>
                    <div class="flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 h-10 overflow-hidden">
                      <button (click)="updateQty(-1)" class="w-10 h-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors"><mat-icon class="text-sm">remove</mat-icon></button>
                      <span class="w-8 text-center font-black text-sm">{{ quantity() }}</span>
                      <button (click)="updateQty(1)" class="w-10 h-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors" [disabled]="quantity() >= displayStock()"><mat-icon class="text-sm">add</mat-icon></button>
                    </div>
                 </div>
                 <div [class]="displayStock() > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'" class="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border border-current opacity-70">
                   {{ displayStock() > 0 ? displayStock() + ' Items Available' : 'Out of Stock' }}
                 </div>
               </div>
             </div>
             
             <!-- Delivery & Shipping -->
             <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 soft-shadow space-y-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                    <mat-icon>local_shipping</mat-icon>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-center">
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Home Delivery</span>
                      <span class="text-[10px] font-black text-primary uppercase tracking-widest">Est. {{ product.estimatedDays || '2-4 Days' }}</span>
                    </div>
                    <div class="flex gap-4 mt-2">
                       <div class="flex flex-col">
                         <span class="text-[8px] font-black text-slate-400 uppercase">Inside Dhaka</span>
                         <span class="text-xs font-black taka-symbol">{{ product.deliveryInsideDhaka || 60 }}</span>
                       </div>
                       <div class="w-px h-6 bg-slate-100 dark:bg-zinc-800 my-auto"></div>
                       <div class="flex flex-col">
                         <span class="text-[8px] font-black text-slate-400 uppercase">Outside Dhaka</span>
                         <span class="text-xs font-black taka-symbol">{{ product.deliveryOutsideDhaka || 120 }}</span>
                       </div>
                    </div>
                  </div>
                </div>

                @if (product.cashOnDelivery) {
                  <div class="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                     <mat-icon class="text-emerald-500 text-lg">payments</mat-icon>
                     <div>
                        <span class="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Cash on Delivery Available</span>
                        <span class="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 opacity-80">Pay after receiving the parcel</span>
                     </div>
                  </div>
                }

                <div class="grid grid-cols-2 gap-3 pt-2">
                   <div class="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                     <mat-icon class="text-sm">assignment_return</mat-icon> 7 Days Return
                   </div>
                   <div class="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                     <mat-icon class="text-sm">verified_user</mat-icon> 100% Original
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="mt-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 soft-shadow overflow-hidden p-6 sm:p-10 space-y-10">
           <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div class="space-y-4">
                 <h2 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white border-l-4 border-primary pl-4">Fabric Details</h2>
                 <p class="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{{ product.fabric || 'Information about fabric quality and comfort details.' }}</p>
              </div>
              <div class="space-y-4">
                 <h2 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white border-l-4 border-slate-200 pl-4">Description</h2>
                 <p class="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{{ product.fullDescription || product.shortDescription }}</p>
              </div>
           </div>

           @if (product.sizeNote || product.washInstruction || product.sku) {
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800">
               @if (product.sku) { <div class="flex justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl"><span class="text-[10px] font-black uppercase text-slate-400">SKU</span> <span class="text-xs font-black">{{ product.sku }}</span></div> }
               @if (product.sizeNote) { <div class="flex justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl"><span class="text-[10px] font-black uppercase text-slate-400">Fit Type</span> <span class="text-xs font-black">{{ product.sizeNote }}</span></div> }
               @if (product.washInstruction) {
                 <div class="sm:col-span-2 lg:col-span-1 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                   <span class="block text-[8px] font-black uppercase tracking-widest text-blue-500 mb-1">Care Instruction</span>
                   <span class="text-xs font-black text-blue-900 dark:text-blue-200">{{ product.washInstruction }}</span>
                 </div>
               }
             </div>
           }
        </div>

        <!-- Reviews Section -->
        <div class="mt-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 soft-shadow overflow-hidden p-6 sm:p-8 space-y-8 pb-32">
          <!-- Review Summary -->
          <div class="bg-slate-50 dark:bg-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
            <div class="text-center sm:text-left">
              <div class="text-5xl font-black text-amber-500">{{ productRating() | number:'1.1-1' }} <span class="text-2xl text-slate-400">/ 5</span></div>
              <div class="flex text-amber-500 my-2 justify-center sm:justify-start">
                @for (s of [1,2,3,4,5]; track s) {
                  <mat-icon>{{ productRating() >= s ? 'star' : (productRating() >= s - 0.5 ? 'star_half' : 'star_border') }}</mat-icon>
                }
              </div>
              <div class="text-xs font-bold text-slate-500">{{ approvedReviews().length }} Ratings</div>
            </div>
            <div class="flex-1 w-full space-y-2">
               @for (s of [5,4,3,2,1]; track s) {
                 <div class="flex items-center gap-2 text-xs font-bold text-slate-500">
                   <div class="w-8 flex items-center gap-1">{{ s }} <mat-icon class="text-[10px]">star</mat-icon></div>
                   <div class="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                     <div class="h-full bg-amber-400 rounded-full" [style.width.%]="getStarPercentage(s)"></div>
                   </div>
                   <div class="w-8 text-right">{{ getStarCount(s) }}</div>
                 </div>
               }
            </div>
          </div>

          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Customer Reviews</h3>
            @if (canReview()) {
              <button (click)="openReviewForm()" class="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Write Review</button>
            }
          </div>

          <!-- Review Form Modal/Inline -->
          @if (showReviewForm()) {
            <div class="bg-slate-50 dark:bg-zinc-800 p-6 rounded-[2rem] border border-slate-200 dark:border-zinc-700 soft-shadow animate-in slide-in-from-top-4">
              <div class="flex justify-between items-center mb-6">
                <h4 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Submit Your Review</h4>
                <button (click)="showReviewForm.set(false)" class="text-slate-400 hover:text-red-500"><mat-icon>close</mat-icon></button>
              </div>
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Form fields -->
                  <div class="space-y-1">
                    <div class="text-[10px] font-bold uppercase text-slate-500">Full Name</div>
                    <input [(ngModel)]="reviewCustomerName" type="text" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/20" placeholder="John Doe">
                  </div>
                  <div class="space-y-1">
                    <div class="text-[10px] font-bold uppercase text-slate-500">Mobile Number</div>
                    <input [(ngModel)]="reviewMobile" type="tel" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/20" placeholder="01712345678">
                  </div>
                  <div class="space-y-1">
                    <div class="text-[10px] font-bold uppercase text-slate-500">Email Address (Gmail)</div>
                    <input [(ngModel)]="reviewEmail" type="email" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/20" placeholder="user@gmail.com">
                  </div>
                  <div class="space-y-1">
                    <div class="text-[10px] font-bold uppercase text-slate-500">Full Address</div>
                    <input [(ngModel)]="reviewAddress" type="text" class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/20" placeholder="123 Street, Dhaka">
                  </div>
                </div>

                <div class="space-y-2 pt-2">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Rate this product</div>
                  <div class="flex gap-2">
                    @for (star of [1,2,3,4,5]; track star) {
                      <button (click)="reviewRating.set(star)" class="transition-transform hover:scale-110">
                        <mat-icon [class]="reviewRating() >= star ? 'text-amber-400' : 'text-slate-300 dark:text-zinc-600'">star</mat-icon>
                      </button>
                    }
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-[10px] font-bold uppercase text-slate-500">Detailed Review</div>
                  <textarea [(ngModel)]="reviewText" rows="3" placeholder="Share your experience (e.g. fabric quality, fit)..." class="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-primary/20"></textarea>
                </div>
                
                <!-- Image Upload -->
                <div class="space-y-2">
                   <div class="text-[10px] font-bold uppercase text-slate-500">Upload Product Images (Max 2)</div>
                   <div class="flex gap-2 items-center">
                     @if (reviewImages().length < 2) {
                       <button (click)="fileInput.click()" class="w-20 h-20 flex flex-col items-center justify-center gap-1 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/50 transition-colors border border-dashed border-slate-300 dark:border-zinc-600 shadow-sm">
                         <mat-icon class="text-slate-400 text-lg">add_a_photo</mat-icon>
                         <span class="text-[8px] uppercase">Add Photo</span>
                       </button>
                       <input type="file" accept="image/*" class="hidden" #fileInput (change)="compressReviewImage($event); fileInput.value = ''" >
                     }
                     @for (img of reviewImages(); track img) {
                       <div class="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                          <img [src]="img" alt="Review Image" class="w-full h-full object-cover">
                          <button (click)="removeReviewImage(img)" class="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><mat-icon class="text-white text-sm">delete</mat-icon></button>
                       </div>
                     }
                   </div>
                </div>

                <button (click)="submitReview()" class="w-full bg-primary text-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-opacity-90 mt-4 transition-colors">Submit Review</button>
              </div>
            </div>
          } @else if (!canReview()) {
            <div class="text-center p-6 bg-slate-50 dark:bg-zinc-800 rounded-[2rem] border border-slate-100 dark:border-zinc-700">
               <mat-icon class="text-slate-400 text-3xl mb-2">lock</mat-icon>
               <p class="text-[10px] uppercase tracking-widest font-bold text-slate-500">Only buyers with approved purchases can review</p>
               @if (!authService.currentUser()) {
                 <button routerLink="/login" class="text-primary font-black uppercase tracking-widest text-[10px] mt-3 bg-primary/10 px-4 py-2 rounded-lg">Login to Review</button>
               }
            </div>
          }

          <!-- Review List -->
          <div class="space-y-4">
            @if (approvedReviews().length === 0) {
              <div class="text-center py-12 text-slate-400 border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl">
                <mat-icon class="text-4xl mb-2 opacity-50">speaker_notes_off</mat-icon>
                <p class="text-sm font-bold">No reviews yet for this product.</p>
              </div>
            }
            @for (review of approvedReviews(); track review.id) {
              <div class="bg-slate-50 dark:bg-zinc-800 p-6 rounded-3xl space-y-3">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-black text-sm text-slate-900 dark:text-white">{{ review.customerName }}</span>
                      <div class="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                        <mat-icon class="text-[12px] w-3 h-3 flex items-center justify-center">verified</mat-icon> Verified
                      </div>
                    </div>
                    <div class="flex text-amber-500 mb-1">
                      @for (s of [1,2,3,4,5]; track s) {
                        <mat-icon class="text-sm">{{ review.rating >= s ? 'star' : 'star_border' }}</mat-icon>
                      }
                    </div>
                    @if (review.variation) {
                      <p class="text-[10px] text-slate-400 font-bold mb-2 uppercase">{{ review.variation }}</p>
                    }
                  </div>
                  <div class="text-[10px] font-bold text-slate-400">{{ review.createdAt | date:'mediumDate' }}</div>
                </div>
                
                <p class="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed">{{ review.text }}</p>
                
                @if (review.images && review.images.length) {
                  <div class="flex gap-2 mt-3">
                    @for (img of review.images; track img) {
                      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-white cursor-pointer hover:opacity-90 transition-opacity">
                        <img [src]="img" alt="Review photo" loading="lazy" class="w-full h-full object-cover">
                      </div>
                    }
                  </div>
                }
                
                <div class="flex items-center gap-4 pt-4 mt-2">
                   <button (click)="markHelpful()" class="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                     <mat-icon class="text-sm">thumb_up</mat-icon> Helpful ({{ review.helpfulCount || 0 }})
                   </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recently Viewed -->
        @if (recentProducts().length > 0) {
          <div class="mt-12 space-y-6">
             <h2 class="text-xl font-heading font-black tracking-tight uppercase tracking-widest text-slate-400">Recently Viewed</h2>
             <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
               @for (p of recentProducts(); track p.id) {
                 <a [routerLink]="['/product', p.id]" class="w-32 shrink-0 group space-y-2">
                    <div class="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 soft-shadow">
                       <img [src]="p.images[0]" alt="Recently viewed product" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    </div>
                    <div class="text-[10px] font-black truncate uppercase">{{ p.name }}</div>
                 </a>
               }
             </div>
          </div>
        }

        <!-- Related Products Section -->
        <div class="mt-20">
             <div class="flex items-center justify-between mb-8">
               <h2 class="text-2xl font-heading font-black tracking-tight uppercase">You May Also Like</h2>
               <button routerLink="/products" class="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors">View All</button>
             </div>
             <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
               @for (p of sameCategoryProducts(); track p.id) {
                 <a [routerLink]="['/product', p.id]" class="block group space-y-3 cursor-pointer">
                    <div class="bg-white dark:bg-zinc-900 rounded-3xl aspect-[4/5] overflow-hidden soft-shadow relative">
                       <img [src]="p.images[0]" [alt]="p.name" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
                       @if (p.salePrice) {
                         <div class="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest z-10 transition-transform group-hover:-translate-y-1">
                           -{{ Math.round((1 - (p.salePrice / p.regularPrice)) * 100) }}%
                         </div>
                       }
                    </div>
                    <div>
                      <p class="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white line-clamp-1">{{ p.name }}</p>
                      <p class="text-[10px] font-black text-primary taka-symbol">{{ p.salePrice || p.regularPrice }}</p>
                    </div>
                 </a>
               }
             </div>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center py-32 space-y-4">
        <mat-icon class="text-6xl text-slate-200 dark:text-zinc-800 animate-pulse">inventory_2</mat-icon>
        <p class="text-sm font-black uppercase tracking-widest text-slate-400">Loading Product...</p>
      </div>
    }

    <!-- Size Chart Modal -->
    @if (showSizeChart()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
         <div class="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden soft-shadow animate-in zoom-in-95 duration-300 relative">
            <button (click)="showSizeChart.set(false)" class="absolute top-6 right-6 w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center z-10">
               <mat-icon>close</mat-icon>
            </button>
            <div class="p-8 space-y-6">
               <h3 class="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Size Measurement Chart</h3>
               <div class="aspect-video bg-slate-50 dark:bg-zinc-800 rounded-2xl overflow-y-auto">
                 <img [src]="product?.measurementChart || '/assets/size-chart-dummy.jpg'" alt="Size chart" class="w-full h-auto">
               </div>
               <p class="text-xs font-medium text-slate-500 leading-relaxed">* Note: All measurements are in inches. Standard fitting varies by design.</p>
               <button (click)="showSizeChart.set(false)" class="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest">Close Guide</button>
            </div>
         </div>
      </div>
    }

    <!-- Sticky Bottom Buy Bar (Action Bar) -->
    @if (product) {
      <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
         <div class="max-w-7xl mx-auto space-y-3">
            
           <!-- Action Buttons Row -->
           <div class="flex items-center gap-3">
             <!-- Dynamic Campaign/Offer Button -->
             @if (product.campaignButtonTitle) {
               <button (click)="handleCampaign(product.campaignButtonLink)" 
                  class="flex-1 bg-slate-900 dark:bg-zinc-800 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <mat-icon class="text-sm text-amber-500">local_fire_department</mat-icon>
                  {{ product.campaignButtonTitle }}
               </button>
             }

             <!-- "Buy 2 Get Free Delivery" Offer Button -->
             @if (product.offerFreeDelivery) {
               <button (click)="buyWithFreeDelivery()"
                  class="flex-1 bg-emerald-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <mat-icon class="text-sm text-white">local_offer</mat-icon>
                  Free Delivery
               </button>
             }
             
             <!-- Primary Order Now -->
             <button (click)="orderNow()" 
                     [disabled]="product.status === 'Stock Out'" 
                     class="flex-[1.5] bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:grayscale">
               <mat-icon>shopping_bag</mat-icon>
               {{ product.status === 'Stock Out' ? 'Stock Out' : 'Order Now' }}
             </button>
           </div>
         </div>
      </div>
    }
  `,
  styles: [`:host { display: block; }`]
})
export class ProductDetails implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  configService = inject(ConfigService);
  productService = inject(ProductService);
  seoService = inject(SeoService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  reviewService = inject(ReviewService);
  qaService = inject(QaService);
  viewHistoryService = inject(ViewHistoryService);
  private platformId = inject(PLATFORM_ID);
  
  product: Product | null = null;
  activeImage = signal('');
  Math = Math;
  scrolled = signal(false);
  
  isOutOfStock(size: string): boolean {
    if (!this.product) return false;
    
    // Check variant-specific sizes
    const v = this.activeVariant();
    if (v && v.sizes) {
      const sz = v.sizes.find(s => s.size === size);
      return sz ? (sz.stock || 0) <= 0 : true;
    }

    // Check base size variants
    if (this.product.sizeVariants) {
      const sv = this.product.sizeVariants.find(v => v.size === size);
      return sv ? sv.stock === 0 : false;
    }
    return false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 400);
    }
  }

  // Options State
  availableSizes = computed(() => {
    if (!this.product) return [];
    
    // Case 1: Complex Variants (Color -> Sizes)
    const v = this.activeVariant();
    if (v) {
      if (v.sizes?.length) return v.sizes.map(s => s.size);
      if ((v as any).size) return [(v as any).size]; // Legacy support
      return []; // Color selected but no sizes defined for it
    }

    // If no specific color selected but variants exist, show all unique sizes
    if (this.product.variants?.length) {
      const allSizes = this.product.variants.flatMap(v => v.sizes?.length ? v.sizes.map(s => s.size) : [(v as any).size]).filter(s => s);
      return [...new Set(allSizes)].filter(s => s);
    }

    // Case 2: Size Variants only
    if (this.product.sizeVariants?.length) return this.product.sizeVariants.map(v => v.size);
    
    // Fallbacks
    if (this.product.sizes?.length) return this.product.sizes;
    if (this.product.size) return this.product.size.split(',').map(s => s.trim()).filter(s => s);
    
    return [];
  });
  
  activeSizeVariant = computed(() => {
    if (!this.product || !this.product.sizeVariants || !this.selectedSize()) return null;
    return this.product.sizeVariants.find(sv => sv.size === this.selectedSize()) || null;
  });

  activeSizeInVariant = computed(() => {
    const v = this.activeVariant();
    const size = this.selectedSize();
    if (v && v.sizes && size) {
      return v.sizes.find(s => s.size === size) || null;
    }
    return null;
  });

  productVariants = computed(() => {
    if (!this.product || !this.product.variants) return [];
    return this.product.variants;
  });
  
  availableColors = computed(() => {
    const variants = this.productVariants();
    if (variants.length > 0) {
      return [...new Set(variants.map(v => v.color))].filter(c => c);
    }
    if (this.product && this.product.color) {
      return this.product.color.split(',').map(s => s.trim()).filter(s => s);
    }
    return [];
  });

  selectedSize = signal<string>('');
  selectedColor = signal<string>('');
  quantity = signal(1);
  inWishlist = signal(false); // In real app, persist this
  showSizeChart = signal(false);
  sameCategoryProducts = signal<Product[]>([]);
  otherCategoryProducts = signal<Product[]>([]);

  activeVariant = computed(() => {
    const variants = this.productVariants();
    const color = this.selectedColor();
    
    if (variants.length > 0 && color) {
       return variants.find(v => v.color === color) || null;
    }
    return null;
  });

  displayPrice = computed(() => {
    // 1. Size in Variant Price
    const szv = this.activeSizeInVariant();
    if (szv && szv.price) return szv.price;

    // 2. Color Variant Price
    const v = this.activeVariant();
    if (v) {
       return v.salePrice || v.regularPrice || (v as any).price;
    }

    // 3. Base Size Variant Price
    const sizeVariant = this.activeSizeVariant();
    if (sizeVariant) return sizeVariant.price;
    
    // 4. Base Product Price
    return this.product?.salePrice || this.product?.regularPrice || 0;
  });

  displayRegularPrice = computed(() => {
    const v = this.activeVariant();
    if (v) {
       if (v.regularPrice && v.salePrice) return v.regularPrice;
       return (v as any).price || this.product?.regularPrice || 0;
    }
    return this.product?.regularPrice || 0;
  });

  displayDiscount = computed(() => {
    const sale = this.displayPrice();
    const reg = this.displayRegularPrice();
    if (sale < reg) {
       return Math.round((1 - (sale / reg)) * 100);
    }
    return 0;
  });

  displayStock = computed(() => {
    const szv = this.activeSizeInVariant();
    if (szv) return szv.stock;

    const v = this.activeVariant();
    if (v) return v.stock;

    const sizeVariant = this.activeSizeVariant();
    if (sizeVariant) return sizeVariant.stock;

    return this.product?.stock || 0;
  });

  productImages = computed(() => {
    const variant = this.activeVariant();
    if (variant && variant.images && variant.images.length > 0) {
      return variant.images;
    }
    return this.product?.images || [];
  });

  // Accordion / Tabs
  tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'size-guide', label: 'Size Guide' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'returns', label: 'Returns' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'qna', label: 'Q&A' }
  ];
  activeTab = signal('details');

  // Recently Viewed
  recentProducts = computed(() => {
    const ids = this.viewHistoryService.getRecentlyViewedIds()();
    const all = this.productService.getProducts()();
    return ids.filter(id => id !== this.product?.id)
              .map(id => all.find(p => p.id === id))
              .filter(p => p) as Product[];
  });

  // Reviews State
  showReviewForm = signal(false);
  reviewCustomerName = '';
  reviewMobile = '';
  reviewEmail = '';
  reviewAddress = '';
  reviewRating = signal(5);
  reviewText = '';
  reviewImages = signal<string[]>([]);

  // Q&A State
  newQuestionText = '';
  productQuestions = computed(() => this.product ? this.qaService.getProductQuestions(this.product.id) : []);
  approvedReviews = computed(() => this.product ? this.reviewService.getProductReviews(this.product.id, true) : []);
  productRating = computed(() => {
    const revs = this.approvedReviews();
    if (!revs.length) return 5; // default 5 star display
    return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
  });

  canReview = computed(() => {
    const user = this.authService.currentUser();
    if (!user || user.role !== 'customer') return false;
    const orders = this.orderService.getOrdersByCustomer(user.email); // using email as ID
    // Check if any order contains this product
    return orders.some(o => o.items.some(item => this.product && item.name.includes(this.product.name)));
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(Number(params['id']));
      }
    });

    // Check wishlist logic if existing
    const savedWishlist = isPlatformBrowser(this.platformId) ? localStorage.getItem('iyabd_wishlist') : null;
    if (savedWishlist && this.product) {
      const list: number[] = JSON.parse(savedWishlist);
      this.inWishlist.set(list.includes(this.product.id));
    }
  }

  loadProduct(id: number) {
    const found = this.productService.getProductById(id);
    if (found && (found.status === 'Active' || found.status === 'Stock Out')) {
      this.product = found;
      this.activeImage.set(found.images[0]);
      
      // Force selection for clothing categories
      const clothCats = ['T-shirt', 'Panjabi', 'Polo Shirt', 'Cloting', 'Apparel', 'Clothing'];
      const isClothing = (clothCats.some(c => found.category?.includes(c)) || found.category === 'Men\'s Clothing' || found.category === 'Women\'s Clothing');
      
      this.selectedSize.set(isClothing ? '' : (this.availableSizes().length > 0 ? this.availableSizes()[0] : ''));
      this.selectedColor.set(this.availableColors().length > 0 ? this.availableColors()[0] : '');
      this.quantity.set(1);
      this.activeTab.set('details');
      
      this.loadRelatedProducts();
      this.viewHistoryService.addProduct(found.id);

      this.seoService.updateMeta({
        title: found.name,
        description: found.shortDescription,
        image: found.images[0]
      });
      this.seoService.generateSchema('Product', found);
      
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  selectVariant(v: ProductVariant) {
    this.selectedColor.set(v.color);
    if (v.images && v.images.length > 0) {
      this.activeImage.set(v.images[0]);
    }
    // Reset size if selected color variant doesn't have it
    const vSizes = v.sizes || [];
    if (this.selectedSize() && !vSizes.some((s: any) => s.size === this.selectedSize())) {
      this.selectedSize.set('');
    }
  }

  selectColor(c: string) {
    this.selectedColor.set(c);
    const variant = this.activeVariant();
    if (variant && variant.images && variant.images.length > 0) {
      this.activeImage.set(variant.images[0]);
    } else if (this.product && this.product.images.length > 0) {
      this.activeImage.set(this.product.images[0]);
    }
  }

  getColorCode(colorName: string): string | null {
    if (!this.product || !this.product.variants) return null;
    const variant = this.product.variants.find(v => v.color === colorName);
    return variant?.colorCode || null;
  }

  loadRelatedProducts() {
    if (!this.product) return;
    const all = this.productService.getProducts()().filter(p => p.active);
    
    // 4 from same category, exclude current
    const sameCat = all.filter(p => p.category === this.product!.category && p.id !== this.product!.id);
    this.sameCategoryProducts.set(sameCat.slice(0, 4));

    // 4 from other categories (simulating trending by using random/slice)
    const otherCat = all.filter(p => p.category !== this.product!.category);
    this.otherCategoryProducts.set(otherCat.slice(0, 4));
  }

  updateQty(delta: number) {
    if (!this.product) return;
    const current = this.quantity();
    const next = current + delta;
    if (next >= 1 && next <= this.displayStock()) {
      this.quantity.set(next);
    }
  }

  toggleWishlist() {
    this.inWishlist.set(!this.inWishlist());
    if (isPlatformBrowser(this.platformId) && this.product) {
      let list = JSON.parse(localStorage.getItem('iyabd_wishlist') || '[]');
      if (this.inWishlist()) {
        list.push(this.product.id);
      } else {
        list = list.filter((id: number) => id !== this.product!.id);
      }
      localStorage.setItem('iyabd_wishlist', JSON.stringify(list));
    }
  }

  addToCart(quiet = false) {
    if (this.product) {
      if (this.availableSizes().length > 0 && !this.selectedSize()) {
         alert('Please select size first');
         const el = document.getElementById('size-options');
         if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         return false;
      }
      if (this.availableColors().length > 0 && !this.selectedColor()) {
         alert('Please select color first');
         return false;
      }
      if (this.displayStock() < 1) {
        alert('Sorry, this product is out of stock.');
        return false;
      }
      this.cartService.addToCart({
        id: `${this.product.id}-${this.selectedSize() || 'nosize'}-${this.selectedColor() || 'nocolor'}`,
        productId: String(this.product.id),
        name: `${this.product.name}${this.selectedSize() ? ` - Size: ${this.selectedSize()}` : ''}${this.selectedColor() ? ` - Color: ${this.selectedColor()}` : ''}`,
        price: this.displayPrice(),
        image: this.productImages()[0],
        quantity: this.quantity(),
        size: this.selectedSize() || undefined,
        color: this.selectedColor() || undefined
      });
      if (!quiet) alert('Added to Cart!');
      return true;
    }
    return false;
  }

  buyNow() {
    this.orderNow();
  }

  orderNow() {
    if (this.product?.status === 'Stock Out') {
      alert('This product is currently out of stock.');
      return;
    }
    
    if (this.addToCart(true)) {
      this.router.navigate(['/checkout']);
    }
  }

  buyWithFreeDelivery() {
    if (!this.product) return;
    const minQty = this.product.minQtyForFreeDelivery || 2;
    if (this.quantity() < minQty) {
      this.quantity.set(minQty);
    }
    if (this.addToCart(true)) {
      // Option to flag it as free delivery if checkout supports it, for now just pass to checkout
      this.router.navigate(['/checkout']);
    }
  }

  handleCampaign(link?: string) {
    if (!link) return;
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      this.router.navigate([link]);
    }
  }

  orderViaWhatsApp() {
    if (!this.product) return;

    if (this.product.status === 'Stock Out') {
      alert('This product is currently out of stock.');
      return;
    }

    if (this.availableSizes().length > 0 && !this.selectedSize()) {
       alert('Please select size first');
       const el = document.getElementById('size-options');
       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
       return;
    }
    if (this.availableColors().length > 0 && !this.selectedColor()) {
       alert('Please select color');
       return;
    }

    const number = "8801719188777";
    const sizeStr = this.selectedSize() ? `\nSize: ${this.selectedSize()}` : '';
    const colorStr = this.selectedColor() ? `\nColor: ${this.selectedColor()}` : '';
    const priceStr = this.displayPrice();
    const text = `Hi, I want to order:
🛍️ Product: *${this.product.name}*
💰 Price: *${priceStr} Tk*
🔢 Qty: *${this.quantity()}*${sizeStr}${colorStr}
📍 Location:
📱 Phone:`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  share() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.product && navigator.share) {
      navigator.share({
        title: this.product.name,
        url: window.location.href
      }).catch(() => {
        // Fallback if share is canceled or fails (e.g. in iframe)
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }

  getStarCount(star: number): number {
    return this.approvedReviews().filter(r => Math.round(r.rating) === star).length;
  }

  getStarPercentage(star: number): number {
    const total = this.approvedReviews().length;
    if (total === 0) return 0;
    return (this.getStarCount(star) / total) * 100;
  }

  openReviewForm() {
    const user = this.authService.currentUser();
    if (user) {
      this.reviewCustomerName = user.name || '';
      this.reviewEmail = user.email || '';
      this.reviewMobile = user.mobile || '';
      this.reviewAddress = user.address || '';
    }
    this.showReviewForm.set(true);
  }

  compressReviewImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    if (this.reviewImages().length >= 2) {
      alert('Maximum 2 images allowed.');
      return;
    }
    
    const file = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const target = e.target as FileReader;
      if (!target?.result) return;
      const img = new Image();
      img.src = target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Compress/resize (max width 600)
        const MAX_WIDTH = 600;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        this.reviewImages.update(imgs => [...imgs, dataUrl]);
      };
    };
  }

  removeReviewImage(img: string) {
    this.reviewImages.update(imgs => imgs.filter(i => i !== img));
  }

  submitReview() {
    if (!this.reviewCustomerName || !this.reviewMobile || !this.reviewEmail || !this.reviewAddress) {
      alert('Please fill out all personal details (Name, Mobile, Email, Address).');
      return;
    }
    if (!this.reviewText.trim()) {
      alert('Please write something in your review.');
      return;
    }
    const user = this.authService.currentUser();
    if (!this.product) return;
    // Note: If testing locally or demo, we can fallback to reviewEmail as customerId
    const customerId = user ? user.email : this.reviewEmail;

    this.reviewService.addReview({
      productId: this.product.id,
      customerId: customerId,
      customerName: this.reviewCustomerName,
      customerEmail: this.reviewEmail,
      customerMobile: this.reviewMobile,
      customerAddress: this.reviewAddress,
      rating: this.reviewRating(),
      text: this.reviewText,
      images: this.reviewImages(),
      variation: `${this.selectedSize() ? this.selectedSize() : ''} ${this.selectedColor() ? this.selectedColor() : ''}`.trim()
    });

    alert('Your review has been submitted and is pending admin approval.');
    this.showReviewForm.set(false);
    this.reviewText = '';
    this.reviewImages.set([]);
    this.reviewRating.set(5);
  }

  markHelpful() {
    alert('Thank you for your feedback!');
    // In real app, call service to update helpful count and save to user state
  }

  submitQuestion() {
    if (!this.newQuestionText.trim()) {
      alert('Please write your question.');
      return;
    }
    const user = this.authService.currentUser();
    if (!user || !this.product) return;

    this.qaService.addQuestion({
      productId: this.product.id,
      customerId: user.email,
      customerName: user.name,
      questionText: this.newQuestionText
    });

    alert('Your question has been submitted! Our team will reply shortly.');
    this.newQuestionText = '';
  }
}

