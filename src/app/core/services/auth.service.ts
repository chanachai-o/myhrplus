import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer, Subscription } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { ApiService, ApiResponse } from './api.service';
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

  private tokenRefreshTimer: Subscription | null = null;

  private readonly baseUrl = `${environment.jbossUrl}${environment.apiEndpoints.unsecure}`;
  private readonly authBaseUrl = `${environment.jbossUrl}${environment.apiEndpoints.auth}`;
  private readonly empViewBaseUrl = `${environment.jbossUrl}${environment.apiEndpoints.employeeView}`;

  constructor(
    private http: HttpClient, // Keep for login/forgot-password that need direct access
    private apiService: ApiService,
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
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    return this.apiService.get<DatabaseModel[]>(
      `${environment.apiEndpoints.unsecure}/system/get-db-list`
    ).pipe(
      map((response: ApiResponse<DatabaseModel[]>) => {
        const data = response.data || (response as unknown as DatabaseModel[]);
        return Array.isArray(data) ? data : [];
      })
    );
  }

  setMailForgetPassword(username: string, email: string, dbName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        userName: username,
        email: email,
        dbName: dbName
      };

      this.http.post<any>(
        `${environment.jbossUrl}${environment.apiEndpoints.unsecure}/authen/forgot-password`,
        body
      ).subscribe({
        next: (response) => {
          console.warn('Forgot password response:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Forgot password error:', error);
          reject(error);
        }
      });
    });
  }

  logout(): void {
    // Call logout API if needed
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    this.apiService.post<unknown>(`${environment.apiEndpoints.auth}/logout`, {})
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

    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    return this.apiService.post<LoginResponse>(
      `${environment.apiEndpoints.auth}/refresh`,
      { refreshToken }
    ).pipe(
      map((response: ApiResponse<LoginResponse>) => {
        const loginResponse = response.data || (response as unknown as LoginResponse);
        if (loginResponse.success && loginResponse.data) {
          this.setUser(
            loginResponse.data.user,
            loginResponse.data.token,
            loginResponse.data.refreshToken,
            loginResponse.data.expiresIn
          );
          return loginResponse.data.token;
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
    if (!token) {
      // Also check sessionStorage as fallback
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const sessionToken = sessionStorage.getItem('userToken');
        if (sessionToken && !this.isTokenExpired(sessionToken)) {
          // Migrate to localStorage
          this.storage.setItem(this.TOKEN_KEY, sessionToken);
          return true;
        }
      }
      return false;
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      // Token expired, but don't logout immediately
      // Return false and let guard handle navigation
      return false;
    }

    // Ensure user is loaded
    if (!this.currentUserSubject.value) {
      this.loadUserFromStorage();
    }

    return true;
  }

  getToken(): string | null {
    // Check localStorage first
    let token = this.storage.getItem(this.TOKEN_KEY);

    // If not found, check sessionStorage (for backward compatibility)
    if (!token && typeof window !== 'undefined' && window.sessionStorage) {
      const sessionToken = sessionStorage.getItem('userToken');
      if (sessionToken) {
        // Migrate to localStorage
        this.storage.setItem(this.TOKEN_KEY, sessionToken);
        token = sessionToken;
      }
    }

    return token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Restore session from storage (used when page refreshes)
   * This method is called by AuthGuard to restore session immediately
   */
  restoreSession(user: User, token: string): void {
    this.storage.setItem(this.TOKEN_KEY, token);
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);

    // Also update sessionStorage for backward compatibility
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Set user from token (used for token-based authentication via URL parameters)
   * This method is called by TokenAuthGuard when authenticating via URL token
   */
  setUserFromToken(token: string, decodedToken: any): void {
    try {
      // Map decoded token to User interface
      const user: User = {
        id: decodedToken.uid || decodedToken.employeeid || decodedToken.actorid || decodedToken.sub || decodedToken.username,
        username: decodedToken.username || decodedToken.user || decodedToken.sub,
        user: decodedToken.user || decodedToken.username,
        uid: decodedToken.uid,
        employeeid: decodedToken.employeeid,
        actorid: decodedToken.actorid,
        memberid: decodedToken.memberid,
        name: decodedToken.fullname || decodedToken.name || decodedToken.username,
        fullname: decodedToken.fullname,
        email: decodedToken.email,
        roles: decodedToken.roles || [],
        user_role: decodedToken.user_role,
        role_level: decodedToken.role_level,
        user_level: decodedToken.user_level,
        permissions: decodedToken.permissions,
        companyId: decodedToken.companyid || decodedToken.companyId,
        companyid: decodedToken.companyid,
        companyName: decodedToken.companyName,
        comid: decodedToken.comid,
        branch: decodedToken.branch,
        dbName: decodedToken.dbName,
        schema: decodedToken.schema,
        workarea: decodedToken.workarea,
        emp_position: decodedToken.emp_position,
        job: decodedToken.job,
        accountactive: decodedToken.accountactive,
        firstlogin: decodedToken.firstlogin,
        ad: decodedToken.ad,
        lang: decodedToken.lang || 'th',
        app_name: decodedToken.app_name,
        url_myhr: decodedToken.url_myhr,
        encode: decodedToken.encode,
        sub: decodedToken.sub,
        iss: decodedToken.iss,
        zmlogin: decodedToken.zmlogin,
        token_zeeme: decodedToken.token_zeeme,
        zm_user: decodedToken.zm_user,
        token: token,
        // Include all other token properties
        ...decodedToken
      };

      // Store in both localStorage and sessionStorage
      this.storage.setItem(this.TOKEN_KEY, token);
      this.storage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);

      // Also store in sessionStorage for backward compatibility
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('userToken', token);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        if (decodedToken.dbName) {
          sessionStorage.setItem('dbName', decodedToken.dbName);
        }
      }

      console.warn('AuthService: User set from token', user);
    } catch (error) {
      console.error('AuthService: Error setting user from token', error);
      throw error;
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.roles ? user.roles.includes(role) : false;
  }

  savePassword(
    oldPass: string,
    newPass: string,
    lang: string,
    ciw: string,
    cliw: string,
    niw: string,
    siw: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Dynamic import for sha1
      import('sha1').then((sha1Module) => {
        const sha1 = sha1Module.default || sha1Module;
        const body = {
          password: oldPass,
          newPassword: typeof sha1 === 'function' ? sha1(newPass) : (sha1 as any)(newPass),
          lang: lang,
          niw: niw,
          ciw: ciw,
          cliw: cliw,
          siw: siw
        };

        this.http
          .post<any>(`${environment.jbossUrl}${environment.apiEndpoints.employeeView}/user/change-password`, body)
          .subscribe({
            next: (response) => {
              resolve(response);
            },
            error: (error) => {
              reject(error);
            }
          });
      }).catch((error) => {
        reject(error);
      });
    });
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
    // Check localStorage first (from StorageService)
    let userData = this.storage.getItem(this.USER_KEY);
    let token = this.getToken();

    // If not found in localStorage, check sessionStorage (for backward compatibility)
    if (!userData && typeof window !== 'undefined' && window.sessionStorage) {
      const sessionUser = sessionStorage.getItem('currentUser');
      const sessionToken = sessionStorage.getItem('userToken');

      if (sessionUser && sessionToken) {
        try {
          userData = JSON.parse(sessionUser);
          // Migrate to localStorage for persistence
          this.storage.setItem(this.USER_KEY, sessionUser);
          this.storage.setItem(this.TOKEN_KEY, sessionToken);
          token = sessionToken;
        } catch (error) {
          console.error('Error parsing sessionStorage user data:', error);
        }
      }
    }

    if (userData) {
      try {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;

        if (token && !this.isTokenExpired(token)) {
          this.currentUserSubject.next(user);
        } else if (token) {
          // Token expired, try to refresh
          this.refreshToken().subscribe({
            next: () => {},
            error: () => {
              // If refresh fails, clear session
              this.clearSession();
            }
          });
        } else {
          // No token found, clear session
          this.clearSession();
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

  /**
   * Get PDPA consent information for employee
   * @param employeeId - Employee ID
   * @returns Observable with employee consent and PDPA data
   */
  getPdpa(employeeId: string): Observable<{ employeeConsent: unknown; pdpa: unknown }> {
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    return this.apiService.get<{ employeeConsent: unknown; pdpa: unknown }>(
      `${environment.apiEndpoints.employeeView}/pdpa/employee-consent/${employeeId}`
    ).pipe(
      map((response: ApiResponse<{ employeeConsent: unknown; pdpa: unknown }>) => {
        return response.data || (response as unknown as { employeeConsent: unknown; pdpa: unknown });
      }),
      catchError(error => {
        console.error('Error getting PDPA consent:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Save PDPA consent
   * @param body - Request body with model containing version and employeeId
   * @returns Promise with response
   */
  savePdpa(body: { model: { version: number; employeeId: string } }): Observable<ApiResponse<unknown>> {
    // ApiService already handles baseUrl (environment.jbossUrl), so only pass the endpoint path
    return this.apiService.post<unknown>(
      `${environment.apiEndpoints.employeeView}/pdpa/employee-consent`,
      body
    );
  }
}
