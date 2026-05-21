import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocationService } from '../../core/services/location.service';
import { ToastService } from '../../core/services/toast.service';
import { UserProfileResponse } from '../../core/models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterOutlet],
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

          <!-- RIGHT PANEL: NESTED CONTENT OUTLET (8 Cols) -->
          <div class="lg:col-span-8">
            <router-outlet></router-outlet>
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
  public profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
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

  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.toastService.showSuccess('Logged out successfully. Have a nice day! ✨');
      // Purge jwt_token as requested by user
      localStorage.removeItem('jwt_token');
      this.router.navigate(['/']);
    });
  }
}
