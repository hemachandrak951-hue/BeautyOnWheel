import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border-y border-slate-100 py-12 shadow-premium">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-black uppercase tracking-widest text-secondary">Beauty Safety Guarantee</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            Why Millions Trust Our Doorstep Stylists
          </h2>
          <p class="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Every appointment meets strict premium hygiene, professional security, and transparent per-minute labor billing metrics.
          </p>
        </div>

        <!-- 3-Column Trust Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Card 1: Mono-dose kits -->
          <div class="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-2xl bg-indigo-100/70 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-premium">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="text-sm sm:text-base font-black text-slate-800">
              Mono-Dose Hygiene Kits
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-xs">
              We use sealed, single-use mono-dose kits for facials, wax, and makeup. The stylist opens the sealed kits right in front of you. Never reused.
            </p>
            <span class="text-[9px] font-bold text-primary mt-3 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
              100% Sealed Sanitary Guarantee
            </span>
          </div>

          <!-- Card 2: Verified Stylists -->
          <div class="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-2xl bg-teal-100/70 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-premium">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-sm sm:text-base font-black text-slate-800">
              Verified & Background-Checked
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-xs">
              All female stylists undergo thorough government background checks, criminal record verification, and intense 3-tier practical beauty skill assessments.
            </p>
            <span class="text-[9px] font-bold text-secondary mt-3 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">
              Top 1% Beauty Professionals Only
            </span>
          </div>

          <!-- Card 3: Pay-per-minute labor -->
          <div class="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all duration-300 group">
            <div class="w-14 h-14 rounded-2xl bg-rose-100/70 text-accent-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-premium">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm sm:text-base font-black text-slate-800">
              Pay Strictly By-The-Minute
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-xs">
              Complete pricing transparency. Pay strictly for product usage and by-the-minute styling labor (₹2 to ₹3 per minute). No hidden upcharges or flat-fees.
            </p>
            <span class="text-[9px] font-bold text-accent-pink mt-3 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">
              Fair & Transparent Pricing Rules
            </span>
          </div>

        </div>

      </div>
    </div>
  `
})
export class TrustBadgesComponent {}
