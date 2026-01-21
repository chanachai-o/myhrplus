import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { CompanyGroup } from '../models/company-group.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyGroupService extends BaseApiService<CompanyGroup> {
  protected baseUrl = 'company/group'; // Relative path (will be overridden by apiUrl)

  loading = signal<boolean>(false);

  // Override apiUrl to use specific endpoint
  protected override get apiUrl(): string {
    return 'http://192.168.30.71:8110/company/group';
  }

  /**
   * Get all company groups with pagination support
   * @param params Optional pagination parameters (page, size)
   * @returns Observable of CompanyGroup array
   */
  override getAll(params?: PaginationParams): Observable<CompanyGroup[]> {
    this.loading.set(true);

    // Build query parameters
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    console.log('[CompanyGroupService] Fetching data from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<CompanyGroup>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        // API returns camelCase, normalize field names to match our model
        const transformedData: CompanyGroup[] = (response.content || []).map((item: any) =>
          this.normalizeFromApiFormat(item)
        );
        console.log('[CompanyGroupService] Data loaded:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          itemsCount: transformedData.length
        });
        return transformedData;
      }),
      tap((data) => {
        console.log('[CompanyGroupService] Data loaded:', data);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyGroupService] Error loading data:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all company groups with pagination info
   * @param params Optional pagination parameters (page, size)
   * @returns Observable with data and pagination info
   */
  getAllWithPagination(params?: PaginationParams): Observable<{
    data: CompanyGroup[];
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

    console.log('[CompanyGroupService] Fetching data with pagination from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<CompanyGroup>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        // API returns camelCase, normalize field names to match our model
        const transformedData: CompanyGroup[] = (response.content || []).map((item: any) =>
          this.normalizeFromApiFormat(item)
        );
        console.log('[CompanyGroupService] Pagination response:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          pageSize: response.size,
          itemsCount: transformedData.length
        });

        return {
          data: transformedData,
          currentPage: response.number,
          pageSize: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        };
      }),
      tap((result) => {
        console.log('[CompanyGroupService] Data with pagination loaded:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyGroupService] Error loading data with pagination:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override create(data: Partial<CompanyGroup>): Observable<CompanyGroup> {
    this.loading.set(true);
    // API accepts camelCase, normalize data from model
    const apiData = this.normalizeToApiFormat(data);
    console.log('[CompanyGroupService] Creating:', apiData);
    return this.http.post<CompanyGroup>(this.apiUrl, apiData).pipe(
      map((response) => this.normalizeFromApiFormat(response)),
      tap((result) => {
        console.log('[CompanyGroupService] Created:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyGroupService] Error creating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override update(id: string | number, data: Partial<CompanyGroup>): Observable<CompanyGroup> {
    this.loading.set(true);
    // API accepts camelCase, normalize data from model
    const apiData = this.normalizeToApiFormat(data);
    // Use POST same as create, to apiUrl
    console.log('[CompanyGroupService] Updating (POST):', id, apiData);
    return this.http.post<CompanyGroup>(this.apiUrl, apiData).pipe(
      map((response) => this.normalizeFromApiFormat(response)),
      tap((result) => {
        console.log('[CompanyGroupService] Updated:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyGroupService] Error updating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override delete(data: Partial<CompanyGroup>): Observable<void> {
    this.loading.set(true);
    const url = this.apiUrl;
    console.log('[CompanyGroupService] Deleting:', data);

    // DELETE request with CompanyGroup body (send data as-is)
    const body = data;
    const options = { body };

    return this.http.delete<any>(url, options).pipe(
      tap((response) => {
        // Check for logical error in response (even if HTTP status is 200)
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          console.error('[CompanyGroupService] Logical error in delete response:', response);
          throw new Error(response.message || 'Delete failed');
        }
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[CompanyGroupService] Error deleting:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Normalize model data to API format (camelCase)
   * Handles field name variations
   */
  private normalizeToApiFormat(data: Partial<CompanyGroup>): any {
    return {
      codeId: data.codeId,
      tdesc: data.tdesc,
      edesc: data.edesc
    };
  }

  /**
   * Normalize API response to model format (camelCase)
   * Handles field name variations and type conversions
   */
  private normalizeFromApiFormat(item: any): CompanyGroup {
    return {
      codeId: item.codeId || item.codeid || '',
      tdesc: item.tdesc || '',
      edesc: item.edesc || '',
      editBy: item.editBy || item.edit_by,
      editDate: item.editDate || item.edit_date,
      editTime: item.editTime || item.edit_time,
      verified: item.verified
    };
  }
}
