import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * HTTP Interceptor for:
 * - Adding authentication tokens
 * - URL transformation
 * - Response caching (for specific APIs)
 * - Error handling
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private responseCache = new Map<string, any>();
  // Zeeme token for specific endpoints
  private readonly tokenZeeme = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdXRoIiwiaXNzIjoiQ29tcHV0ZXIgU2NpZW5jZSBDb3Jwb3JhdGlvbiBMaW1pdGVkIiwiZnVsbE5hbWUiOiLguJjguLXguKPguYDguJTguIog4LiE4Li54Lir4LiY4LiZ4LmA4Liq4LiW4Li14Lii4LijIiwibWVtYmVySWQiOiJjN2QwZTBmMC0wMzBlLTExZTctODE3NS1kMWRiNjFiYjU1ZjgifQ.MCvsIoImQ4BPWh1lQeas2mcqqksx45BBhgMZpmx7hA0';

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip local files and assets
    if (req.url.startsWith('./') || 
        req.url.startsWith('/assets/') ||
        req.url.startsWith('assets/')) {
      return next.handle(req);
    }

    // Transform URL if needed
    const fullUrl = this.transformUrl(req.url);

    // Get token (use Zeeme token for specific endpoints, otherwise use auth token)
    const token = this.getToken(req.url);

    // Clone request with authorization header and transformed URL
    const authReq = req.clone({
      url: fullUrl,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Check if request should be cached
    if (this.canCache(req)) {
      const cache = this.responseCache.get(req.urlWithParams);
      if (cache) {
        return of(cache);
      }

      return next.handle(authReq).pipe(
        tap(response => {
          this.responseCache.set(req.urlWithParams, response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
    }

    // Non-cached requests
    return next.handle(authReq).pipe(
      tap(() => this.responseCache.delete('error0')),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Transform URL based on environment configuration
   */
  private transformUrl(url: string): string {
    // Already full URL or asset path
    if (url.startsWith('http') || 
        url.startsWith('/assets/configAppMyhr/') || 
        url.startsWith('/assets/template')) {
      return url;
    }

    // Use baseUrl for most requests
    return environment.baseUrl + url;
  }

  /**
   * Get appropriate token for the request
   */
  private getToken(url: string): string {
    // Use Zeeme token for Zeeme API endpoints
    if (url.includes('zeeme.myhr.co.th/ZeemeApi/rest/company-config')) {
      return this.tokenZeeme;
    }

    // Get token from AuthService or sessionStorage
    const token = this.authService.getToken();
    if (token) {
      return token;
    }

    // Fallback to sessionStorage (for backward compatibility)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('userToken') || '';
    }

    return '';
  }

  /**
   * Check if request should be cached
   */
  private canCache(request: HttpRequest<unknown>): boolean {
    const cacheableApis = [
      'jobcode/lists',
      'config/workflow-menu'
    ];

    return cacheableApis.some(api => request.urlWithParams.includes(api));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): void {
    if (error.status === 0 && !this.responseCache.get('error0')) {
      // Network or client-side error
      console.error('A client-side or network error occurred. Please check your internet connection.');
      // Note: Using console.error instead of alert for better UX
      // You can integrate with notification service here
      this.responseCache.set('error0', 'Network error');
    } else if (error.status !== 0) {
      // Server error - clear network error cache
      this.responseCache.delete('error0');
    }
  }

  /**
   * Clear response cache (useful for logout or when data needs refresh)
   */
  public clearCache(): void {
    this.responseCache.clear();
  }
}

