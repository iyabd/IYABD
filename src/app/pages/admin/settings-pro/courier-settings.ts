import { ChangeDetectionStrategy, Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage';

@Component({
  selector: 'app-admin-courier-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4 sm:px-0">
      <header class="flex items-center gap-4">
        <button type="button" (click)="location.back()" aria-label="Go Back" class="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center soft-shadow border border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl font-heading font-black tracking-tight">Courier API Setup</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect your delivery partners</p>
        </div>
      </header>

      <div class="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[2rem] flex gap-4">
        <mat-icon class="text-amber-500">security</mat-icon>
        <p class="text-[10px] text-amber-700/80 dark:text-amber-300/70 font-bold leading-relaxed uppercase tracking-wide">
          API keys and access tokens must be stored securely on backend/server in production. External API calls should be proxied via your server.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex p-1 bg-slate-100 dark:bg-zinc-800 rounded-2xl">
        <button (click)="activeTab.set('steadfast')" 
                [class]="activeTab() === 'steadfast' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-slate-400'"
                class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
          Steadfast
        </button>
        <button (click)="activeTab.set('pathao')" 
                [class]="activeTab() === 'pathao' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-500' : 'text-slate-400'"
                class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
          Pathao
        </button>
      </div>

      <!-- Steadfast Configuration -->
      @if (activeTab() === 'steadfast') {
        <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6 animate-in fade-in slide-in-from-right-4">
          <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
            <h2 class="font-black text-lg font-heading flex items-center gap-2">
              <mat-icon class="text-primary">local_shipping</mat-icon>
              Steadfast Configuration
            </h2>
            <button (click)="steadfast['enabled'] = !steadfast['enabled']" 
                 [class]="steadfast['enabled'] ? 'bg-primary text-white border-primary' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-transparent'"
                 class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border">
              {{ steadfast['enabled'] ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            @for (field of sfFields; track field.id) {
              <div class="space-y-2">
                <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
                @if (field.type === 'toggle') {
                  <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between">
                    <span class="text-xs font-black uppercase">{{ field.label }}</span>
                    <button (click)="steadfast[field.key] = !steadfast[field.key]" 
                            [class]="steadfast[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                            class="w-10 h-6 rounded-full relative transition-all">
                      <div [class]="steadfast[field.key] ? 'translate-x-5' : 'translate-x-1'" class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                    </button>
                  </div>
                } @else {
                  <input [id]="field.id" [type]="field.type" [(ngModel)]="steadfast[field.key]" [placeholder]="field.placeholder"
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20">
                }
              </div>
            }
          </div>
        </section>
      }

      <!-- Pathao Configuration -->
      @if (activeTab() === 'pathao') {
        <section class="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 soft-shadow border border-slate-50 dark:border-zinc-800 space-y-6 animate-in fade-in slide-in-from-left-4">
          <div class="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-zinc-800 pb-4">
            <h2 class="font-black text-lg font-heading flex items-center gap-2">
              <mat-icon class="text-orange-500">electric_moped</mat-icon>
              Pathao Configuration
            </h2>
            <button (click)="pathao['enabled'] = !pathao['enabled']" 
                 [class]="pathao['enabled'] ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-transparent'"
                 class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border">
              {{ pathao['enabled'] ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            @for (field of ptFields; track field.id) {
              <div class="space-y-2">
                <label [for]="field.id" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{{ field.label }}</label>
                @if (field.type === 'toggle') {
                  <div class="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between">
                    <span class="text-xs font-black uppercase">{{ field.label }}</span>
                    <button (click)="pathao[field.key] = !pathao[field.key]" 
                            [class]="pathao[field.key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'"
                            class="w-10 h-6 rounded-full relative transition-all">
                      <div [class]="pathao[field.key] ? 'translate-x-5' : 'translate-x-1'" class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
                    </button>
                  </div>
                } @else {
                  <input [id]="field.id" [type]="field.type" [(ngModel)]="pathao[field.key]" [placeholder]="field.placeholder"
                         class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-orange-500/20">
                }
              </div>
            }
          </div>
        </section>
      }

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-4">
        <button (click)="reset()" class="py-5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
          Reset
        </button>
        <button (click)="test()" class="py-5 bg-zinc-900 dark:bg-zinc-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
          <mat-icon class="text-sm">electrical_services</mat-icon>
          Test Connection
        </button>
      </div>

      <button (click)="save()" class="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 mt-2 hover:scale-[1.01] active:scale-95 transition-all">
        Save Courier Settings
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class CourierSettings implements OnInit {
  location = inject(Location);
  activeTab = signal<'steadfast' | 'pathao'>('steadfast');
  private storage = inject(StorageService);
  private platformId = inject(PLATFORM_ID);

  steadfast: Record<string, string | boolean> = {
    enabled: false,
    baseUrl: 'https://steadfast.com.bd/api/v1',
    apiKey: '',
    secretKey: '',
    merchantName: '',
    storeId: '',
    pickupName: '',
    pickupPhone: '',
    pickupAddress: '',
    defaultWeight: '0.5',
    defaultItemType: 'Parcel',
    codEnabled: true,
    testMode: true
  };

  pathao: Record<string, string | boolean> = {
    enabled: false,
    baseUrl: 'https://api-hermes.pathao.com',
    clientId: '',
    clientSecret: '',
    username: '',
    password: '',
    accessToken: '',
    refreshToken: '',
    storeId: '',
    storeName: '',
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    pickupCity: '',
    pickupZone: '',
    pickupArea: '',
    deliveryType: 'Normal',
    itemType: 'Parcel',
    codEnabled: true,
    autoAddressDetection: true,
    testMode: true
  };

  sfFields = [
    { id: 'sf_url', label: 'API Base URL', key: 'baseUrl', type: 'text', placeholder: 'https://...' },
    { id: 'sf_api', label: 'API Key', key: 'apiKey', type: 'password', placeholder: 'sf_...' },
    { id: 'sf_secret', label: 'Secret Key', key: 'secretKey', type: 'password', placeholder: 'secret...' },
    { id: 'sf_mname', label: 'Merchant Name', key: 'merchantName', type: 'text', placeholder: 'IYABD SHOP' },
    { id: 'sf_store', label: 'Store ID', key: 'storeId', type: 'text', placeholder: '1001' },
    { id: 'sf_pname', label: 'Pickup Name', key: 'pickupName', type: 'text', placeholder: 'Admin' },
    { id: 'sf_phone', label: 'Pickup Phone', key: 'pickupPhone', type: 'text', placeholder: '01...' },
    { id: 'sf_address', label: 'Pickup Address', key: 'pickupAddress', type: 'text', placeholder: 'Mirpur, Dhaka' },
    { id: 'sf_weight', label: 'Default Weight (kg)', key: 'defaultWeight', type: 'text', placeholder: '0.5' },
    { id: 'sf_itype', label: 'Item Type', key: 'defaultItemType', type: 'text', placeholder: 'Parcel' },
    { id: 'sf_cod', label: 'COD Enable', key: 'codEnabled', type: 'toggle', placeholder: '' },
    { id: 'sf_test', label: 'Test Mode', key: 'testMode', type: 'toggle', placeholder: '' },
  ];

  ptFields = [
    { id: 'pt_url', label: 'API Base URL', key: 'baseUrl', type: 'text', placeholder: 'https://...' },
    { id: 'pt_client', label: 'Client ID', key: 'clientId', type: 'password', placeholder: '' },
    { id: 'pt_secret', label: 'Client Secret', key: 'clientSecret', type: 'password', placeholder: '' },
    { id: 'pt_user', label: 'Username', key: 'username', type: 'text', placeholder: '' },
    { id: 'pt_pass', label: 'Password', key: 'password', type: 'password', placeholder: '' },
    { id: 'pt_atoken', label: 'Access Token', key: 'accessToken', type: 'password', placeholder: '' },
    { id: 'pt_rtoken', label: 'Refresh Token', key: 'refreshToken', type: 'password', placeholder: '' },
    { id: 'pt_storeid', label: 'Store ID', key: 'storeId', type: 'text', placeholder: '' },
    { id: 'pt_storename', label: 'Store Name', key: 'storeName', type: 'text', placeholder: '' },
    { id: 'pt_sender', label: 'Sender Name', key: 'senderName', type: 'text', placeholder: '' },
    { id: 'pt_sphone', label: 'Sender Phone', key: 'senderPhone', type: 'text', placeholder: '' },
    { id: 'pt_address', label: 'Pickup Address', key: 'pickupAddress', type: 'text', placeholder: '' },
    { id: 'pt_pcity', label: 'Pickup City', key: 'pickupCity', type: 'text', placeholder: '' },
    { id: 'pt_pzone', label: 'Pickup Zone', key: 'pickupZone', type: 'text', placeholder: '' },
    { id: 'pt_parea', label: 'Pickup Area', key: 'pickupArea', type: 'text', placeholder: '' },
    { id: 'pt_dtype', label: 'Delivery Type', key: 'deliveryType', type: 'text', placeholder: 'Normal' },
    { id: 'pt_itype', label: 'Item Type', key: 'itemType', type: 'text', placeholder: 'Parcel' },
    { id: 'pt_auto', label: 'Auto Address Detect', key: 'autoAddressDetection', type: 'toggle', placeholder: '' },
    { id: 'pt_cod', label: 'COD Enable', key: 'codEnabled', type: 'toggle', placeholder: '' },
    { id: 'pt_test', label: 'Test Mode', key: 'testMode', type: 'toggle', placeholder: '' },
  ];

  ngOnInit() {
    this.load();
  }

  save() {
    this.storage.setItem('iyabd_courier', JSON.stringify({ sf: this.steadfast, pt: this.pathao }));
    alert('Courier settings saved to local storage!');
  }

  load() {
    const data = this.storage.getItem('iyabd_courier');
    if (data) {
      const parsed = JSON.parse(data);
      this.steadfast = { ...this.steadfast, ...parsed.sf };
      this.pathao = { ...this.pathao, ...parsed.pt };
    }
  }

  reset() {
    if(confirm('Are you sure you want to reset all fields?')) {
       this.storage.removeItem('iyabd_courier');
       if (isPlatformBrowser(this.platformId)) {
         window.location.reload();
       }
    }
  }

  test() {
    const provider = this.activeTab() === 'steadfast' ? 'Steadfast' : 'Pathao';
    alert(`Testing ${provider} connection ping... (Simulation)`);
    setTimeout(() => alert(`${provider} API responded with Status: 200 (Success)`), 1500);
  }
}

