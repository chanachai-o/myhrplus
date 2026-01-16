import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { CompanyType, CompanyTypeApiResponse } from '../models/company-type.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService extends BaseApiService<CompanyType> {
  protected baseUrl = 'company/type'; // Relative path (will be overridden by apiUrl)

  // State
  loading = signal<boolean>(false);

  // Override apiUrl to use specific endpoint
  protected override get apiUrl(): string {
    return 'http://192.168.30.71:8110/company/type';
  }

  /**
   * Get all company types with pagination support
   * @param params Optional pagination parameters (page, size)
   * @returns Observable of CompanyType array
   */
  override getAll(params?: PaginationParams): Observable<CompanyType[]> {
    this.loading.set(true);

    // Build query parameters
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    console.log('[CompanyTypeService] Fetching data from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<CompanyTypeApiResponse>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        // Transform API response to CompanyType model
        // Convert camelCase (codeId) to lowercase (codeid)
        const transformedData: CompanyType[] = response.content.map((item) => ({
          codeid: item.codeId,
          tdesc: item.tdesc,
          edesc: item.edesc
        }));

        console.log('[CompanyTypeService] Data transformed:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          itemsCount: transformedData.length
        });

        return transformedData;
      }),
      tap((data) => {
        console.log('[CompanyTypeService] Data loaded:', data);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyTypeService] Error loading data:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override create(data: Partial<CompanyType>): Observable<CompanyType> {
    this.loading.set(true);
    console.log('[CompanyTypeService] Creating:', data);
    return this.http.post<CompanyType>(this.apiUrl, data).pipe(
      tap((result) => {
        console.log('[CompanyTypeService] Created:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyTypeService] Error creating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override update(id: string | number, data: Partial<CompanyType>): Observable<CompanyType> {
    this.loading.set(true);
    const url = `${this.apiUrl}/${id}`;
    console.log('[CompanyTypeService] Updating:', id, data);
    return this.http.put<CompanyType>(url, data).pipe(
      tap((result) => {
        console.log('[CompanyTypeService] Updated:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyTypeService] Error updating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override delete(id: string | number): Observable<void> {
    this.loading.set(true);
    const url = `${this.apiUrl}/${id}`;
    console.log('[CompanyTypeService] Deleting:', id);
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('[CompanyTypeService] Deleted:', id);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyTypeService] Error deleting:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }
}


