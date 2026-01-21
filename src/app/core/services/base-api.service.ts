import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Base API Service for Standardized CRUD Operations
 * Extend this class in your feature services to inherit common methods.
 *
 * Example:
 * export class BenefitService extends BaseApiService<Benefit> {
 *   protected baseUrl = 'hr/benefits';
 * }
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {
  protected http = inject(HttpClient);

  /**
   * The relative path to the API endpoint (e.g., 'hr/benefits')
   * This will be appended to environment.apiUrl
   */
  protected abstract baseUrl: string;

  protected get apiUrl(): string {
    // Ensure no double slashes if environment.apiBaseUrl ends with /
    const base = environment.apiBaseUrl.endsWith('/') ? environment.apiBaseUrl.slice(0, -1) : environment.apiBaseUrl;
    const path = this.baseUrl.startsWith('/') ? this.baseUrl.substring(1) : this.baseUrl;
    return `${base}/${path}`;
  }

  /**
   * Get all items
   * @param params Optional query parameters
   */
  getAll(params?: any): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl, { params: this.createParams(params) });
  }

  /**
   * Get item by ID
   * @param id Item ID
   */
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new item
   * @param data Partial item data
   */
  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.apiUrl, data);
  }

  /**
   * Update existing item
   * @param id Item ID
   * @param data Partial item data
   */
  update(id: number | string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete item
   * @param data Data object to send in request body
   */
  delete(data: Partial<T>): Observable<void> {
    // Send data in body (body-based delete pattern)
    const options = { body: data };
    return this.http.delete<void>(this.apiUrl, options);
  }

  /**
   * Helper to convert any object to HttpParams
   */
  protected createParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(val => {
              httpParams = httpParams.append(key, val);
            });
          } else {
            httpParams = httpParams.append(key, value);
          }
        }
      });
    }
    return httpParams;
  }
}


