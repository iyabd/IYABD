import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage';
import { ProductService } from './product';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Sent to Courier' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned' 
  | 'Fraud';

export interface OrderItem {
  productId?: string;
  name: string;
  image: string;
  qty: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  mobile: string;
  email?: string;
  deliveryOption?: string;
  address: string;
  district: string;
  area: string;
  items: OrderItem[];
  total: number;
  deliveryCharge?: number;
  paymentMethod: string;
  transactionId?: string;
  note?: string;
  status: OrderStatus;
  date: string;
  courierName?: string;
  trackingId?: string;
  courierStatus?: string;
  lastUpdate?: string;
  cancelReason?: string;
  isFake?: boolean;
  isRead?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private STORAGE_KEY = 'iyabd_orders_db';
  private storage = inject(StorageService);
  
  private productService = inject(ProductService);

  private ordersSignal = signal<Order[]>([]);
  orders = computed(() => this.ordersSignal());
  
  unreadCount = computed(() => this.ordersSignal().filter(o => !o.isRead).length);

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.ordersSignal.set(JSON.parse(saved));
      } catch {
        this.ordersSignal.set([]);
      }
    }
  }

  private saveToStorage(orders: Order[]) {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    this.ordersSignal.set(orders);
  }

  markAsRead(id: string) {
    const orders = this.ordersSignal().map(o => {
      if (o.id === id) {
        return { ...o, isRead: true };
      }
      return o;
    });
    this.saveToStorage(orders);
  }

  reduceStock(items: OrderItem[]) {
    const products = this.productService.getProducts()();
    // Reduce logic for each item
    for (const item of items) {
      if (!item.productId) continue;
      const product = products.find(p => p.id === Number(item.productId));
      if (!product) continue;

      let stockChanged = false;
      const newProduct = { ...product };

      // Case 1: Variant matched by color
      if (item.color && newProduct.variants) {
         const variantIndex = newProduct.variants.findIndex(v => v.color === item.color);
         if (variantIndex > -1) {
            const variant = { ...newProduct.variants[variantIndex] };
            if (item.size && variant.sizes) {
               const sIdx = variant.sizes.findIndex(s => s.size === item.size);
               if (sIdx > -1) {
                  variant.sizes[sIdx].stock = Math.max(0, variant.sizes[sIdx].stock - item.qty);
                  stockChanged = true;
               }
            } else if (variant.stock !== undefined) {
               variant.stock = Math.max(0, variant.stock - item.qty);
               stockChanged = true;
            }
            newProduct.variants[variantIndex] = variant;
         }
      } 
      // Case 2: Size Variants (no color)
      else if (item.size && newProduct.sizeVariants) {
         const svIdx = newProduct.sizeVariants.findIndex(sv => sv.size === item.size);
         if (svIdx > -1) {
            newProduct.sizeVariants[svIdx].stock = Math.max(0, newProduct.sizeVariants[svIdx].stock - item.qty);
            stockChanged = true;
         }
      } 
      // Case 3: Simple Product (No variants)
      else if (newProduct.stock !== undefined) {
         newProduct.stock = Math.max(0, newProduct.stock - item.qty);
         stockChanged = true;
      }

      // Re-calculate Total Stock & Status
      let totalStock = 0;
      if (newProduct.variants && newProduct.variants.length > 0) {
         totalStock = newProduct.variants.reduce((sum, v) => sum + (v.sizes ? v.sizes.reduce((sSum, sz) => sSum + (sz.stock || 0), 0) : (v.stock || 0)), 0);
      } else if (newProduct.sizeVariants && newProduct.sizeVariants.length > 0) {
         totalStock = newProduct.sizeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      } else {
         totalStock = newProduct.stock || 0;
      }
      
      newProduct.stock = totalStock;
      if (newProduct.stock <= 0) {
         newProduct.status = 'Stock Out';
         newProduct.active = false;
      }

      if (stockChanged || newProduct.stock <= 0) {
         this.productService.saveProduct(newProduct);
      }
    }
  }

  placeOrder(orderData: Omit<Order, 'id' | 'status' | 'date'>): Order {
    const orders = [...this.ordersSignal()];
    const newOrder: Order = {
      ...orderData,
      id: (1000 + orders.length + 1).toString(),
      status: 'Pending',
      date: new Date().toLocaleString(),
      lastUpdate: new Date().toLocaleString(),
      isRead: false
    };
    
    orders.unshift(newOrder);
    this.saveToStorage(orders);
    return newOrder;
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.ordersSignal().filter(o => o.customerId === customerId);
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  updateOrderStatus(id: string, status: OrderStatus, courierData?: Partial<Order>) {
    const orders = this.ordersSignal().map(o => {
      if (o.id === id) {
        return { 
          ...o, 
          status, 
          ...courierData,
          lastUpdate: new Date().toLocaleString() 
        };
      }
      return o;
    });
    this.saveToStorage(orders);
  }

  deleteOrder(id: string) {
    const orders = this.ordersSignal().filter(o => o.id !== id);
    this.saveToStorage(orders);
  }
}
