import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string; // Internal cart ID (productId + size + color)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);

  totalCount = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  addToCart(item: CartItem) {
    this.items.update(items => {
      const existing = items.find(i => String(i.id) === String(item.id));
      if (existing) {
        return items.map(i => String(i.id) === String(item.id) ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
      }
      return [...items, { ...item, quantity: item.quantity || 1 }];
    });
  }

  addItem(product: Partial<CartItem> & {salePrice?: number, regularPrice?: number, images?: string[]}, size?: string, color?: string) {
    const pId = String(product.id || product.productId || '');
    this.addToCart({
      id: `${pId}-${size || 'nosize'}-${color || 'nocolor'}`,
      productId: pId,
      name: product.name || 'Unknown',
      price: product.salePrice ?? product.regularPrice ?? product.price ?? 0,
      quantity: 1,
      image: product.images?.[0] || product.image || 'https://picsum.photos/seed/p/200',
      size: size || product.size,
      color: color || product.color
    });
  }

  removeItem(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }

  updateQuantity(id: string, delta: number) {
    this.items.update(items => items.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  }

  clear() {
    this.items.set([]);
  }
}
