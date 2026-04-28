import { Injectable, signal, inject, computed } from '@angular/core';
import { StorageService } from './storage';

export interface ProductVariantSize {
  size: string;
  stock: number;
  price?: number; // Optional size-specific price
}

export interface ProductVariant {
  id: number;
  color: string; // color name
  colorCode?: string;
  images: string[];
  regularPrice: number;
  salePrice?: number;
  stock: number;
  sizes: ProductVariantSize[];
  sku?: string;
  active: boolean;
}

export interface ProductSizeVariant {
  size: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface ProductFacebookSync {
  enabled: boolean;
  status: 'not_connected' | 'pending' | 'posted' | 'failed';
  postId?: string;
  errorMessage?: string;
  lastSyncedAt?: string | null;
}

export interface ProductBadges {
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  specialOffer: boolean;
}

export interface ProductReview {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt: string;
  approved: boolean;
  variation?: string; // e.g. "Size: L"
  helpfulCount?: number;
}

export interface Product {
  id: number;
  name: string;
  images: string[];
  fbSync?: boolean;
  category: string;
  subCategory?: string;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  shortDescription: string;
  fullDescription: string;
  status: 'Active' | 'Hidden' | 'Stock Out' | 'Draft';
  size?: string;
  color?: string;
  sizes?: string[];
  sizeVariants?: ProductSizeVariant[];
  variants?: ProductVariant[];
  weight?: string;
  sku?: string;
  fabric?: string;
  gsm?: string;
  fitType?: string;
  sleeveType?: string;
  neckType?: string;
  measurementChart?: string;
  washInstruction?: string;
  origin?: string;
  gender?: string;
  pattern?: string;
  
  // Marketing & Delivery
  featured: boolean;
  newArrival: boolean;
  bestSelling: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;

  deliveryInsideDhaka?: number;
  deliveryOutsideDhaka?: number;
  estimatedDays?: string;
  cashOnDelivery?: boolean;
  
  offerProduct?: boolean;
  offerFreeDelivery?: boolean;
  minQtyForFreeDelivery?: number;
  freeDeliveryLabel?: string;
  
  offerTitle?: string;
  campaignButtonTitle?: string;
  campaignButtonLink?: string;
  offerBadgeText?: string;
  offerButtonText?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  
  badges?: ProductBadges | any;
  productBadges?: ProductBadges;
  flashSaleEnd?: string;
  coupons?: { code: string; discount: number; type: 'fixed' | 'percent' }[];
  reviews?: ProductReview[];
  sizeNote?: string;
  
  productCode?: string;
  brandName?: string;
  costPrice?: number;
  lowStockAlert?: number;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  warrantyPolicy?: string;
  returnPolicy?: string;
  careInstructions?: string;
  facebookSync?: ProductFacebookSync;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private STORAGE_KEY = 'iyabd_products_db';
  private products = signal<Product[]>([]);
  private storage = inject(StorageService);

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.products.set(JSON.parse(saved));
    } else {
      this.products.set([]);
    }
  }

  private saveToStorage(items: Product[]): boolean {
    const success = this.storage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    if (success) {
      this.products.set(items);
    }
    return success;
  }

  getProducts() {
    return this.products;
  }

  getCustomerProducts() {
    return computed(() => 
      this.products().filter(p => p.status === 'Active' || p.status === 'Stock Out')
    );
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id);
  }

  saveProduct(product: Partial<Product>): Product | null {
    const current = this.products();
    let updatedProducts: Product[];
    let savedItem: Product;

    if (product.id) {
      const idx = current.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        savedItem = { ...current[idx], ...product as Product };
        updatedProducts = [...current];
        updatedProducts[idx] = savedItem;
      } else {
        return null;
      }
    } else {
      savedItem = {
        ...product as Product,
        id: Date.now(),
        images: product.images || ['https://picsum.photos/seed/newprod/400/400'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: product.active ?? true
      };
      updatedProducts = [savedItem, ...current];
    }

    if (product.id && savedItem!) {
       savedItem.updatedAt = new Date().toISOString();
    }

    const success = this.storage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProducts));
    if (success) {
      this.products.set(updatedProducts);
      return savedItem;
    }
    return null;
  }

  deleteProduct(id: number) {
    this.saveToStorage(this.products().filter(p => p.id !== id));
  }

  toggleActive(id: number) {
    this.saveToStorage(this.products().map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  }
}
