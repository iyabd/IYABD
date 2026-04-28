import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage';

export interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  active: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private STORAGE_KEY = 'iyabd_banners';
  private banners = signal<Banner[]>([]);
  private storage = inject(StorageService);

  constructor() {
    this.loadBanners();
  }

  private loadBanners() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.banners.set(JSON.parse(saved));
    } else {
      const demo: Banner[] = [
        {
          id: 1,
          image: 'https://picsum.photos/seed/iyabd-banner1/1200/400',
          title: 'Premium Leather Collection',
          subtitle: 'Upgrade your style with our handcrafted wallets.',
          buttonText: 'Shop Wallets',
          link: '/category/Wallets',
          active: true,
          order: 1
        },
        {
          id: 2,
          image: 'https://picsum.photos/seed/iyabd-banner2/1200/400',
          title: 'Timeless Watches',
          subtitle: 'Elegant designs for every occasion.',
          buttonText: 'View Collection',
          link: '/category/Watches',
          active: true,
          order: 2
        }
      ];
      this.saveToStorage(demo);
    }
  }

  private saveToStorage(items: Banner[]) {
    this.banners.set(items);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  getBanners() {
    return this.banners;
  }

  getActiveBanners() {
    return this.banners().filter(b => b.active).sort((a, b) => a.order - b.order);
  }

  saveBanner(banner: Partial<Banner>) {
    const current = this.banners();
    if (banner.id) {
       const idx = current.findIndex(b => b.id === banner.id);
       if (idx !== -1) {
         current[idx] = { ...current[idx], ...banner as Banner };
         this.saveToStorage([...current]);
       }
    } else {
      const newBanner: Banner = {
        ...banner as Banner,
        id: Date.now(),
        active: banner.active ?? true,
        order: banner.order ?? current.length + 1
      };
      this.saveToStorage([...current, newBanner]);
    }
  }

  deleteBanner(id: number) {
    this.saveToStorage(this.banners().filter(b => b.id !== id));
  }

  toggleActive(id: number) {
    const banners = this.banners();
    const idx = banners.findIndex(b => b.id === id);
    if (idx !== -1) {
      banners[idx].active = !banners[idx].active;
      this.saveToStorage([...banners]);
    }
  }
}
