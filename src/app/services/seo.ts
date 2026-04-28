import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ConfigService } from './config';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private configService = inject(ConfigService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  updateMeta(data: { title?: string; description?: string; image?: string; keywords?: string }) {
    const config = this.configService.config();
    const siteTitle = data.title ? `${data.title} | ${config.companyName}` : config.seoTitle || config.companyName;
    const description = data.description || config.seoDescription;
    const image = data.image || config.seoImage;
    const keywords = data.keywords || config.seoKeywords;

    this.title.setTitle(siteTitle);
    
    // Standard Meta
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: siteTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // WhatsApp/Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: siteTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Google Verification
    if (config.googleVerification) {
        this.meta.updateTag({ name: 'google-site-verification', content: config.googleVerification });
    }
  }

  // Generate JSON-LD Schema
  generateSchema(type: 'Product' | 'Store', data: Partial<Product> | Record<string, unknown>) {
    if (!isPlatformBrowser(this.platformId)) return;

    const config = this.configService.config();
    let schema: Record<string, unknown> = {};

    if (type === 'Product') {
      const d = data as Partial<Product>;
      schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": d.name,
        "image": d.images,
        "description": d.shortDescription,
        "sku": d.sku,
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "BDT",
          "price": d.salePrice || d.regularPrice,
          "availability": (d.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      };
    } else {
      schema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": config.companyName,
        "image": config.logo,
        "@id": "",
        "url": window.location.origin,
        "telephone": config.whatsapp,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": config.address,
          "addressLocality": "Dhaka",
          "addressRegion": "Dhaka",
          "postalCode": "1000",
          "addressCountry": "BD"
        }
      };
    }

    const script = this.document.getElementById('json-ld-schema') || this.document.createElement('script');
    script.id = 'json-ld-schema';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(schema);
    if (!this.document.getElementById('json-ld-schema')) {
        this.document.head.appendChild(script);
    }
  }
}
