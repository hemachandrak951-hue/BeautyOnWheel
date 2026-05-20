import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none animate-fade-in">
      <!-- Background Overlay Blur -->
      <div class="absolute inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity" (click)="close()"></div>

      <!-- Modal Card Box -->
      <div class="relative w-full max-w-md mx-auto my-6 p-4 z-50">
        <div class="relative flex flex-col w-full bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden transform duration-300">
          
          <!-- Close Button -->
          <button (click)="close()" 
                  class="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-20 focus:outline-none">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Top Header / Banner Graphic -->
          <div class="p-6 pb-4 bg-gradient-to-tr from-primary to-accent-pink text-white flex flex-col justify-end h-28 relative">
            <div class="absolute inset-0 bg-hero-pattern opacity-10"></div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight leading-none">
              {{ isLoginMode ? 'Welcome Back!' : 'Create Beauty Account' }}
            </h2>
            <p class="text-xs text-indigo-50/80 mt-1.5 font-medium leading-none">
              {{ isLoginMode ? 'Sign in to access custom doorstep salon deals' : 'Register to get single-use sanitization kits' }}
            </p>
          </div>

          <!-- Tab Selection Toggles -->
          <div class="flex border-b border-slate-100 bg-slate-50/50">
            <button (click)="switchTab(true)" 
                    [ngClass]="{'border-primary text-primary bg-white font-extrabold': isLoginMode, 'border-transparent text-slate-500 hover:text-slate-700 font-semibold': !isLoginMode}"
                    class="flex-1 text-center py-3 text-xs sm:text-sm border-b-2 transition-all focus:outline-none">
              Sign In
            </button>
            <button (click)="switchTab(false)" 
                    [ngClass]="{'border-primary text-primary bg-white font-extrabold': !isLoginMode, 'border-transparent text-slate-500 hover:text-slate-700 font-semibold': isLoginMode}"
                    class="flex-1 text-center py-3 text-xs sm:text-sm border-b-2 transition-all focus:outline-none">
              Create Account
            </button>
          </div>

          <!-- Forms Content Container -->
          <div class="p-6 overflow-y-auto max-h-[500px]">
            
            <!-- A. SIGN IN FORM -->
            <form *ngIf="isLoginMode" [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
              <!-- Identifier Input (Email/Phone) -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email or Phone Identifier</label>
                <div class="relative">
                  <input type="text" 
                         formControlName="identifier" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showLoginError('identifier')}"
                         placeholder="e.g. john@example.com or 9876543210"
                         class="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all" />
                  <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <p *ngIf="showLoginError('identifier')" class="text-[10px] font-bold text-rose-500">
                  Email or Phone identifier is required.
                </p>
              </div>

              <!-- Password Input -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <a href="javascript:void(0)" class="text-[10px] font-bold text-primary hover:underline">Forgot?</a>
                </div>
                <div class="relative">
                  <input type="password" 
                         formControlName="password" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showLoginError('password')}"
                         placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                         class="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all" />
                  <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <p *ngIf="showLoginError('password')" class="text-[10px] font-bold text-rose-500">
                  Password is required.
                </p>
              </div>

              <!-- Submit Button -->
              <button type="submit" 
                      [disabled]="isLoading"
                      class="w-full mt-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-bold shadow-premium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2">
                <svg *ngIf="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Verifying Account...' : 'Sign In' }}
              </button>
            </form>

            <!-- B. REGISTRATION FORM -->
            <form *ngIf="!isLoginMode" [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="space-y-3.5">
              
              <!-- Full Name Field -->
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div class="relative">
                  <input type="text" 
                         formControlName="name" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showRegisterError('name')}"
                         placeholder="e.g. John Doe"
                         class="w-full px-3 py-2 pl-9 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-medium transition-all" />
                  <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <p *ngIf="showRegisterError('name')" class="text-[9px] font-bold text-rose-500">
                  Name must be between 2 and 100 characters.
                </p>
              </div>

              <!-- Email Address Field -->
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <input type="email" 
                         formControlName="email" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showRegisterError('email')}"
                         placeholder="e.g. john@example.com"
                         class="w-full px-3 py-2 pl-9 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-medium transition-all" />
                  <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <p *ngIf="showRegisterError('email')" class="text-[9px] font-bold text-rose-500">
                  Please enter a valid email address.
                </p>
              </div>

              <!-- Phone Number (+91 Indian Layout) -->
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-bold text-xs sm:text-sm">
                    +91
                  </span>
                  <div class="relative flex-1">
                    <input type="text" 
                           formControlName="phone" 
                           [ngClass]="{'border-rose-300 focus:ring-rose-200': showRegisterError('phone')}"
                           placeholder="98765 43210"
                           class="w-full px-3 py-2 pl-3 rounded-r-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-medium transition-all" />
                  </div>
                </div>
                <p *ngIf="showRegisterError('phone')" class="text-[9px] font-bold text-rose-500">
                  Phone number must be between 10 and 15 digits.
                </p>
              </div>

              <!-- Date of Birth & Role Selection Grouped -->
              <div class="grid grid-cols-2 gap-3.5">
                <!-- Date of Birth -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">Date of Birth</label>
                  <input type="date" 
                         formControlName="dateOfBirth" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showRegisterError('dateOfBirth')}"
                         class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs font-semibold text-slate-700" />
                  <p *ngIf="showRegisterError('dateOfBirth')" class="text-[9px] font-bold text-rose-500 leading-tight">
                    DOB must be past/today.
                  </p>
                </div>

                <!-- Account Role -->
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">I am a</label>
                  <select formControlName="role" 
                          class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs font-bold text-slate-700">
                    <option value="ROLE_CUSTOMER">Customer</option>
                    <option value="ROLE_STYLIST">Professional Stylist</option>
                  </select>
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secure Password</label>
                <div class="relative">
                  <input type="password" 
                         formControlName="password" 
                         [ngClass]="{'border-rose-300 focus:ring-rose-200': showRegisterError('password')}"
                         placeholder="Min 8 chars, A-Z, a-z, 1-9, &#64;"
                         class="w-full px-3 py-2 pl-9 rounded-xl border border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-medium transition-all" />
                  <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <!-- Dynamic Helper Text or Error validation details -->
                <div *ngIf="showRegisterError('password')" class="text-[9px] font-bold text-rose-500 leading-tight space-y-0.5">
                  <p>Must be at least 8 characters long.</p>
                  <p>Must contain uppercase, lowercase, digit, and special char (&#64;$!%*?&).</p>
                </div>
              </div>

              <!-- Submit Register Button -->
              <button type="submit" 
                      [disabled]="isLoading"
                      class="w-full mt-1.5 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-bold shadow-premium transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2">
                <svg *ngIf="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isLoading ? 'Provisioning Account...' : 'Create Account' }}
              </button>
            </form>

          </div>

          <!-- Bottom Footer Details -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Stateless SSL JWT Security Protection
          </div>

        </div>
      </div>
    </div>
  `
})
export class AuthModalComponent implements OnInit {
  @Output() public closeModal = new EventEmitter<void>();

  public isLoginMode = true;
  public isLoading = false;

  public loginForm!: FormGroup;
  public registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    // A. Login Form
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // B. Registration Form matching database constraints exactly!
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      dateOfBirth: ['', [this.dobValidator]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$')
      ]],
      role: ['ROLE_CUSTOMER', [Validators.required]]
    });
  }

  // DOB Must be in the past validator
  private dobValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today ? null : { invalidDob: true };
  }

  public switchTab(isLogin: boolean): void {
    this.isLoginMode = isLogin;
    this.isLoading = false;
  }

  public close(): void {
    this.closeModal.emit();
  }

  // --- FORM STATE CHECKS ---
  public showLoginError(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public showRegisterError(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  // --- ACTIONS SUBMIT ---

  public onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const creds = this.loginForm.value;

    this.authService.login(creds).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.showSuccess(`Welcome back, ${response.user.name}! Access Granted.`);
        this.router.navigate(['/dashboard']);
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.showError(err.message || 'Verification failed. Please check credentials.');
      }
    });
  }

  public onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (userProfile) => {
        this.isLoading = false;
        this.toastService.showSuccess(`Account provisioned successfully for ${userProfile.name}!`);
        this.router.navigate(['/dashboard']);
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.showError(err.message || 'Registration failed. Try again.');
      }
    });
  }
}
