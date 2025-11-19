import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check authentication
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // If not authenticated, check if we're already on login page
    // to avoid redirect loop
    if (state.url.startsWith('/auth/login') || state.url.startsWith('/auth')) {
      return true;
    }

    // Check if there's a token in sessionStorage that might not be loaded yet
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionToken = sessionStorage.getItem('userToken');
      const sessionUser = sessionStorage.getItem('currentUser');
      
      if (sessionToken && sessionUser) {
        try {
          // Try to restore session
          const user = JSON.parse(sessionUser);
          
          // Check if token is expired
          if (!this.isTokenExpired(sessionToken)) {
            // Restore user and token to AuthService
            this.restoreSession(user, sessionToken);
            return true;
          }
        } catch (error) {
          console.error('Error restoring session:', error);
        }
      }
    }

    // Not authenticated, redirect to login with return URL
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  private restoreSession(user: any, token: string): void {
    // Use public method to restore session
    this.authService.restoreSession(user, token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  }
}

