import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import jwt_decode from 'jwt-decode';

export interface User {
  // Core identification
  id?: string;
  username: string;
  user?: string;
  uid?: string;
  employeeid?: string;
  actorid?: string;
  memberid?: string;

  // Personal information
  name?: string;
  fullname?: string;
  email?: string;

  // Authentication & Authorization
  roles?: string[];
  user_role?: string;
  role_level?: string;
  user_level?: string;
  permissions?: string[];

  // Company & Organization
  companyId?: string;
  companyid?: string;
  companyName?: string;
  comid?: string;
  branch?: string;
  dbName?: string;
  schema?: string;

  // Work & Position
  workarea?: string;
  emp_position?: string;
  job?: string;

  // Account status
  accountactive?: string;
  firstlogin?: string;
  ad?: string;

  // Language & Localization
  lang?: string;

  // Application & System
  app_name?: string;
  url_myhr?: string;
  encode?: string;
  sub?: string;
  iss?: string;

  // Zeeme integration
  zmlogin?: string;
  token_zeeme?: string;
  zm_user?: string;

  // Token
  token?: string;

  // Allow additional properties from JWT token
  [key: string]: any;
}

export interface LoginRequest {
  username: string;
  password: string;
  dbName?: string;
  dbcomp?: string;
  lang?: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  message?: string;
}

export interface DatabaseModel {
  db: string;
  dbName: string;
  dbDisplay: string;
  dbcomp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    this.loadUserFromStorage();
    this.startTokenRefreshTimer();
  }

  login(credentials: LoginRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        username: credentials.username,
        password: credentials.password,
        dbName: credentials.dbName || '',
        dbcomp: credentials.dbcomp || '100',
        lang: credentials.lang || 'th'
      };

      // Use jbossUrl for /hr endpoints (same as hrplus-std-rd)
      this.http.post<any>(
        `${environment.jbossUrl}${environment.apiEndpoints.unsecure}/authen`,
        body
      ).subscribe({
        next: (response) => {
          // Store token and user data
          if (response.accessToken) {
            // Decode JWT token to get user info
            try {
              const tokenPayload = jwt_decode<any>(response.accessToken);
              const user: User = {
                // Map token payload to User interface
                id: tokenPayload.uid || tokenPayload.employeeid || tokenPayload.actorid || tokenPayload.sub || credentials.username,
                username: tokenPayload.username || tokenPayload.user || credentials.username,
                user: tokenPayload.user || tokenPayload.username,
                uid: tokenPayload.uid,
                employeeid: tokenPayload.employeeid,
                actorid: tokenPayload.actorid,
                memberid: tokenPayload.memberid,
                name: tokenPayload.fullname || tokenPayload.name || tokenPayload.username || credentials.username,
                fullname: tokenPayload.fullname,
                email: tokenPayload.email,
                roles: tokenPayload.roles || [],
                user_role: tokenPayload.user_role,
                role_level: tokenPayload.role_level,
                user_level: tokenPayload.user_level,
                permissions: tokenPayload.permissions,
                companyId: tokenPayload.companyid || tokenPayload.companyId,
                companyid: tokenPayload.companyid,
                companyName: tokenPayload.companyName,
                comid: tokenPayload.comid,
                branch: tokenPayload.branch,
                dbName: tokenPayload.dbName,
                schema: tokenPayload.schema,
                workarea: tokenPayload.workarea,
                emp_position: tokenPayload.emp_position,
                job: tokenPayload.job,
                accountactive: tokenPayload.accountactive,
                firstlogin: tokenPayload.firstlogin,
                ad: tokenPayload.ad,
                lang: tokenPayload.lang || 'th',
                app_name: tokenPayload.app_name,
                url_myhr: tokenPayload.url_myhr,
                encode: tokenPayload.encode,
                sub: tokenPayload.sub,
                iss: tokenPayload.iss,
                zmlogin: tokenPayload.zmlogin,
                token_zeeme: tokenPayload.token_zeeme,
                zm_user: tokenPayload.zm_user,
                token: response.accessToken,
                // Include all other token properties
                ...tokenPayload
              };

              // Store in sessionStorage (matching hrplus-std-rd pattern)
              if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem('dbName', credentials.dbName || '');
                sessionStorage.setItem('userToken', response.accessToken);
                sessionStorage.setItem('currentUser', JSON.stringify(user));
              }

              // Also store in our storage service
              this.storage.setItem(this.TOKEN_KEY, response.accessToken);
              this.storage.setItem(this.USER_KEY, JSON.stringify(user));
              this.currentUserSubject.next(user);

              resolve(response);
            } catch (error) {
              console.error('Error decoding token:', error);
              reject(error);
            }
          } else {
            reject(new Error('No access token in response'));
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          reject(error);
        }
      });
    });
  }

  getDatabase(): Observable<DatabaseModel[]> {
    return this.http.get<DatabaseModel[]>(
      `${environment.jbossUrl}${environment.apiEndpoints.unsecure}/system/get-db-list`
    );
  }

  logout(): void {
    // Call logout API if needed
    this.http.post(`${environment.jbossUrl}${environment.apiEndpoints.auth}/logout`, {})
      .subscribe({
        next: () => {},
        error: () => {}
      });

    this.clearSession();
    // Clear sessionStorage as well
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.clear();
    }
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<string | null> {
    const refreshToken = this.storage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<LoginResponse>(
      `${environment.jbossUrl}${environment.apiEndpoints.auth}/refresh`,
      { refreshToken }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          this.setUser(
            response.data.user,
            response.data.token,
            response.data.refreshToken,
            response.data.expiresIn
          );
          return response.data.token;
        }
        throw new Error('Token refresh failed');
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      // Try to refresh token
      this.refreshToken().subscribe({
        next: () => {},
        error: () => this.logout()
      });
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.roles ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  private setUser(user: User, token: string, refreshToken?: string, expiresIn?: number): void {
    this.storage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      this.storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));

    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      this.storage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userData = this.storage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const token = this.getToken();

        if (token && !this.isTokenExpired(token)) {
          this.currentUserSubject.next(user);
        } else {
          // Token expired, try to refresh
          this.refreshToken().subscribe({
            next: () => {},
            error: () => this.clearSession()
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.storage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.currentUserSubject.next(null);
    this.stopTokenRefreshTimer();
    // Also clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('dbName');
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = jwt_decode<any>(token);
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      // If we can't parse the token, check expiry from storage
      const expiryTime = this.storage.getItem(this.TOKEN_EXPIRY_KEY);
      if (expiryTime) {
        return Date.now() >= parseInt(expiryTime, 10);
      }
      return true;
    }
  }

  private startTokenRefreshTimer(): void {
    this.stopTokenRefreshTimer();

    // Refresh token 5 minutes before expiry
    const expiryTime = this.storage.getItem(this.TOKEN_EXPIRY_KEY);
    if (expiryTime) {
      const expiry = parseInt(expiryTime, 10);
      const now = Date.now();
      const timeUntilExpiry = expiry - now;
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutes before expiry

      if (refreshTime > 0) {
        this.tokenRefreshTimer = timer(refreshTime).subscribe(() => {
          this.refreshToken().subscribe({
            next: () => this.startTokenRefreshTimer(),
            error: () => this.logout()
          });
        });
      }
    }
  }

  private stopTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      this.tokenRefreshTimer.unsubscribe();
      this.tokenRefreshTimer = null;
    }
  }
}
