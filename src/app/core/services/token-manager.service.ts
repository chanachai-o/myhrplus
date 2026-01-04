import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import jwt_decode from 'jwt-decode';

export interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  decoded?: any;
}

/**
 * Token Manager Service
 *
 * Manages JWT token storage, retrieval, and validation
 */
@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  private readonly TOKEN_KEY = 'userToken';
  private readonly TOKEN_STORAGE = 'sessionStorage'; // 'localStorage' or 'sessionStorage'

  constructor(private storageService: StorageService) {}

  /**
   * Get token from storage
   * Priority: sessionStorage > localStorage
   */
  getToken(): string | null {
    // Priority 1: sessionStorage (most reliable for current session)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionToken = sessionStorage.getItem(this.TOKEN_KEY);
      if (sessionToken && sessionToken.trim() !== '') {
        return sessionToken;
      }
    }

    // Priority 2: localStorage (fallback)
    if (typeof window !== 'undefined' && window.localStorage) {
      const localToken = localStorage.getItem(this.TOKEN_KEY);
      if (localToken && localToken.trim() !== '') {
        return localToken;
      }
    }

    return null;
  }

  /**
   * Set token in storage
   * @param token JWT token
   * @param useSessionStorage If true, use sessionStorage; otherwise use localStorage
   */
  setToken(token: string, useSessionStorage: boolean = true): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (useSessionStorage && window.sessionStorage) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      // Also store in localStorage as backup
      if (window.localStorage) {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    } else if (window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Remove token from storage
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      if (window.sessionStorage) {
        sessionStorage.removeItem(this.TOKEN_KEY);
      }
      if (window.localStorage) {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  }

  /**
   * Validate token
   * @param token JWT token (optional, uses stored token if not provided)
   * @returns TokenValidation object
   */
  validateToken(token?: string): TokenValidation {
    const tokenToValidate = token || this.getToken();

    if (!tokenToValidate || tokenToValidate.trim() === '') {
      return {
        isValid: false,
        isExpired: true
      };
    }

    try {
      const decoded: any = jwt_decode(tokenToValidate);
      const currentTime = Date.now() / 1000; // Convert to seconds
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined;
      const isExpired = decoded.exp ? decoded.exp < currentTime : false;

      return {
        isValid: !isExpired,
        isExpired,
        expiresAt,
        decoded
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        isValid: false,
        isExpired: true
      };
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token?: string): boolean {
    return this.validateToken(token).isExpired;
  }

  /**
   * Get decoded token payload
   */
  getDecodedToken(token?: string): any {
    const validation = this.validateToken(token);
    return validation.decoded || null;
  }
}





