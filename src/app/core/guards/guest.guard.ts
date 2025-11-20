import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guest Guard - Redirects authenticated users away from auth pages (login, etc.)
 * Use this guard on routes that should only be accessible to non-authenticated users
 */
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // If user is authenticated, redirect to home
    if (this.authService.isAuthenticated()) {
      // Get returnUrl from query params or default to home
      const returnUrl = route.queryParams['returnUrl'] || '/home';
      this.router.navigate([returnUrl]);
      return false;
    }

    // User is not authenticated, allow access to auth pages
    return true;
  }
}






