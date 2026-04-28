import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage';

export interface UserRole {
  role: 'admin' | 'customer';
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STORAGE_KEY = 'iyabd_session';
  private USERS_KEY = 'iyabd_users_db';
  private storage = inject(StorageService);
  
  currentUser = signal<UserRole | null>(null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.initDatabase();
    this.loadSession();
  }

  private initDatabase() {
    const usersStr = this.storage.getItem(this.USERS_KEY);
    if (!usersStr) {
      // Seed with Admin
      const initialUsers: UserRole[] = [
        {
          role: 'admin',
          name: 'IYABD Admin',
          email: 'iyabdadmin@gmail.com',
          password: 'iyabd.admin@##060' // In a real app this would be hashed
        }
      ];
      this.storage.setItem(this.USERS_KEY, JSON.stringify(initialUsers));
    }
  }

  private loadSession() {
    const saved = this.storage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.currentUser.set(JSON.parse(saved));
      } catch {
        this.storage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  getUsers(): UserRole[] {
    const str = this.storage.getItem(this.USERS_KEY);
    return str ? JSON.parse(str) : [];
  }

  register(user: UserRole) {
    const users = this.getUsers();
    if (users.some(u => u.email === user.email)) {
      throw new Error('Email already registered');
    }
    users.push({ ...user, role: 'customer' });
    this.storage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.login(user.email, user.password!);
  }

  login(email: string, password: string) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid Gmail or Password');
    }

    const session: UserRole = { ...user };
    delete session.password;
    this.currentUser.set(session);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  logout() {
    this.currentUser.set(null);
    this.storage.removeItem(this.STORAGE_KEY);
  }

  updateProfile(data: Partial<UserRole>) {
    const current = this.currentUser();
    if (!current) return;

    const updated = { ...current, ...data };
    this.currentUser.set(updated);
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === current.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      this.storage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }
}
