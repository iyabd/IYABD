import { Injectable, signal } from '@angular/core';

export interface AppConfig {
  companyName: string;
  phone: string;
  whatsapp: string;
  bkash: string;
  nagad: string;
  rocket: string;
  address: string;
  logo: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
  // Facebook Integration
  facebookPageId?: string;
  facebookAccessToken?: string;
  facebookUrl: string;
  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoImage: string;
  googleVerification: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = signal<AppConfig>({
    companyName: 'IYABD SHOP',
    phone: '01719188777',
    whatsapp: '01719188777',
    bkash: '01671060679',
    nagad: '01671060679',
    rocket: '01671060679',
    address: 'রায়েরবাগ, হাজী ওয়াসিমুদ্দিন ভূঁইয়া রোড, ওয়ার্ড নং–৬০, ঢাকা দক্ষিণ সিটি কর্পোরেশন, ঢাকা–১২৩৬, বাংলাদেশ',
    logo: '/favicon.ico',
    deliveryChargeInside: 60,
    deliveryChargeOutside: 120,
    facebookUrl: 'https://www.facebook.com/iyabdshop',
    facebookPageId: '',
    facebookAccessToken: '',
    seoTitle: 'IYABD SHOP - Premium Lifestyle Products',
    seoDescription: 'Handcrafted leather wallets, timeless watches, and more premium lifestyle products at IYABD SHOP.',
    seoKeywords: 'wallet, watch, leather, premium, shop, bangladesh',
    seoImage: 'https://picsum.photos/seed/iyabd-seo/1200/630',
    googleVerification: ''
  });

  updateConfig(newConfig: Partial<AppConfig>) {
    this.config.update(c => ({ ...c, ...newConfig }));
  }
}
