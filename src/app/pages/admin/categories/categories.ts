import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category';

@Component({
  selector: 'app-admin-categories',
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
            <h1 class="text-2xl font-heading font-black tracking-tight">Categories</h1>
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ categories().length }} total categories</p>
          </div>
        </div>
        <button (click)="openAddModal()" aria-label="Add Category" class="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
          <mat-icon>add</mat-icon>
        </button>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (cat of categories(); track cat.id) {
          <div class="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] soft-shadow border border-slate-50 dark:border-zinc-800 flex flex-col gap-4 group">
            <div class="flex items-center justify-between">
              <div class="w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-100 dark:border-zinc-700 text-slate-600 dark:text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                @if (cat.icon.startsWith('http')) {
                  <img [src]="cat.icon" alt="Category Icon" class="w-10 h-10 rounded-xl object-cover">
                } @else {
                  <mat-icon class="text-3xl font-black">{{ cat.icon }}</mat-icon>
                }
              </div>
              <div class="flex flex-col gap-2 items-end">
                <button (click)="categoryService.toggleActive(cat.id)" 
                        class="w-10 h-6 rounded-full relative transition-all"
                        [class]="cat.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-zinc-700'">
                  <div class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md"
                       [class]="cat.active ? 'right-1' : 'left-1'"></div>
                </button>
                <span class="text-[8px] font-black uppercase tracking-tighter text-slate-400">{{ cat.active ? 'Active' : 'Inactive' }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <h3 class="font-black text-lg text-slate-900 dark:text-white">{{ cat.name }}</h3>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: #{{ cat.id }}</p>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-dashed border-slate-100 dark:border-zinc-800">
               <button (click)="openEditModal(cat)" class="flex-1 bg-slate-50 dark:bg-zinc-800 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2">
                 <mat-icon class="text-sm">edit</mat-icon> Edit
               </button>
               <button (click)="deleteCategory(cat.id)" class="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                 <mat-icon class="text-sm">delete_outline</mat-icon>
               </button>
            </div>
          </div>
        }
      </div>

      <!-- Add/Edit Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 shadow-2xl scale-in-95 overflow-y-auto max-h-[90vh]">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-tight">
                   {{ editingId ? 'Update Category' : 'Create Category' }}
                </h3>
                <button (click)="showModal.set(false)" class="text-slate-400 hover:text-slate-600 transition-colors">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label for="catName" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Category Name</label>
                    <input id="catName" type="text" [(ngModel)]="formData.name" placeholder="e.g. Polo Shirt" 
                           class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 shadow-inner">
                  </div>
                  <div class="space-y-1">
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Category Icon</div>
                    <div class="flex items-center gap-3">
                       <div class="w-14 h-14 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-zinc-700 overflow-hidden relative">
                         @if (formData.icon?.startsWith('data:image')) {
                           <img [src]="formData.icon" class="w-full h-full object-cover" alt="Icon Preview">
                         } @else if (formData.icon) {
                           <mat-icon>{{ formData.icon }}</mat-icon>
                         } @else {
                           <mat-icon class="text-slate-300">image</mat-icon>
                         }
                       </div>
                       <button (click)="iconInput.click()" class="bg-primary/10 text-primary px-4 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest">Upload</button>
                       <input type="file" #iconInput class="hidden" accept="image/*" (change)="onFileSelected($event, 'icon')">
                       <input type="text" [(ngModel)]="formData.icon" placeholder="Icon name..." class="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl p-3 text-[10px] font-black">
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-slate-50 dark:bg-zinc-800/30 rounded-3xl space-y-4 border border-slate-100 dark:border-zinc-800">
                  <h4 class="text-[10px] font-black text-primary uppercase tracking-widest pl-2">Promotion Banner</h4>
                  
                  <div class="space-y-2">
                    <div class="w-full h-32 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative group">
                       @if (formData.bannerImage) {
                         <img [src]="formData.bannerImage" class="w-full h-full object-cover" alt="Banner Preview">
                         <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button (click)="bannerInput.click()" class="bg-white text-slate-900 px-4 py-2 rounded-xl text-[8px] font-black uppercase">Change Banner</button>
                         </div>
                       } @else {
                         <button (click)="bannerInput.click()" class="flex flex-col items-center gap-1">
                            <mat-icon>add_photo_alternate</mat-icon>
                            <span class="text-[8px] font-black uppercase">Add Banner Image</span>
                         </button>
                       }
                       <input type="file" #bannerInput class="hidden" accept="image/*" (change)="onFileSelected($event, 'banner')">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label for="bannerTitle" class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-4">Banner Title</label>
                      <input id="bannerTitle" type="text" [(ngModel)]="formData.bannerTitle" placeholder="Premium Collection" 
                             class="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-4 text-[10px] font-bold focus:ring-2 focus:ring-primary/20 shadow-sm">
                    </div>
                    <div class="space-y-1">
                      <label for="bannerSub" class="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-4">Banner Subtitle</label>
                      <input id="bannerSub" type="text" [(ngModel)]="formData.bannerSubtitle" placeholder="Extra 20% Off" 
                             class="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-4 text-[10px] font-bold focus:ring-2 focus:ring-primary/20 shadow-sm">
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl">
                  <span class="text-[10px] font-black uppercase text-slate-500">Active Status</span>
                   <button type="button" (click)="formData.active = !formData.active"
                          [class]="formData.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-zinc-700'"
                          class="w-10 h-6 rounded-full relative transition-all shadow-inner">
                    <div [class]="formData.active ? 'translate-x-5' : 'translate-x-1'"
                         class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"></div>
                  </button>
                </div>
              </div>

              <button (click)="onSubmit()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                {{ editingId ? 'Save Changes' : 'Create Category' }}
              </button>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class Categories {
  location = inject(Location);
  categoryService = inject(CategoryService);

  categories = this.categoryService.getCategories();
  showModal = signal(false);
  editingId: number | null = null;
  formData: Partial<Category> = { name: '', icon: '', active: true, bannerImage: '', bannerTitle: '', bannerSubtitle: '' };
  loading = signal(false);

  private compressImage(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  }

  async onFileSelected(event: Event, type: 'icon' | 'banner') {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.loading.set(true);
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const compressed = await this.compressImage(e.target.result as string, type === 'icon' ? 200 : 1200);
          if (type === 'icon') {
            this.formData.icon = compressed;
          } else {
            this.formData.bannerImage = compressed;
          }
        }
        this.loading.set(false);
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  openAddModal() {
    this.editingId = null;
    this.formData = { name: '', icon: '', active: true, bannerImage: '', bannerTitle: '', bannerSubtitle: '' };
    this.showModal.set(true);
  }

  openEditModal(cat: Category) {
    this.editingId = cat.id;
    this.formData = { ...cat };
    this.showModal.set(true);
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category? All products under this category will remain, but the category section will be removed.')) {
      this.categoryService.deleteCategory(id);
    }
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.icon) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.editingId) {
      this.categoryService.saveCategory({ ...this.formData, id: this.editingId } as Category);
    } else {
      this.categoryService.saveCategory(this.formData as Category);
    }

    this.showModal.set(false);
  }
}
