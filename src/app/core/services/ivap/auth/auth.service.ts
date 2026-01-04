/**
 * Authentication Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../../base-api.service';
import {
  LoginRequest,
  RegisterRequest,
  Token,
  Member,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapAuthService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/auth';
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<Token> {
    return this.post<Token>('/login', credentials).pipe(
      map(token => {
        // Auto-save token on successful login
        if (token.access_token) {
          this.setToken(token.access_token);
        }
        return token;
      })
    );
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<Member> {
    return this.post<Member>('/register', data);
  }

  /**
   * Get current user info
   */
  getCurrentUser(): Observable<Member> {
    return this.get<Member>('/me');
  }

  /**
   * Request password reset
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.post<ForgotPasswordResponse>('/forgot-password', data);
  }

  /**
   * Reset password with token
   */
  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.post<ResetPasswordResponse>('/reset-password', data);
  }

  /**
   * Logout (clear token)
   */
  logout(): void {
    this.removeToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current token (public method for components)
   */
  getCurrentToken(): string | null {
    return this.getToken();
  }
}

