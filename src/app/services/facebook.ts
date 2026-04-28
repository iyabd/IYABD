import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config';
import { catchError, Observable, of, tap } from 'rxjs';

export interface FacebookPost {
  id: string;
  message?: string;
  full_picture?: string;
  permalink_url: string;
  created_time: string;
  attachments?: {
    data: {
      media?: { image?: { src: string } };
      type: string;
      url: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  
  posts = signal<FacebookPost[]>([]);
  loading = signal(false);

  fetchUpdates() {
    const config = this.configService.config();
    if (!config.facebookPageId || !config.facebookAccessToken) {
      return;
    }

    this.loading.set(true);
    const url = `https://graph.facebook.com/v19.0/${config.facebookPageId}/posts?fields=id,message,full_picture,permalink_url,created_time,attachments&access_token=${config.facebookAccessToken}`;

    this.http.get<{ data: FacebookPost[] }>(url).pipe(
      tap(res => {
        this.posts.set(res.data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('Facebook Fetch Error:', err);
        this.loading.set(false);
        return of({ data: [] });
      })
    ).subscribe();
  }

  shareProduct(productData: { name: string; price: number; salePrice?: number; link: string; image: string; offerText?: string }): Observable<unknown> {
    const config = this.configService.config();
    if (!config.facebookPageId || !config.facebookAccessToken) {
      alert('Facebook Page not connected in Admin Settings.');
      return of(null);
    }

    const message = `${productData.offerText ? '🔥 ' + productData.offerText + '\n\n' : ''}✨ ${productData.name}${productData.salePrice ? '\n💸 Discount Price: ৳' + productData.salePrice : ''}\n💰 Regular Price: ৳${productData.price}\n\nShop Now: ${productData.link}`;
    
    const url = `https://graph.facebook.com/v19.0/${config.facebookPageId}/feed`;
    const body = {
      message: message,
      link: productData.link,
      access_token: config.facebookAccessToken
    };

    return this.http.post(url, body).pipe(
      tap(() => alert('Successfully shared to Facebook!')),
      catchError(err => {
        console.error('Facebook Share Error:', err);
        alert('Failed to share to Facebook. Check your Access Token permissions.');
        throw err;
      })
    );
  }
}
