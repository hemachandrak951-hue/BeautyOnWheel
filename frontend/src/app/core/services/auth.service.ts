import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay, map, switchMap } from 'rxjs/operators';
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
    this.isMockModeSubject.next(false);
  }

  /**
   * Performs user login.
   * Sends request to backend.
   */
  public login(credentials: { identifier: string; password: string }): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        console.log('Real backend login successful', response);
        this.saveSession(response);
      })
    );
  }

  /**
   * Performs user registration.
   * Sends request to backend.
   */
  public register(payload: any): Observable<UserProfileResponse> {
    const registrationData = {
      ...payload,
      role: payload.role || 'ROLE_CUSTOMER'
    };

    return this.http.post<UserProfileResponse>(`${environment.apiUrl}/auth/register`, registrationData).pipe(
      tap(response => {
        console.log('Real backend registration successful', response);
      }),
      // Switch map to login so the login call completes before we proceed,
      // but we still return the user profile response at the end!
      switchMap(userProfile => {
        return this.login({
          identifier: payload.email,
          password: payload.password
        }).pipe(
          tap(authToken => {
            console.log('Seamless auto-login successful', authToken);
          }),
          // Map back to the original UserProfileResponse so the signature of register() is preserved!
          map(() => userProfile),
          // In case the auto-login fails for some reason, we still want to return the userProfile
          // so the registration success itself isn't broken
          catchError(loginErr => {
            console.error('Auto-login failed after successful registration:', loginErr);
            return of(userProfile);
          })
        );
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
   * Supports real backend HTTP operations.
   */
  public updateProfile(updatedUser: Partial<UserProfileResponse>): Observable<UserProfileResponse> {
    const current = this.currentUserSubject.value;
    if (!current) {
      return throwError(() => new Error('No user is currently logged in.'));
    }
    const newProfile = { ...current, ...updatedUser, updatedAt: new Date().toISOString() };
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserProfileResponse>(`${environment.apiUrl}/users/profile`, newProfile, { headers }).pipe(
      tap(response => {
        console.log('Real profile update success:', response);
        const savedUser = { ...current, ...response };
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(savedUser));
        this.currentUserSubject.next(savedUser);
      })
    );
  }
}
