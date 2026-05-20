import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, DetailedCategory, ServiceItem } from '../../core/services/category.service';
import { ServiceCategory } from '../../core/models/types';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-service-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Section Header -->
      <div class="text-left mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <span class="text-xs font-black uppercase tracking-widest text-primary">Discover Services</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            Choose from Doorstep Service Sectors
          </h2>
          <p class="text-slate-500 font-medium text-sm sm:text-base mt-1">
            Choose a category to browse customized home services.
          </p>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          24/7 Home salon slots open
        </div>
      </div>

      <!-- Service Categories Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <div *ngFor="let cat of categories" 
             (click)="openCategoryDrawer(cat.id)"
             class="group cursor-pointer flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1.5">
          
          <!-- Round Icon Wrapper with background and gradient outline -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 p-1.5 bg-gradient-to-tr from-slate-100 to-slate-200 group-hover:from-primary group-hover:to-accent-pink transition-all duration-500">
            <!-- Icon Background Image with overlay -->
            <div class="w-full h-full rounded-full overflow-hidden bg-white relative">
              <img [src]="cat.imageUrl" 
                   [alt]="cat.name"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95" />
              <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
            </div>
          </div>

          <!-- Category Name with Highlight Accent -->
          <h3 class="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-primary transition-colors leading-tight tracking-wide px-1">
            {{ cat.name }}
          </h3>
          <p class="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider group-hover:text-slate-500">
            Browse Menu &rarr;
          </p>
        </div>
      </div>

      <!-- Service Sub-Category Drawer (Slide-Over Panel Overlay) -->
      <div *ngIf="isDrawerOpen && selectedCategory" 
           class="fixed inset-0 z-50 overflow-hidden animate-fade-in">
        <!-- Backdrop Backdrop Overlay -->
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
             (click)="closeDrawer()"></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <!-- Slide panel container -->
          <div class="w-screen max-w-md sm:max-w-lg bg-white shadow-premium flex flex-col h-full animate-slide-up transform duration-500">
            
            <!-- Drawer Header -->
            <div class="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
              <div>
                <span class="text-[9px] font-black uppercase tracking-widest text-primary bg-indigo-100 px-2 py-0.5 rounded-full">
                  Salon Catalog Menu
                </span>
                <h2 class="text-xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  {{ selectedCategory.name }}
                </h2>
                <p class="text-xs text-slate-500 font-medium mt-1 leading-normal">
                  {{ selectedCategory.description }}
                </p>
              </div>
              <button (click)="closeDrawer()" 
                      class="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Tabs/Sub-Categories and service list Content Area -->
            <div class="flex-1 overflow-y-auto p-6 space-y-8">
              
              <!-- Loop over Sub-categories -->
              <div *ngFor="let sub of selectedCategory.subCategories" class="space-y-4">
                <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-l-4 border-secondary pl-2">
                  {{ sub.name }}
                </h3>

                <!-- Service Items inside Sub-category -->
                <div class="space-y-4">
                  <div *ngFor="let service of sub.services" 
                       class="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/30 border border-slate-100 hover:border-primary/20 transition-all flex flex-col justify-between gap-4">
                    
                    <!-- Top section: Name, price, duration -->
                    <div class="flex justify-between items-start gap-4">
                      <div class="space-y-1">
                        <h4 class="text-sm font-extrabold text-slate-800 leading-tight">
                          {{ service.name }}
                        </h4>
                        <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <span class="flex items-center gap-0.5">
                            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ service.duration }}
                          </span>
                          <span>&bull;</span>
                          <span class="flex items-center gap-0.5 text-amber-500">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            {{ service.rating }} ({{ service.reviewsCount }})
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-black text-slate-800">₹{{ service.price }}</p>
                        <p class="text-[9px] font-semibold text-slate-400 leading-none">All inclusive</p>
                      </div>
                    </div>

                    <!-- Middle section: Benefits list -->
                    <div class="space-y-1">
                      <div *ngFor="let benefit of service.benefits" class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <svg class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {{ benefit }}
                      </div>
                    </div>

                    <!-- Bottom section: Action Add To Cart -->
                    <div class="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span class="text-[9px] font-bold text-secondary flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Hygiene Kit Guard
                      </span>
                      <button (click)="addToCart(service)" 
                              class="px-4 py-1.5 bg-white hover:bg-primary hover:text-white border border-primary text-primary font-bold text-xs rounded-xl shadow-sm transition-all duration-300 transform active:scale-95">
                        Add Service
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>

            <!-- Drawer Footer Summary -->
            <div class="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <p class="text-[9px] text-slate-400 font-semibold uppercase">Pricing Labor Guarantee</p>
                <p class="text-xs font-black text-slate-700">Strictly per-minute labor transparent check</p>
              </div>
              <button (click)="closeDrawer()" 
                      class="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs shadow-premium hover:bg-slate-900 transition-colors">
                Close Catalog
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class ServiceGridComponent implements OnInit {
  public categories: ServiceCategory[] = [];
  public selectedCategory: DetailedCategory | null = null;
  public isDrawerOpen = false;

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (list) => {
        this.categories = list;
      },
      error: (err) => {
        console.error('Error fetching categories in grid component', err);
      }
    });
  }

  public openCategoryDrawer(id: number): void {
    const detailed = this.categoryService.getDetailedCategoryById(id);
    if (detailed) {
      this.selectedCategory = detailed;
      this.isDrawerOpen = true;
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    } else {
      this.toastService.showError('Unable to load menu details for this category.');
    }
  }

  public closeDrawer(): void {
    this.isDrawerOpen = false;
    document.body.style.overflow = ''; // Unlock background scrolling
  }

  public addToCart(service: ServiceItem): void {
    this.toastService.showSuccess(`Added "${service.name}" to beauty cart!`);
  }
}
