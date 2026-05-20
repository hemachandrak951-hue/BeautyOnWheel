import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HeroSlide {
  title: string;
  subtitle: string;
  badge: string;
  couponCode?: string;
  priceHighlight?: string;
  image: string;
  accentClass: string;
}

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <!-- Outer Banner card with radial and patterned premium styling -->
      <div class="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden shadow-premium bg-slate-900 text-white flex items-center bg-hero-pattern">
        
        <!-- Rotating Slides Background / Contents -->
        <div *ngFor="let slide of slides; let i = index" 
             [ngClass]="{'opacity-100 translate-x-0 scale-100 z-10': currentSlide === i, 'opacity-0 translate-x-12 scale-95 z-0 pointer-events-none': currentSlide !== i}"
             class="absolute inset-0 w-full h-full flex flex-col md:flex-row justify-between items-center transition-all duration-700 ease-in-out p-6 sm:p-12 gap-6">
          
          <!-- Left Content pane -->
          <div class="flex-1 text-left flex flex-col justify-center animate-slide-up max-w-xl">
            <span [ngClass]="slide.accentClass" 
                  class="inline-block self-start px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
              {{ slide.badge }}
            </span>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {{ slide.title }}
            </h1>
            <p class="text-sm sm:text-lg text-slate-300 font-medium mt-3 leading-relaxed">
              {{ slide.subtitle }}
            </p>
            
            <!-- Dynamic pricing & Coupon info -->
            <div class="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <span *ngIf="slide.priceHighlight" class="text-lg sm:text-2xl font-black text-accent-yellow bg-white/10 px-3 py-1 rounded-xl">
                {{ slide.priceHighlight }}
              </span>
              <div *ngIf="slide.couponCode" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-400 bg-slate-800 text-slate-200">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Use Code</span>
                <span class="text-xs sm:text-sm font-black text-white select-all">{{ slide.couponCode }}</span>
              </div>
              <button class="px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-premium transition-all hover:scale-105 active:scale-95 duration-200">
                Book Package
              </button>
            </div>
          </div>

          <!-- Right Image overlay pane with premium styling -->
          <div class="hidden md:block flex-1 h-full relative max-w-sm lg:max-w-md w-full">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent z-10"></div>
            <!-- Image with floating card animation -->
            <img [src]="slide.image" 
                 [alt]="slide.title"
                 class="w-full h-full object-cover rounded-2xl shadow-premium border-2 border-white/10 scale-100 hover:scale-105 transition-transform duration-700 ease-out" />
            <div class="absolute bottom-4 right-4 z-20 glassmorphism text-slate-900 px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1">
              <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              4.9/5 Rated
            </div>
          </div>

        </div>

        <!-- Slider Arrows -->
        <button (click)="prevSlide()" 
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20 hover:scale-105">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button (click)="nextSlide()" 
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-20 hover:scale-105">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Slider Indicators (Dots) -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <button *ngFor="let dot of slides; let i = index" 
                  (click)="setSlide(i)"
                  [ngClass]="{'w-6 bg-primary': currentSlide === i, 'w-2 bg-white/40': currentSlide !== i}"
                  class="h-2 rounded-full transition-all duration-350 focus:outline-none">
          </button>
        </div>

      </div>

      <!-- Static Under-Banner Value Proposition card -->
      <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-indigo-50 to-emerald-50/50 border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left shadow-premium">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-indigo-100 px-2.5 py-1 rounded-full">
            Yes Madam Inspired Value Proposition
          </span>
          <h2 class="text-base sm:text-lg font-black text-slate-800 mt-2">
            India's Highest Rated Home Salon — Transparent Per-Minute Pricing
          </h2>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Never pay inflated flat-rates. Pay strictly for product usage and by-the-minute styling labor.
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 bg-white shadow-premium border border-slate-50 rounded-xl px-4 py-2.5">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            ₹2
          </div>
          <div>
            <p class="text-[9px] font-semibold text-slate-400 uppercase leading-none">Starting labor</p>
            <p class="text-xs font-black text-slate-800 mt-0.5">Just ₹2 to ₹3 / Min</p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  public currentSlide = 0;
  private intervalId: any;

  public slides: HeroSlide[] = [
    {
      title: "Premium Doorstep Salon Packages",
      subtitle: "Experience luxury pre-curated cleanups, glowing facials, nourishing hair treatments, and painless Rica waxing at your home.",
      badge: "Summer Glow Specials",
      priceHighlight: "Save 35% Flat",
      couponCode: "SUMMERGLOW35",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
      accentClass: "bg-primary text-white"
    },
    {
      title: "Elite Bridal & Festive Prep Packs",
      subtitle: "HD Airbrush makeovers, traditional hairstyles, professional drape settings, and customized skin radiance therapies by certified cosmetologists.",
      badge: "Bridal Season Deal",
      priceHighlight: "Save ₹2,000",
      couponCode: "BRIDEGLOW2K",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80",
      accentClass: "bg-accent-pink text-white"
    },
    {
      title: "Stress Relief Aromatherapy Spa",
      subtitle: "Unwind from busy office stress with Swedish muscle therapies, organic cocoa scrubs, and hot herbal compression by elite therapists.",
      badge: "Wellness Weekend",
      priceHighlight: "Labor ₹3/Min Only",
      couponCode: "SPAWELLNESS",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
      accentClass: "bg-secondary text-white"
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  public prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  public setSlide(index: number): void {
    this.currentSlide = index;
    this.stopAutoPlay();
    this.startAutoPlay(); // Restart timer
  }
}
