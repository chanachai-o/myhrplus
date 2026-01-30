import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { CompanyTypeModel } from '../models/company-type.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyTypeService extends BaseApiService<CompanyTypeModel> {
  protected baseUrl = environment.apiEndpoints.organization + '/company/type'; // Relative path (will be overridden by apiUrl)

  // State
  loading = signal<boolean>(false);

  /**
   * Get all company types with pagination support
   * @param params Optional pagination parameters (page, size)
   * @returns Observable of CompanyTypeModel array
   */
  override getAll(params?: PaginationParams): Observable<CompanyTypeModel[]> {
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

    return this.http.get<PaginatedResponse<CompanyTypeModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        const data: CompanyTypeModel[] = response.content ?? [];
        console.log('[CompanyTypeService] Data loaded:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          itemsCount: data.length
        });
        return data;
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

  /**
   * Get all company types with pagination info (supports server-side search and sort)
   * @param params Optional pagination parameters (page, size, search, sort, direction)
   * @returns Observable with data and pagination info
   */
  getAllWithPagination(params?: PaginationParams): Observable<{
    data: CompanyTypeModel[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  }> {
    this.loading.set(true);

    // Build query parameters
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    // keyword = search term (API param name)
    if (params?.search !== undefined && params.search !== '') {
      httpParams = httpParams.set('keyword', params.search.trim());
    }
    // sort = field name for ordering (API param name)
    if (params?.sort !== undefined && params.sort !== '') {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params?.direction !== undefined) {
      httpParams = httpParams.set('direction', params.direction);
    }

    console.log('[CompanyTypeService] Fetching data with pagination from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<CompanyTypeModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        const data: CompanyTypeModel[] = response.content ?? [];
        console.log('[CompanyTypeService] Pagination response:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          pageSize: response.size,
          itemsCount: data.length
        });
        return {
          data,
          currentPage: response.number,
          pageSize: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        };
      }),
      tap((result) => {
        console.log('[CompanyTypeService] Data with pagination loaded:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyTypeService] Error loading data with pagination:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override create(data: Partial<CompanyTypeModel>): Observable<CompanyTypeModel> {
    this.loading.set(true);
    console.log('[CompanyTypeService] Creating:', data);
    return this.http.post<CompanyTypeModel>(this.apiUrl, data).pipe(
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

  override update(id: string | number, data: Partial<CompanyTypeModel>): Observable<CompanyTypeModel> {
    this.loading.set(true);
    // Use POST same as create, to apiUrl
    console.log('[CompanyTypeService] Updating (POST):', id, data);
    return this.http.post<CompanyTypeModel>(this.apiUrl, data).pipe(
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

  override delete(data: Partial<CompanyTypeModel>): Observable<void> {
    this.loading.set(true);
    const url = this.apiUrl;
    console.log('[CompanyTypeService] Deleting:', data);

    // DELETE request with CompanyTypeModel body (send data as-is)
    const body = data;
    const options = { body };

    return this.http.delete<any>(url, options).pipe(
      tap((response) => {
        // Check for logical error in response (even if HTTP status is 200)
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          console.error('[CompanyTypeService] Logical error in delete response:', response);
          throw new Error(response.message || 'Delete failed');
        }
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
