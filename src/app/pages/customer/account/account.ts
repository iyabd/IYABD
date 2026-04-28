import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order';
import { Router } from '@angular/router';

type ViewMode = 'login' | 'register' | 'dashboard';
type DashboardTab = 'overview' | 'orders' | 'tracking' | 'address' | 'wishlist' | 'payments';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class Account {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  router = inject(Router);
  
  viewMode = signal<ViewMode>('login');
  activeTab = signal<DashboardTab>('overview');
  
  showLoginPassword = signal(false);
  showRegPassword = signal(false);
  showConfirmPassword = signal(false);

  // Forms data
  loginEmail = '';
  loginPass = '';
  
  regName = '';
  regMobile = '';
  regAddress = '';
  regEmail = '';
  regPass = '';
  regConfirmPass = '';

  error = signal<string | null>(null);

  // Computed property for specific customer orders
  customerOrders = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.orderService.getOrdersByCustomer(user.email);
  });

  constructor() {
    if (this.authService.currentUser()) {
      this.viewMode.set('dashboard');
    }
  }

  toggleView(mode: ViewMode) {
    this.error.set(null);
    this.viewMode.set(mode);
  }

  onLogin() {
    this.error.set(null);
    if (!this.loginEmail.includes('@')) {
      this.error.set('Invalid Gmail or Password');
      return;
    }
    if (this.loginPass.length < 8) {
      this.error.set('Invalid Gmail or Password');
      return;
    }

    try {
      const user = this.authService.login(this.loginEmail, this.loginPass);
      if (user.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.viewMode.set('dashboard');
      }
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'Action failed');
    }
  }

  onRegister() {
    this.error.set(null);
    if (!this.regName || !this.regMobile || !this.regAddress || !this.regEmail || !this.regPass || !this.regConfirmPass) {
      this.error.set('All fields are required');
      return;
    }
    if (this.regPass.length < 8) {
      this.error.set('Password must be at least 8 characters');
      return;
    }
    if (this.regPass !== this.regConfirmPass) {
      this.error.set('Passwords do not match');
      return;
    }

    try {
      this.authService.register({
        name: this.regName,
        mobile: this.regMobile,
        address: this.regAddress,
        email: this.regEmail,
        password: this.regPass,
        role: 'customer'
      });
      this.viewMode.set('dashboard');
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'Registration failed');
    }
  }

  logout() {
    this.authService.logout();
    this.viewMode.set('login');
    this.activeTab.set('overview');
  }

  trackingId = signal('');
  trackingResult = signal<{ steps: { label: string; completed: boolean; date?: string; }[] } | null>(null);

  trackOrder() {
    if (this.trackingId()) {
      const order = this.orderService.getOrderById(this.trackingId());
      if (order) {
         this.router.navigate(['/order-tracking'], { queryParams: { id: order.id } });
      } else {
        alert('Order not found or invalid ID.');
      }
    }
  }

  viewOrderTracking(orderId: string) {
    this.router.navigate(['/order-tracking'], { queryParams: { id: orderId } });
  }

  getStatusClass(status: string) {
    if (status === 'Delivered') return 'bg-emerald-500/10 text-emerald-500';
    if (status === 'Processing') return 'bg-amber-500/10 text-amber-500';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-500';
    return 'bg-primary/10 text-primary';
  }
}
