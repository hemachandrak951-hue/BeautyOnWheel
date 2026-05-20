import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { ServiceCategory } from '../models/types';
import { environment } from '../../../environments/environment';

export interface ServiceItem {
  name: string;
  price: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  benefits: string[];
}

export interface DetailedCategory extends ServiceCategory {
  subCategories: {
    name: string;
    services: ServiceItem[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  // High fidelity default data with realistic home-salon services, pricing and images
  private defaultCategories: DetailedCategory[] = [
    {
      id: 1,
      name: "Salon at Home (Women)",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
      description: "Premium facials, waxing, manicures, pedicures & hair care by top stylists.",
      isActive: true,
      subCategories: [
        {
          name: "Facials & Cleanups",
          services: [
            { name: "O3+ Ultra Brightening Facial", price: 1899, duration: "75 mins", rating: 4.9, reviewsCount: 1240, benefits: ["Mono-dose kits used", "Tan removal", "Deep skin brightening"] },
            { name: "De-Tan Power Cleanup", price: 899, duration: "40 mins", rating: 4.8, reviewsCount: 843, benefits: ["Instant glowing skin", "Soothing massage", "Removes impurities"] }
          ]
        },
        {
          name: "Waxing & Threading",
          services: [
            { name: "Rica Honey Full Arms + Legs + Underarms", price: 999, duration: "60 mins", rating: 4.7, reviewsCount: 3105, benefits: ["Less painful Rica wax", "Pre & post-wax care", "Smooth finish"] },
            { name: "Eyebrow & Upper Lip Threading", price: 99, duration: "15 mins", rating: 4.6, reviewsCount: 14502, benefits: ["Organic thread", "Soothing gel aftercare"] }
          ]
        },
        {
          name: "Manicures & Pedicures",
          services: [
            { name: "Elysian Luxury Spa Pedicure", price: 1199, duration: "60 mins", rating: 4.9, reviewsCount: 932, benefits: ["Exfoliating sea salt scrub", "Premium hydrating mask", "Relaxing 15-min massage"] },
            { name: "Sara Charcoal Manicure", price: 699, duration: "45 mins", rating: 4.8, reviewsCount: 421, benefits: ["Detoxifying carbon wrap", "Nail shaping & cuticle care"] }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Bridal & Makeup Essentials",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80",
      description: "Flawless bridal makeovers, party makeup, and elegant hairstyling for all special events.",
      isActive: true,
      subCategories: [
        {
          name: "Bridal Makeovers",
          services: [
            { name: "Elite HD Bridal Makeup Package", price: 14999, duration: "180 mins", rating: 5.0, reviewsCount: 142, benefits: ["HD airbrush finish", "Hairstyling included", "Saree/Dupatta draping", "Premium lash extensions"] },
            { name: "Classic Engagement Makeup", price: 7999, duration: "120 mins", rating: 4.9, reviewsCount: 204, benefits: ["Long-lasting base", "Elegant hairstyling", "Product consultation"] }
          ]
        },
        {
          name: "Party & Festive Makeup",
          services: [
            { name: "Glamorous Party Makeup", price: 3499, duration: "75 mins", rating: 4.8, reviewsCount: 654, benefits: ["Flawless dewy finish", "Elegant eye makeup", "Lashes included"] },
            { name: "Festive Editorial Hair & Makeup", price: 4499, duration: "90 mins", rating: 4.9, reviewsCount: 312, benefits: ["Vibrant festive style", "Traditional hair accessories setting"] }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Spa & Wellness (Women)",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
      description: "Relaxing, stress-relieving massage therapies and luxury aromatherapy at home.",
      isActive: true,
      subCategories: [
        {
          name: "Massage Therapies",
          services: [
            { name: "Stress Relief Swedish Massage", price: 1599, duration: "90 mins", rating: 4.9, reviewsCount: 1845, benefits: ["Calming essential lavender oil", "Reduces muscle tension", "Disposable linen used"] },
            { name: "Deep Tissue Muscle Therapy", price: 1999, duration: "90 mins", rating: 4.8, reviewsCount: 928, benefits: ["Firm pressure therapy", "Targets chronic pain", "Increases blood flow"] }
          ]
        },
        {
          name: "Body Scrubs & Polishing",
          services: [
            { name: "Elysian Full Body Polishing Spa", price: 2999, duration: "120 mins", rating: 4.9, reviewsCount: 409, benefits: ["Cocoa butter scrub", "Hydrating body wrap", "Mini deep-glow cleanup"] }
          ]
        }
      ]
    },
    {
      id: 4,
      name: "Men's Grooming",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80",
      description: "Professional haircuts, beard styling, hair coloring, and relaxing head massages.",
      isActive: true,
      subCategories: [
        {
          name: "Hair & Beard",
          services: [
            { name: "Men's Classic Haircut + Beard Styling", price: 399, duration: "45 mins", rating: 4.8, reviewsCount: 4120, benefits: ["Hair consultation", "Hot towel beard wash", "Soothed massage after"] },
            { name: "Premium Hair Color (L'Oreal)", price: 799, duration: "50 mins", rating: 4.7, reviewsCount: 1289, benefits: ["Ammonia-free color", "Long-lasting shade", "Scalp protection applied"] }
          ]
        },
        {
          name: "Relaxation",
          services: [
            { name: "Rejuvenating Head Massage + Hair Wash", price: 249, duration: "25 mins", rating: 4.9, reviewsCount: 3980, benefits: ["Warm ayurvedic herbal oil", "Promotes hair growth", "Extremely relaxing"] }
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Massages (Unisex)",
      imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500&auto=format&fit=crop&q=80",
      description: "Holistic therapy and back, shoulder, or foot massage sessions for instant stress relief.",
      isActive: true,
      subCategories: [
        {
          name: "Express Relief",
          services: [
            { name: "Acupressure Foot Reflexology", price: 599, duration: "30 mins", rating: 4.8, reviewsCount: 2901, benefits: ["Targets reflex zones", "Improves sleep quality", "Warm herbal towel finish"] },
            { name: "Neck, Back & Shoulder Stress Relief", price: 799, duration: "45 mins", rating: 4.8, reviewsCount: 1954, benefits: ["Relieves office seating stiffness", "Special trigger point therapy"] }
          ]
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Retrieves active service categories.
   * Pulls from database if backend is running, otherwise falls back to static default categories.
   */
  public getCategories(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(`${environment.apiUrl}/home/categories`).pipe(
      tap(cats => console.log('Successfully fetched service categories from Spring Boot backend API', cats)),
      catchError(error => {
        console.warn('Backend categories endpoint failed or offline. Serving high-fidelity mock salon categories.', error);
        // Map the default categories to match the API structure
        const basicCats: ServiceCategory[] = this.defaultCategories.map(c => ({
          id: c.id,
          name: c.name,
          imageUrl: c.imageUrl,
          description: c.description,
          isActive: c.isActive
        }));
        return of(basicCats).pipe(delay(600));
      })
    );
  }

  /**
   * Retrieves full rich subcategory and service structures.
   */
  public getDetailedCategoryById(id: number): DetailedCategory | undefined {
    return this.defaultCategories.find(c => c.id === id);
  }

  public getAllDetailedCategories(): DetailedCategory[] {
    return this.defaultCategories;
  }
}
