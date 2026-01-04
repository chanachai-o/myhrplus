import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IvapAuthService } from './ivap';
import { UserContextService } from './user-context.service';
import { DatabaseModel } from '@core/models/database.model';
import { Member } from '@core/models';

/**
 * Auth Service (Legacy Wrapper)
 *
 * Wrapper service for backward compatibility with legacy code
 * Uses IvapAuthService for actual authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Member | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private ivapAuthService: IvapAuthService,
    private userContextService: UserContextService
  ) {
    // Load user from storage on init
    this.loadUserFromStorage();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.ivapAuthService.isAuthenticated();
  }

  /**
   * Get current user (synchronous)
   */
  getCurrentUser(): Member | null {
    return this.currentUserSubject.value;
  }

  /**
   * Load user from storage
   */
  private loadUserFromStorage(): void {
    const storedUser = this.userContextService.getCurrentUser();
    if (storedUser) {
      // Member is already compatible, use directly
      this.currentUserSubject.next(storedUser);
    }
  }

  /**
   * Fetch current user from API
   */
  fetchCurrentUser(): Observable<Member> {
    return this.ivapAuthService.getCurrentUser().pipe(
      map(user => {
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        this.currentUserSubject.next(null);
        throw error;
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.ivapAuthService.logout();
    this.currentUserSubject.next(null);
    this.userContextService.clearUser();
  }

  /**
   * Restore session (for backward compatibility)
   */
  restoreSession(user: any, token: string): void {
    // Token is already saved by IvapAuthService
    // Just ensure user data is in sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Get database list (legacy method - not available in IVAP API)
   * Returns empty array for now
   */
  getDatabase(): Observable<DatabaseModel[]> {
    // IVAP API doesn't have database selection
    // Return empty array for backward compatibility
    return of([]);
  }

  /**
   * Set mail for forgot password (legacy method)
   * Uses IVAP forgot password API
   */
  setMailForgetPassword(
    username: string,
    email: string,
    dbName?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ivapAuthService.forgotPassword({
        email
      }).subscribe({
        next: (response: any) => {
          resolve({
            status: true,
            message: 'Password reset email sent successfully'
          });
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Save password (legacy method - not available in IVAP API)
   * Returns rejected promise for now
   */
  savePassword(
    oldPassword: string,
    newPassword: string,
    lang: string,
    maxChars: string,
    minChars: string,
    numChars: string,
    specialChars: string
  ): Promise<any> {
    // IVAP API doesn't have this endpoint yet
    // Return rejected promise for backward compatibility
    return Promise.reject({
      success: false,
      message: 'Password change not available in IVAP API'
    });
  }
}

