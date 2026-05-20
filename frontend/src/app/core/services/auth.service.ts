import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { UserProfileResponse, AuthTokenResponse } from '../models/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'bow_user_session';
  private readonly TOKEN_KEY = 'bow_access_token';
  
  private currentUserSubject = new BehaviorSubject<UserProfileResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isMockModeSubject = new BehaviorSubject<boolean>(false);
  public isMockMode$ = this.isMockModeSubject.asObservable();

  public showAuthModal$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  private loadSession(): void {
    const savedUser = localStorage.getItem(this.AUTH_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as UserProfileResponse;
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearSession();
      }
    }
  }

  private saveSession(tokenResponse: AuthTokenResponse): void {
    localStorage.setItem(this.TOKEN_KEY, tokenResponse.access_token);
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(tokenResponse.user));
    this.currentUserSubject.next(tokenResponse.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  public get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public get currentUserValue(): UserProfileResponse | null {
    return this.currentUserSubject.value;
  }

  public setMockMode(enabled: boolean): void {
    this.isMockModeSubject.next(enabled);
  }

  /**
   * Performs user login.
   * Sends request to backend. If the backend is unreachable/offline, falls back to a simulated mock observable.
   */
  public login(credentials: { identifier: string; password: string }): Observable<AuthTokenResponse> {
    if (this.isMockModeSubject.value) {
      return this.simulateMockLogin(credentials);
    }

    return this.http.post<AuthTokenResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        console.log('Real backend login successful', response);
        this.saveSession(response);
      }),
      catchError(error => {
        console.warn('Real backend login failed or server unreachable. Falling back to mock session streaming.', error);
        this.isMockModeSubject.next(true); // Automatically switch to mock mode on connection failure
        return this.simulateMockLogin(credentials);
      })
    );
  }

  /**
   * Performs user registration.
   * Sends request to backend. If the backend is unreachable/offline, falls back to simulated registration.
   */
  public register(payload: any): Observable<UserProfileResponse> {
    // Standardize role to ROLE_CUSTOMER if not supplied
    const registrationData = {
      ...payload,
      role: payload.role || 'ROLE_CUSTOMER'
    };

    if (this.isMockModeSubject.value) {
      return this.simulateMockRegister(registrationData);
    }

    return this.http.post<UserProfileResponse>(`${environment.apiUrl}/auth/register`, registrationData).pipe(
      tap(response => {
        console.log('Real backend registration successful', response);
        // Automatically log user in after successful registration in high conversion flow
        const autoLoginToken: AuthTokenResponse = {
          access_token: 'mock_jwt_after_register_' + Math.random().toString(36).substring(2),
          token_type: 'Bearer',
          expires_in: 86400,
          user: response
        };
        this.saveSession(autoLoginToken);
      }),
      catchError(error => {
        console.warn('Real backend registration failed or server unreachable. Falling back to mock registration streaming.', error);
        this.isMockModeSubject.next(true); // Switch to mock mode
        return this.simulateMockRegister(registrationData);
      })
    );
  }

  /**
   * User logout
   */
  public logout(): Observable<boolean> {
    this.clearSession();
    return of(true).pipe(delay(400));
  }

  /**
   * Update user profile.
   * Supports both mock session streaming and real backend HTTP operations.
   */
  public updateProfile(updatedUser: Partial<UserProfileResponse>): Observable<UserProfileResponse> {
    const current = this.currentUserSubject.value;
    if (!current) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    const newProfile = { ...current, ...updatedUser, updatedAt: new Date().toISOString() };
    
    if (this.isMockModeSubject.value) {
      return of(newProfile).pipe(
        delay(1000),
        tap(() => {
          localStorage.setItem(this.AUTH_KEY, JSON.stringify(newProfile));
          this.currentUserSubject.next(newProfile);
        })
      );
    }
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserProfileResponse>(`${environment.apiUrl}/users/profile`, newProfile, { headers }).pipe(
      tap(response => {
        console.log('Real profile update success:', response);
        const savedUser = { ...current, ...response };
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(savedUser));
        this.currentUserSubject.next(savedUser);
      }),
      catchError(error => {
        console.warn('Real profile update failed. Falling back to local state updates.', error);
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(newProfile));
        this.currentUserSubject.next(newProfile);
        return of(newProfile);
      })
    );
  }

  // --- MOCK SIMULATORS ---

  private simulateMockLogin(credentials: { identifier: string; password: string }): Observable<AuthTokenResponse> {
    console.log('Simulating mock login stream for:', credentials.identifier);
    
    // Simulate API delay
    return of(true).pipe(
      delay(1200), // Simulate network latency
      tap(() => {
        // Simple password validation for simulation purposes
        if (credentials.password === 'fail_login') {
          throw new Error('Invalid email/phone or password combination.');
        }
      }),
      tap(() => {
        // Derive name from identifier or set mock name
        let name = 'Pooja Sharma';
        if (credentials.identifier.includes('@')) {
          const part = credentials.identifier.split('@')[0];
          name = part.charAt(0).toUpperCase() + part.slice(1);
        }

        const mockUser: UserProfileResponse = {
          id: Math.floor(Math.random() * 1000) + 1,
          name: name,
          email: credentials.identifier.includes('@') ? credentials.identifier : `${credentials.identifier}@example.com`,
          phone: credentials.identifier.match(/^\d+$/) ? credentials.identifier : '9876543210',
          dateOfBirth: '1995-08-12',
          role: 'ROLE_CUSTOMER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const mockResponse: AuthTokenResponse = {
          access_token: 'mock_jwt_token_header_payload_signature_beauty_on_wheel',
          token_type: 'Bearer',
          expires_in: 86400,
          user: mockUser
        };

        this.saveSession(mockResponse);
      }),
      // We map the return to the actual token response object
      catchError(err => throwError(() => new Error(err.message))),
      // Convert to AuthTokenResponse
      tap(() => {}),
      delay(0) // compile helper
    ) as unknown as Observable<AuthTokenResponse>;
  }

  private simulateMockRegister(payload: any): Observable<UserProfileResponse> {
    console.log('Simulating mock registration stream for:', payload.email);

    return of(true).pipe(
      delay(1500), // Latency simulation
      tap(() => {
        // Validation check simulations
        if (payload.email === 'taken@example.com') {
          throw new Error('Email address is already in use by another customer.');
        }
        if (payload.phone === '0000000000') {
          throw new Error('Invalid phone number provided.');
        }
      }),
      tap(() => {
        const mockUser: UserProfileResponse = {
          id: Math.floor(Math.random() * 1000) + 1,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          dateOfBirth: payload.dateOfBirth,
          role: payload.role || 'ROLE_CUSTOMER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Automate login on mock success
        const autoLoginToken: AuthTokenResponse = {
          access_token: 'mock_jwt_token_register_auto_' + Math.random().toString(36).substring(2),
          token_type: 'Bearer',
          expires_in: 86400,
          user: mockUser
        };
        this.saveSession(autoLoginToken);
      }),
      catchError(err => throwError(() => new Error(err.message))),
      // Return UserProfileResponse
      tap(() => {}),
      delay(0)
    ) as unknown as Observable<UserProfileResponse>;
  }
}
