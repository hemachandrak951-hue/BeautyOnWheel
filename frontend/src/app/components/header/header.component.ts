import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../core/services/location.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Location, UserProfileResponse } from '../../core/models/types';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="sticky top-0 z-50 w-full glassmorphism shadow-premium border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        <!-- Left: Logo & Location Selector -->
        <div class="flex items-center gap-6">
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer group" (click)="reloadPage()">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center text-white shadow-premium group-hover:scale-105 transition-transform duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="hidden sm:block">
              <span class="text-xl font-extrabold text-slate-800 tracking-tight">Beauty<span class="text-primary font-bold">On</span><span class="text-accent-pink font-black">Wheel</span></span>
              <p class="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Doorstep Salon</p>
            </div>
          </div>

          <!-- Hyper-Local GPS Location Dropdown -->
          <div class="relative">
            <button (click)="toggleLocationMenu()" 
                    class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200 text-left group">
              <!-- Location Icon with dynamic pulsing GPS indicator -->
              <div class="relative flex h-2 w-2 mr-0.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </div>
              <div class="max-w-[120px] sm:max-w-[180px]">
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Deliver to</p>
                <p class="text-xs sm:text-sm font-bold text-slate-700 truncate flex items-center gap-1 leading-normal">
                  {{ currentLoc.name }}
                </p>
              </div>
              <svg class="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown List -->
            <div *ngIf="showLocationDropdown" 
                 class="absolute top-14 left-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden z-50 animate-slide-up">
              <div class="p-3.5 border-b border-slate-50 bg-slate-50 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Location</span>
                <span class="text-[10px] font-semibold text-secondary flex items-center gap-1">
                  <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  GPS Enabled
                </span>
              </div>
              <div class="max-h-72 overflow-y-auto py-1">
                <button *ngFor="let loc of locations" 
                        (click)="selectLocation(loc)" 
                        [ngClass]="{'bg-indigo-50/70 text-primary font-semibold': loc.id === currentLoc.id}"
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 flex items-center justify-between transition-colors">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" [ngClass]="loc.type === 'city' ? 'text-primary' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ loc.name }}
                  </span>
                  <span *ngIf="loc.type === 'city'" class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-primary uppercase">City</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: Search Bar -->
        <div class="hidden md:flex flex-1 max-w-lg relative">
          <input type="text" 
                 [(ngModel)]="searchQuery"
                 (keyup.enter)="triggerSearch()"
                 placeholder="Search for salon, facial, massages, groom..."
                 class="w-full px-5 py-3 pl-12 rounded-2xl border border-slate-200 focus:border-primary bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-inner text-sm font-medium transition-all duration-300" />
          <svg class="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button (click)="triggerSearch()" 
                  class="absolute right-2 top-2 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-premium">
            Search
          </button>
        </div>

        <!-- Right: Auth Controls -->
        <div class="flex items-center gap-4">

          <!-- Search toggle for mobile devices -->
          <button class="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          <!-- Login CTA / User Dropdown -->
          <div class="relative" *ngIf="currentUser; else loginBtn">
            <!-- User Profile Avatar Trigger -->
            <button (click)="toggleUserMenu()" 
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-left group">
              <!-- Avatar Circle with Initial -->
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center text-white font-extrabold text-sm shadow-premium border-2 border-white">
                {{ currentUser.name.charAt(0).toUpperCase() }}
              </div>
              <div class="hidden sm:block max-w-[100px]">
                <p class="text-[10px] text-slate-400 font-semibold uppercase leading-none">Account</p>
                <p class="text-xs font-bold text-slate-700 truncate leading-normal mt-0.5">{{ currentUser.name.split(' ')[0] }}</p>
              </div>
              <svg class="w-4 h-4 text-slate-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- User Action Menu Dropdown -->
            <div *ngIf="showUserDropdown" 
                 class="absolute top-14 right-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden z-50 animate-slide-up">
              
              <!-- User Summary Info Header -->
              <div class="p-4 border-b border-slate-50 bg-slate-50/50">
                <p class="text-xs text-slate-400 font-semibold">Logged in as</p>
                <p class="text-sm font-extrabold text-slate-800 truncate mt-0.5">{{ currentUser.name }}</p>
                <p class="text-[11px] font-medium text-slate-500 truncate mt-0.5">{{ currentUser.email }}</p>
                <div class="mt-2.5 flex items-center gap-1.5">
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-primary uppercase">
                    {{ currentUser.role.replace('ROLE_', '') }}
                  </span>

                </div>
              </div>

              <!-- Menu Items List -->
              <div class="py-1">
                <button (click)="mockAction('My Active Bookings')" 
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2.5 transition-colors group">
                  <span class="text-base leading-none">📋</span>
                  <span class="font-semibold text-slate-650 group-hover:text-primary transition-colors">My Active Bookings</span>
                </button>
                
                <button (click)="mockAction('Beauty Wallet')" 
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2.5 transition-colors group">
                  <span class="text-base leading-none">💰</span>
                  <span class="font-semibold text-slate-650 group-hover:text-primary transition-colors">Beauty Wallet</span>
                </button>
                
                <button (click)="goToSuggestedProducts()" 
                        class="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2.5 transition-colors group border-t border-slate-50">
                  <span class="text-base leading-none">🛍️</span>
                  <span class="font-semibold text-slate-650 group-hover:text-primary transition-colors">Stylist Product Recommendations</span>
                </button>
              </div>

              <!-- Logout Button -->
              <div class="border-t border-slate-100 bg-slate-50 p-2">
                <button (click)="logout()" 
                        class="w-full py-2.5 px-3 rounded-xl hover:bg-rose-50 text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-2 transition-all group">
                  <span class="text-base leading-none">⨀</span>
                  <span class="font-black tracking-wide text-rose-600 group-hover:text-rose-700">Sign Out Session</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Login Button template when guest session exists -->
          <ng-template #loginBtn>
            <button (click)="triggerLogin()" 
                    class="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Login / Register
            </button>
          </ng-template>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  @Output() public openAuthModal = new EventEmitter<void>();

  public showLocationDropdown = false;
  public showUserDropdown = false;
  public locations: Location[] = [];
  public currentLoc!: Location;
  
  public currentUser: UserProfileResponse | null = null;
  public searchQuery = '';

  constructor(
    private locationService: LocationService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Set up location
    this.currentLoc = this.locationService.getSelectedLocation();
    this.locationService.selectedLocation$.subscribe(loc => {
      this.currentLoc = loc;
    });

    this.locationService.getLocations().subscribe(list => {
      this.locations = list;
    });

    // Set up authentication observer
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  public toggleLocationMenu(): void {
    this.showLocationDropdown = !this.showLocationDropdown;
    this.showUserDropdown = false;
  }

  public toggleUserMenu(): void {
    this.showUserDropdown = !this.showUserDropdown;
    this.showLocationDropdown = false;
  }

  public selectLocation(loc: Location): void {
    this.locationService.selectLocation(loc);
    this.showLocationDropdown = false;
    this.toastService.showInfo(`GPS updated: Delivering home-salon in ${loc.name}.`);
  }

  public triggerLogin(): void {
    this.openAuthModal.emit();
  }

  public logout(): void {
    this.showUserDropdown = false;
    this.authService.logout().subscribe(() => {
      this.toastService.showSuccess('Logged out successfully. Have a beautiful day!');
      // Purge jwt_token as requested by user
      localStorage.removeItem('jwt_token');
      this.router.navigate(['/']);
    });
  }


  public triggerSearch(): void {
    if (this.searchQuery.trim()) {
      this.toastService.showInfo(`Searching catalog for: "${this.searchQuery}"`);
    }
  }

  public mockAction(title: string): void {
    this.showUserDropdown = false;
    this.toastService.showInfo(`Directing to dashboard: ${title}`);
  }

  public goToSuggestedProducts(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/dashboard/suggested-products']);
    this.toastService.showSuccess('Loading personalized stylist recommendations...');
  }

  public reloadPage(): void {
    this.router.navigate(['/']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
