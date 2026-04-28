import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})
export class ViewHistoryService {
  private STORAGE_KEY = 'iyabd_recently_viewed';
  private storage = inject(StorageService);
  private recentIds = signal<number[]>([]);

  constructor() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.recentIds.set(JSON.parse(saved));
    }
  }

  addProduct(id: number) {
    const current = this.recentIds();
    const updated = [id, ...current.filter(existing => existing !== id)].slice(0, 10);
    this.recentIds.set(updated);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  getRecentlyViewedIds() {
    return this.recentIds;
  }
}
