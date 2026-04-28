import { Injectable, signal } from '@angular/core';
import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id?: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
  active: boolean;
  featured: boolean;
  createdAt?: unknown;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  items: unknown[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  transactionId?: string;
  createdAt?: unknown;
}

export interface Category {
  id?: string;
  name: string;
  icon: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.listenToProducts();
    this.listenToOrders();
    this.listenToCategories();
  }

  private handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
     console.error('Firestore Error:', error);
     throw new Error(JSON.stringify({ 
       error: error instanceof Error ? error.message : String(error),
       operationType,
       path 
     }));
  }

  private listenToProducts() {
    onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      this.products.set(items);
    }, (err) => this.handleFirestoreError(err, OperationType.GET, 'products'));
  }

  private listenToOrders() {
    onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      this.orders.set(items);
    }, (err) => this.handleFirestoreError(err, OperationType.GET, 'orders'));
  }

  private listenToCategories() {
    onSnapshot(collection(db, 'categories'), (snapshot) => {
      this.categories.set(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    }, (err) => this.handleFirestoreError(err, OperationType.GET, 'categories'));
  }

  async addProduct(product: Product) {
    try {
      return await addDoc(collection(db, 'products'), { ...product, createdAt: serverTimestamp() });
    } catch (err) {
      this.handleFirestoreError(err, OperationType.CREATE, 'products');
    }
    return null;
  }

  async updateProduct(id: string, product: Partial<Product>) {
    try {
      return await updateDoc(doc(db, 'products', id), product);
    } catch (err) {
      this.handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
    return null;
  }

  async deleteProduct(id: string) {
    try {
      return await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      this.handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
    return null;
  }

  async placeOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    try {
      return await addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() });
    } catch (err) {
      this.handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
    return null;
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      return await updateDoc(doc(db, 'orders', id), { status });
    } catch (err) {
      this.handleFirestoreError(err, OperationType.UPDATE, `orders/${id}`);
    }
    return null;
  }

  async getOrderById(id: string) {
     try {
       const d = await getDoc(doc(db, 'orders', id));
       return d.exists() ? { id: d.id, ...d.data() } as Order : null;
     } catch (err) {
       this.handleFirestoreError(err, OperationType.GET, `orders/${id}`);
       return null;
     }
  }
}
