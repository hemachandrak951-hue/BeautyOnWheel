import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAuthenticated) {
    return true;
  }

  // Not authenticated: notify, trigger login modal and redirect to home
  toastService.showError('Access Denied. Please log in first to access your Customer Dashboard.');
  authService.showAuthModal$.next(true);
  
  router.navigate(['/']);
  return false;
};
