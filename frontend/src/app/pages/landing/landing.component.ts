import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { ServiceGridComponent } from '../../components/service-grid/service-grid.component';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroSliderComponent,
    ServiceGridComponent,
    TrustBadgesComponent
  ],
  template: `
    <main class="min-h-screen bg-slate-50 bg-gradient-radial pb-16">
      <!-- 1. Hero Banner & Values Slider -->
      <app-hero-slider></app-hero-slider>

      <!-- 2. Service Categories Grid -->
      <app-service-grid></app-service-grid>

      <!-- 3. Trust & Safety Badges -->
      <app-trust-badges></app-trust-badges>

      <!-- 4. High-Conversion Customer Review & Promotional Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Left Column: Image Showcase with Glow -->
          <div class="relative">
            <div class="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary to-accent-pink opacity-30 blur-2xl animate-pulse-slow"></div>
            <div class="relative bg-white p-4 rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
              <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop&q=80" 
                   alt="Happy Home Salon Customer" 
                   class="rounded-2xl w-full h-[320px] sm:h-[400px] object-cover shadow-inner" />
              <div class="absolute bottom-8 left-8 right-8 glassmorphism p-5 rounded-2xl text-slate-800 shadow-premium flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-extrabold text-lg">
                  ★
                </div>
                <div>
                  <p class="text-xs italic font-medium leading-relaxed">
                    "The stylist arrived exactly on time with a completely sealed sanitization kit. The per-minute labor model is so fair and saved me ₹1,200 compared to other local apps!"
                  </p>
                  <p class="text-[10px] font-black text-slate-800 uppercase tracking-widest mt-2">
                    — Priyadarshini R., Bengaluru
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Promotional Copy & Micro Stats -->
          <div class="space-y-6">
            <span class="text-xs font-black uppercase tracking-widest text-primary bg-indigo-50 px-3 py-1 rounded-full">
              The Beauty Revolution
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Bringing India's Luxury Salon Experience Straight to Your Living Room
            </h2>
            <p class="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              No traffic. No crowded waiting rooms. No overpriced flat fees. Experience luxury manicures, high-end skin cleanups, massage therapies, and professional wedding styling in the quiet comfort of your home.
            </p>

            <!-- Dynamic Micro Stats grid -->
            <div class="grid grid-cols-2 gap-6 pt-4">
              <div class="space-y-1">
                <p class="text-2xl sm:text-3xl font-black text-primary">1.2M+</p>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Bookings Completed</p>
              </div>
              <div class="space-y-1">
                <p class="text-2xl sm:text-3xl font-black text-secondary">4.9/5</p>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Average Stylist Rating</p>
              </div>
              <div class="space-y-1">
                <p class="text-2xl sm:text-3xl font-black text-slate-800">100%</p>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Sealed Mono-dose Kits</p>
              </div>
              <div class="space-y-1">
                <p class="text-2xl sm:text-3xl font-black text-accent-pink">₹2/Min</p>
                <p class="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Transparent Labor Rates</p>
              </div>
            </div>

            <!-- Get Started CTA Trigger -->
            <div class="pt-6">
              <button (click)="openAuth()" 
                      class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent-pink hover:from-primary-dark hover:to-accent-pinklight text-white font-extrabold text-sm sm:text-base shadow-premium hover:shadow-premium-hover transform hover:-translate-y-0.5 transition-all duration-300">
                Get Started & Booking Now &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>

    <!-- 3. Premium Footer -->
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          <!-- Footer Column 1: Brand -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-pink flex items-center justify-center text-white font-bold text-base shadow-premium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span class="text-lg font-extrabold text-white tracking-tight">Beauty<span class="text-primary font-bold">On</span><span class="text-accent-pink font-black">Wheel</span></span>
            </div>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              India's highest rated and most transparent doorstep salon service platform. Delivering verified stylists, sealed mono-dose kits, and per-minute billing integrity.
            </p>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-500 font-bold">Secure SSL Payments</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
          </div>

          <!-- Footer Column 2: Sectors -->
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase text-white tracking-wider">Doorstep Sectors</h3>
            <ul class="space-y-2 text-xs font-semibold text-slate-500">
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Salon at Home for Women</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Bridal & Special Makeovers</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Spa & Relaxation Therapies</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Men's Shaving & Grooming</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Aromatherapy Massages</a></li>
            </ul>
          </div>

          <!-- Footer Column 3: Trust & Safety -->
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase text-white tracking-wider">Safety & Trust</h3>
            <ul class="space-y-2 text-xs font-semibold text-slate-500">
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Mono-dose Hygiene Promise</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Female Stylist Safety Policy</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Police-Verified Credentials</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">COVID Sanitization Protocols</a></li>
              <li><a href="javascript:void(0)" class="hover:text-primary transition-colors">Transparent Billing Rules</a></li>
            </ul>
          </div>

          <!-- Footer Column 4: Contact & Office -->
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase text-white tracking-wider">Office Locations</h3>
            <p class="text-xs text-slate-500 font-semibold">
              Corporate HQ: Gachibowli, Hyderabad, Telangana - 500032
            </p>
            <p class="text-xs text-slate-500 font-semibold">
              Customer Support: support&#64;beautyonwheel.com
            </p>
            <div class="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 text-[10px] text-slate-500 font-semibold leading-relaxed">
              <span class="text-slate-300 font-bold block mb-1">CORS Sandbox Activated</span>
              Angular Frontend port is configured to allow REST traffic to local Spring Boot API server on port 8080.
            </div>
          </div>

        </div>

        <!-- Bottom Copyright -->
        <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-600">
          <p>&copy; 2026 Beauty On Wheel India Private Limited. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="javascript:void(0)" class="hover:text-primary">Terms & Conditions</a>
            <a href="javascript:void(0)" class="hover:text-primary">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class LandingComponent {
  constructor(private authService: AuthService) {}

  public openAuth(): void {
    this.authService.showAuthModal$.next(true);
  }
}
