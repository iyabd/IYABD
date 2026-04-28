import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage';

export interface Category {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  order: number;
  bannerImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private STORAGE_KEY = 'iyabd_categories';
  private categories = signal<Category[]>([]);
  private storage = inject(StorageService);

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.categories.set(JSON.parse(saved));
    } else {
      const demo: Category[] = [
        { id: 1, name: 'T-Shirt', icon: 'checkroom', active: true, order: 1 },
        { id: 2, name: 'Polo Shirt', icon: 'checkroom', active: true, order: 2 },
        { id: 3, name: 'Panjabi', icon: 'accessibility_new', active: true, order: 3 },
        { id: 4, name: 'Shirt', icon: 'dry_cleaning', active: true, order: 4 },
        { id: 5, name: 'Pants', icon: 'straighten', active: true, order: 5 },
        { id: 6, name: 'Jeans', icon: 'straighten', active: true, order: 6 },
        { id: 7, name: 'Shoes', icon: 'footprint', active: true, order: 7 },
        { id: 8, name: 'Watch', icon: 'watch', active: true, order: 8 }
      ];
      this.saveToStorage(demo);
    }
  }

  private saveToStorage(items: Category[]) {
    this.categories.set(items);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  getCategories() {
    return this.categories;
  }

  getActiveCategories() {
    return this.categories().filter(c => c.active).sort((a, b) => a.order - b.order);
  }

  saveCategory(cat: Partial<Category>) {
    const current = this.categories();
    if (cat.id) {
       const idx = current.findIndex(c => c.id === cat.id);
       if (idx !== -1) {
         current[idx] = { ...current[idx], ...cat as Category };
         this.saveToStorage([...current]);
       }
    } else {
      const newCat: Category = {
        ...cat as Category,
        id: Date.now(),
        active: cat.active ?? true,
        order: cat.order ?? current.length + 1
      };
      this.saveToStorage([...current, newCat]);
    }
  }

  deleteCategory(id: number) {
    this.saveToStorage(this.categories().filter(c => c.id !== id));
  }

  toggleActive(id: number) {
    const categories = this.categories();
    const idx = categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      categories[idx].active = !categories[idx].active;
      this.saveToStorage([...categories]);
    }
  }
}
