import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartEntry, ServiceItem } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'bow_cart_selections';
  private cartSubject = new BehaviorSubject<CartEntry[]>([]);
  public cartItems$: Observable<CartEntry[]> = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem(this.CART_KEY);
    if (saved) {
      try {
        const entries = JSON.parse(saved) as CartEntry[];
        this.cartSubject.next(entries);
      } catch (e) {
        this.clearCart();
      }
    }
  }

  private saveCart(entries: CartEntry[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(entries));
    this.cartSubject.next(entries);
  }

  public get cartEntriesValue(): CartEntry[] {
    return this.cartSubject.value;
  }

  public addToCart(service: ServiceItem): void {
    const current = [...this.cartSubject.value];
    const match = current.find(c => c.service.name === service.name);

    if (match) {
      match.quantity += 1;
    } else {
      current.push({ service, quantity: 1 });
    }

    this.saveCart(current);
  }

  public removeFromCart(service: ServiceItem): void {
    let current = [...this.cartSubject.value];
    const match = current.find(c => c.service.name === service.name);

    if (match) {
      if (match.quantity > 1) {
        match.quantity -= 1;
      } else {
        current = current.filter(c => c.service.name !== service.name);
      }
    }

    this.saveCart(current);
  }

  public removeAllOfService(service: ServiceItem): void {
    const current = this.cartSubject.value.filter(c => c.service.name !== service.name);
    this.saveCart(current);
  }

  public clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    this.cartSubject.next([]);
  }

  // --- RxJS REACTIVE CALCULATIONS ---

  public get totalItems$(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, entry) => sum + entry.quantity, 0))
    );
  }

  public get totalPrice$(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, entry) => sum + (entry.quantity * entry.service.price), 0))
    );
  }

  public get totalDuration$(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, entry) => {
        const mins = this.parseDurationMinutes(entry.service.duration);
        return sum + (entry.quantity * mins);
      }, 0))
    );
  }

  private parseDurationMinutes(durationStr: string): number {
    // Extracts numeric values from strings like "75 mins" or "1.5 hours"
    if (!durationStr) return 0;
    const lower = durationStr.toLowerCase();
    const match = lower.match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    if (lower.includes('hour') || lower.includes('hr')) {
      return Math.round(value * 60);
    }
    return Math.round(value);
  }
}
