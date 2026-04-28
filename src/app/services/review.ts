import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage';

export interface Review {
  id: number;
  productId: number;
  customerId: string;
  customerName: string;
  customerMobile?: string;
  customerEmail?: string;
  customerAddress?: string;
  rating: number;
  text: string;
  images: string[];
  isApproved: boolean;
  createdAt: string;
  variation?: string;
  helpfulCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private STORAGE_KEY = 'iyabd_reviews_db';
  private reviews = signal<Review[]>([]);
  private storage = inject(StorageService);

  constructor() {
    this.loadReviews();
  }

  private loadReviews() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.reviews.set(JSON.parse(saved));
    }
  }

  private saveToStorage(items: Review[]) {
    this.reviews.set(items);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  getReviews() {
    return this.reviews;
  }

  getProductReviews(productId: number, onlyApproved = true) {
    return this.reviews().filter(r => r.productId === productId && (!onlyApproved || r.isApproved));
  }

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isApproved: false // Admin must approve
    };
    this.saveToStorage([newReview, ...this.reviews()]);
    return newReview;
  }

  toggleApproval(id: number) {
    const updated = this.reviews().map(r => r.id === id ? { ...r, isApproved: !r.isApproved } : r);
    this.saveToStorage(updated);
  }

  deleteReview(id: number) {
    this.saveToStorage(this.reviews().filter(r => r.id !== id));
  }
}
