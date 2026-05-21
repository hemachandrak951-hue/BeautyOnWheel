import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, DetailedCategory, ServiceItem } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- RIGHT PANEL: AMAZON-STYLE CATEGORIZED SERVICES CATALOG -->
    <div class="space-y-6">
      
      <!-- Search & Filters Container -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-premium p-5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-black text-slate-800">Browse Home Salon Categories</h2>
            <p class="text-xs text-slate-400 font-semibold mt-0.5">Choose your beauty package & per-minute labor transparent booking</p>
          </div>
          <div class="relative w-full md:w-72">
            <input type="text" 
                   [(ngModel)]="searchQuery" 
                   (input)="onSearchChange()"
                   placeholder="Search salon, facials, spa..." 
                   class="w-full px-4 py-2 pl-9 border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 rounded-xl text-xs font-semibold" />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Horizontal Tab Selectors (Amazon/Flipkart Carousel style) -->
        <div class="flex gap-2 overflow-x-auto pt-5 pb-1 no-scrollbar scroll-smooth">
          <button *ngFor="let cat of categories" 
                  (click)="selectCategory(cat.id)"
                  [ngClass]="{
                    'bg-primary text-white shadow-md border-primary': activeCategoryId === cat.id,
                    'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-slate-100': activeCategoryId !== cat.id
                  }"
                  class="px-4 py-3 rounded-2xl text-xs font-extrabold border flex-shrink-0 transition-all flex items-center gap-2">
            <img [src]="cat.imageUrl" class="w-5 h-5 rounded-lg object-cover" alt="" />
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Active Catalog Display -->
      <div *ngIf="activeCategory" class="space-y-8">
        
        <!-- Loop through Sub-categories of Active Category -->
        <div *ngFor="let sub of filteredSubCategories" class="space-y-4">
          
          <div class="flex items-center gap-3">
            <h3 class="text-sm font-black uppercase text-slate-400 tracking-widest">{{ sub.name }}</h3>
            <div class="flex-1 h-[1px] bg-slate-200"></div>
          </div>

          <!-- Services Grid (2 Cols Layout) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div *ngFor="let service of sub.services" 
                 class="bg-white rounded-3xl border border-slate-100 hover:border-primary/20 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
              
              <!-- Content area -->
              <div class="p-5 space-y-4">
                
                <!-- Card Header (Title & Rating) -->
                <div class="space-y-1">
                  <div class="flex justify-between items-start gap-4">
                    <h4 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                      {{ service.name }}
                    </h4>
                    <span class="text-xs font-bold text-amber-500 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-lg flex-shrink-0">
                      ★{{ service.rating }}
                    </span>
                  </div>
                  <p class="text-[10px] font-bold text-slate-400">
                    ⏱ {{ service.duration }} • Verified ({{ service.reviewsCount }} reviews)
                  </p>
                </div>

                <!-- Price section -->
                <div class="flex items-baseline gap-1.5">
                  <span class="text-lg font-black text-slate-800">₹{{ service.price | number:'1.0-0' }}</span>
                  <span class="text-[10px] font-bold text-slate-400">Mono-dose kit included</span>
                </div>

                <!-- Benefits checklist -->
                <ul class="space-y-1.5 pt-1">
                  <li *ngFor="let ben of service.benefits" class="text-[10px] sm:text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <span class="text-emerald-500 text-sm">✓</span>
                    <span>{{ ben }}</span>
                  </li>
                </ul>

              </div>

              <!-- Card Actions Footer -->
              <div class="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                <button (click)="addToCart(service)" 
                        class="flex-1 py-2.5 bg-white border border-slate-200 hover:border-primary text-slate-700 hover:text-primary rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1">
                  Add to Cart
                </button>
                <button (click)="bookNow(service)" 
                        class="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1">
                  Book Now
                </button>
              </div>

            </div>

          </div>

        </div>

        <!-- Empty Results Placeholder -->
        <div *ngIf="filteredSubCategories.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-premium p-8">
          <div class="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xl mx-auto mb-4">
            🔍
          </div>
          <h4 class="text-base font-extrabold text-slate-700">No Services Found</h4>
          <p class="text-xs text-slate-400 font-semibold mt-1">Try tweaking your search term for salon, facials, or massage therapies.</p>
        </div>

      </div>

    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  public categories: DetailedCategory[] = [];
  public activeCategoryId = 1;
  public activeCategory: DetailedCategory | null = null;
  public filteredSubCategories: { name: string; services: ServiceItem[] }[] = [];
  public searchQuery = '';

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getAllDetailedCategories();
    this.selectCategory(this.activeCategoryId);
  }

  public selectCategory(id: number): void {
    this.activeCategoryId = id;
    const match = this.categoryService.getDetailedCategoryById(id);
    if (match) {
      this.activeCategory = match;
      this.onSearchChange();
    }
  }

  public onSearchChange(): void {
    if (!this.activeCategory) return;

    if (!this.searchQuery.trim()) {
      this.filteredSubCategories = this.activeCategory.subCategories;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    
    this.filteredSubCategories = this.activeCategory.subCategories.map(sub => {
      const filteredServices = sub.services.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.benefits.some(b => b.toLowerCase().includes(query))
      );
      return {
        name: sub.name,
        services: filteredServices
      };
    }).filter(sub => sub.services.length > 0);
  }

  public addToCart(service: ServiceItem): void {
    const serviceItemMapped = {
      name: service.name,
      price: service.price,
      duration: service.duration,
      rating: service.rating,
      reviewsCount: service.reviewsCount,
      benefits: service.benefits,
      categoryName: this.activeCategory?.name
    };
    
    this.cartService.addToCart(serviceItemMapped);
    this.toastService.showSuccess(`Added "${service.name}" to your booking basket!`);
  }

  public bookNow(service: ServiceItem): void {
    this.addToCart(service);
    setTimeout(() => {
      const drawer = document.querySelector('app-cart-drawer');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }
}
