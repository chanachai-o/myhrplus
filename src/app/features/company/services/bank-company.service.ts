import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { BankCompanyModel } from '../models/bank-company.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class BankCompanyService extends BaseApiService<BankCompanyModel> {
  protected baseUrl = environment.apiEndpoints.organization + '/company/bank'; // Relative path (will be overridden by apiUrl)

  loading = signal<boolean>(false);


  /**
   * Get all bank companies with pagination support
   * @param params Optional pagination parameters (page, size)
   * @returns Observable of BankCompany array
   */
  override getAll(params?: PaginationParams): Observable<BankCompanyModel[]> {
    this.loading.set(true);

    // Build query parameters
    let httpParams = new HttpParams();
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }

    console.log('[BankCompanyService] Fetching data from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<BankCompanyModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        const data: BankCompanyModel[] = response.content ?? [];
        console.log('[BankCompanyService] Data loaded:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          itemsCount: data.length
        });
        return data;
      }),
      tap((data) => {
        console.log('[BankCompanyService] Data loaded:', data);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[BankCompanyService] Error loading data:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all bank companies with pagination info
   * @param params Optional pagination parameters (page, size)
   * @returns Observable with data and pagination info
   */
  getAllWithPagination(params?: PaginationParams): Observable<{
    data: BankCompanyModel[];
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

    console.log('[BankCompanyService] Fetching data with pagination from:', this.apiUrl, 'with params:', params);

    return this.http.get<PaginatedResponse<BankCompanyModel>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        const data: BankCompanyModel[] = response.content ?? [];
        console.log('[BankCompanyService] Pagination response:', {
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
        console.log('[BankCompanyService] Data with pagination loaded:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[BankCompanyService] Error loading data with pagination:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override create(data: Partial<BankCompanyModel>): Observable<BankCompanyModel> {
    this.loading.set(true);
    console.log('[BankCompanyService] Creating:', data);
    return this.http.post<BankCompanyModel>(this.apiUrl, data).pipe(
      tap((result) => {
        console.log('[BankCompanyService] Created:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[BankCompanyService] Error creating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override update(id: string | number, data: Partial<BankCompanyModel>): Observable<BankCompanyModel> {
    this.loading.set(true);
    console.log('[BankCompanyService] Updating (POST):', id, data);
    return this.http.post<BankCompanyModel>(this.apiUrl, data).pipe(
      tap((result) => {
        console.log('[BankCompanyService] Updated:', result);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[BankCompanyService] Error updating:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  override delete(data: Partial<BankCompanyModel>): Observable<void> {
    this.loading.set(true);
    const url = this.apiUrl;
    console.log('[BankCompanyService] Deleting:', data);

    // DELETE request with BankCompany body (send data as-is)
    const body = data;
    const options = { body };

    return this.http.delete<any>(url, options).pipe(
      tap((response) => {
        // Check for logical error in response (even if HTTP status is 200)
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          console.error('[BankCompanyService] Logical error in delete response:', response);
          throw new Error(response.message || 'Delete failed');
        }
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('[BankCompanyService] Error deleting:', error);
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }

  // Helper methods to get Dropdown Options
  getBankOptions() {
    return this.http.get<any[]>('hr/master/banks'); // Assumption: Master API exists
  }

  getBranchOptions() {
    return this.http.get<any[]>('hr/master/branches'); // Assumption
  }
}


