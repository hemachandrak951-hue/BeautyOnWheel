export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string; // ISO string YYYY-MM-DD
  role: 'ROLE_CUSTOMER' | 'ROLE_STYLIST' | 'ROLE_ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

export interface ServiceCategoryResponse {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

export interface Location {
  id: number;
  name: string;
  type: 'city' | 'neighborhood';
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfileResponse;
}

export interface ServiceItem {
  id?: number;
  name: string;
  price: number;
  duration: string; // e.g. "45 mins" or "1.5 hours"
  rating: number;
  reviewsCount: number;
  benefits: string[];
  categoryName?: string;
}

export interface CartEntry {
  service: ServiceItem;
  quantity: number;
}
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  role: string;
}
