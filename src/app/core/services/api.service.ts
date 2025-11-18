import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, retryWhen, delayWhen, take, concatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Use jbossUrl for /hr endpoints (same as hrplus-std-rd)
  private baseUrl = environment.jbossUrl;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) { }

  get<T>(endpoint: string, params?: any, useCache: boolean = false, cacheKey?: string): Observable<ApiResponse<T>> {
    const httpParams = this.buildParams(params);
    const url = `${this.baseUrl}${endpoint}`;
    
    const request = this.http.get<ApiResponse<T>>(url, { params: httpParams });

    if (useCache && cacheKey) {
      return this.cache.cacheObservable(cacheKey, request);
    }

    return this.retryRequest(request);
  }

  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const request = this.http.post<ApiResponse<T>>(
      `${this.baseUrl}${endpoint}`,
      body
    );
    return this.retryRequest(request);
  }

  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    const request = this.http.put<ApiResponse<T>>(
      `${this.baseUrl}${endpoint}`,
      body
    );
    return this.retryRequest(request);
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    const request = this.http.delete<ApiResponse<T>>(
      `${this.baseUrl}${endpoint}`
    );
    return this.retryRequest(request);
  }

  uploadFile(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const request = this.http.post<ApiResponse<any>>(
      `${this.baseUrl}${endpoint}`,
      formData
    );
    return this.retryRequest(request);
  }

  downloadFile(endpoint: string, params?: any): Observable<Blob> {
    const httpParams = this.buildParams(params);
    const request = this.http.get(
      `${this.baseUrl}${endpoint}`,
      {
        params: httpParams,
        responseType: 'blob'
      }
    );
    return this.retryRequest(request);
  }

  private retryRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((error: HttpErrorResponse, index) => {
            // Don't retry on client errors (4xx) except 408, 429
            if (error.status >= 400 && error.status < 500) {
              if (error.status === 408 || error.status === 429) {
                // Retry on timeout or too many requests
                if (index < this.maxRetries) {
                  return timer(this.retryDelay * (index + 1));
                }
              }
              return throwError(() => error);
            }

            // Retry on server errors (5xx) or network errors
            if (index < this.maxRetries) {
              return timer(this.retryDelay * (index + 1));
            }

            return throwError(() => error);
          }),
          take(this.maxRetries + 1)
        )
      )
    );
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
              httpParams = httpParams.append(key, value.toString());
            });
          } else {
            httpParams = httpParams.append(key, params[key].toString());
          }
        }
      });
    }
    return httpParams;
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear cache entries matching pattern
      // This is a simple implementation - could be enhanced
      this.cache.clear();
    } else {
      this.cache.clear();
    }
  }
}
