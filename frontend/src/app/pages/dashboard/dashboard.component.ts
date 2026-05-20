import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocationService } from '../../core/services/location.service';
import { CategoryService, DetailedCategory, ServiceItem } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { UserProfileResponse } from '../../core/models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#FAF5F0] text-slate-800 font-sans pb-24">
      
      <!-- 1. PERSONALIZED WELCOMING HEADER TOP-BAR -->
      <header class="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <!-- Logo / Greeting -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center text-white font-extrabold shadow-md animate-pulse-slow">
              ✨
            </div>
            <div>
              <h1 class="text-sm sm:text-base font-extrabold text-slate-800">
                Welcome back, <span class="text-primary">{{ currentUser?.name }}</span>!
              </h1>
              <p class="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Location: {{ currentCity }}</span>
              </p>
            </div>
          </div>

          <!-- Quick Navigation Triggers -->
          <div class="flex items-center gap-4">
            <button (click)="logout()" 
                    class="px-4 py-2 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-500 font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center gap-1.5 focus:outline-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      <!-- 2. MAIN LAYOUT WORKSPACE -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT PANEL: USER PROFILE SUMMARY SIDEBAR (4 Cols) -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- Profile Card -->
            <div class="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 relative overflow-hidden transition-all duration-300">
              <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              
              <!-- Card Header / Avatar -->
              <div class="flex flex-col items-center pb-6 border-b border-slate-100 relative z-10">
                <div class="w-20 h-20 rounded-full border-4 border-slate-100 shadow-md bg-gradient-to-tr from-[#6C63FF]/30 to-[#EC4899]/30 flex items-center justify-center font-black text-slate-700 text-3xl mb-3">
                  {{ (currentUser?.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <h3 class="text-base font-extrabold text-slate-800">{{ currentUser?.name }}</h3>
                <span class="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 tracking-wider">
                  {{ currentUser?.role === 'ROLE_CUSTOMER' ? 'Customer Profile' : 'Professional Stylist' }}
                </span>
              </div>

              <!-- Static Details Display Mode -->
              <div *ngIf="!isEditMode" class="py-6 space-y-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span>📧</span> {{ currentUser?.email }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                  <p class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span>📱</span> +91 {{ currentUser?.phone }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</p>
                  <p class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span>🎂</span> {{ currentUser?.dateOfBirth ? (currentUser?.dateOfBirth | date:'longDate') : 'Not Specified' }}
                  </p>
                </div>
                
                <button (click)="enableEdit()" 
                        class="w-full mt-6 py-3 border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-300 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Edit Profile Information</span>
                </button>
              </div>

              <!-- Editable Reactive Form Mode -->
              <form *ngIf="isEditMode" [formGroup]="profileForm" (ngSubmit)="onProfileSave()" class="py-6 space-y-4">
                
                <!-- Edit Name -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" 
                         formControlName="name" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showFormError('name')}"
                         class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-semibold" />
                  <p *ngIf="showFormError('name')" class="text-[9px] font-bold text-rose-500">Name is required (2-100 chars).</p>
                </div>

                <!-- Edit Email -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" 
                         formControlName="email" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showFormError('email')}"
                         class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-semibold" />
                  <p *ngIf="showFormError('email')" class="text-[9px] font-bold text-rose-500">Please enter a valid email address.</p>
                </div>

                <!-- Edit Phone -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number (+91)</label>
                  <input type="text" 
                         formControlName="phone" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showFormError('phone')}"
                         class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-semibold" />
                  <p *ngIf="showFormError('phone')" class="text-[9px] font-bold text-rose-500">Phone must be 10-15 digits.</p>
                </div>

                <!-- Edit DOB -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                  <input type="date" 
                         formControlName="dateOfBirth" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showFormError('dateOfBirth')}"
                         class="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs font-bold text-slate-600" />
                  <p *ngIf="showFormError('dateOfBirth')" class="text-[9px] font-bold text-rose-500">Date of Birth must be in the past.</p>
                </div>

                <!-- Save / Cancel Actions -->
                <div class="flex gap-3 pt-4">
                  <button type="button" (click)="cancelEdit()" 
                          class="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold transition-all">
                    Cancel
                  </button>
                  <button type="submit" 
                          [disabled]="isSaving"
                          class="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5">
                    <svg *ngIf="isSaving" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isSaving ? 'Saving...' : 'Save Profile' }}</span>
                  </button>
                </div>

              </form>

            </div>

            <!-- Promotional Ribbon -->
            <div class="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl shadow-premium p-6 border border-slate-800/80 relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-accent-pink/15 rounded-full blur-xl"></div>
              <span class="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                PROMO OFFER
              </span>
              <h4 class="text-base font-extrabold text-white mt-4 tracking-tight">Luxury Spa Pedicure at ₹699</h4>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Book any Swedish Massage or HD Bridal makeup package and unlock 40% OFF pedicures this week!
              </p>
              <div class="flex items-center gap-2 mt-4 text-[10px] font-bold text-amber-300">
                <span>✓ Mono-dose Sealed Kits</span>
                <span>•</span>
                <span>✓ Verified Stylist</span>
              </div>
            </div>

          </div>

          <!-- RIGHT PANEL: AMAZON-STYLE CATEGORIZED SERVICES CATALOG (8 Cols) -->
          <div class="lg:col-span-8 space-y-6">
            
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
                <p class="text-xs text-slate-400 font-semibold mt-1">Try tweaking your search term for salon, facials, or masssage therapies.</p>
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  public currentUser: UserProfileResponse | null = null;
  public currentCity = 'Bengaluru (GPS Active)';
  public isEditMode = false;
  public isSaving = false;

  public categories: DetailedCategory[] = [];
  public activeCategoryId = 1;
  public activeCategory: DetailedCategory | null = null;
  public filteredSubCategories: { name: string; services: ServiceItem[] }[] = [];

  public searchQuery = '';
  public profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Subscribe to User Profile State
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initProfileForm(user);
      }
    });

    // 2. Subscribe to Location State
    this.locationService.selectedLocation$.subscribe(loc => {
      this.currentCity = loc.name;
    });

    // 3. Load service catalog categories
    this.categories = this.categoryService.getAllDetailedCategories();
    this.selectCategory(this.activeCategoryId);
  }

  private initProfileForm(user: UserProfileResponse): void {
    this.profileForm = this.fb.group({
      name: [user.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone, [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      dateOfBirth: [user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '', [this.dobValidator]]
    });
  }

  // DOB validation helper (must be in past or today)
  private dobValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today ? null : { invalidDob: true };
  }

  public enableEdit(): void {
    this.isEditMode = true;
  }

  public cancelEdit(): void {
    this.isEditMode = false;
    if (this.currentUser) {
      this.initProfileForm(this.currentUser); // Restore details
    }
  }

  public showFormError(field: string): boolean {
    const ctrl = this.profileForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public onProfileSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.profileForm.value;

    this.authService.updateProfile(payload).subscribe({
      next: (updatedProfile) => {
        this.isSaving = false;
        this.isEditMode = false;
        this.toastService.showSuccess('Profile updated successfully! Real-time changes synchronized.');
      },
      error: (err) => {
        this.isSaving = false;
        this.toastService.showError(err.message || 'Profile save failed.');
      }
    });
  }

  public selectCategory(id: number): void {
    this.activeCategoryId = id;
    const match = this.categoryService.getDetailedCategoryById(id);
    if (match) {
      this.activeCategory = match;
      this.onSearchChange(); // apply search queries if any exist
    }
  }

  public onSearchChange(): void {
    if (!this.activeCategory) return;

    if (!this.searchQuery.trim()) {
      this.filteredSubCategories = this.activeCategory.subCategories;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    
    // Filter services inside subcategories
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
    // Map DetailedCategory ServiceItem to Type service item structure
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
    // Smooth scroll down to cart drawer floating bar if visible
    setTimeout(() => {
      const drawer = document.querySelector('app-cart-drawer');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }

  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.toastService.showSuccess('Logged out successfully. Have a nice day! ✨');
      this.router.navigate(['/']);
    });
  }
}
