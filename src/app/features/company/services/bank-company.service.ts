import { Injectable, signal } from '@angular/core';
import { BaseApiService } from '@core/services';
import { PaginatedResponse, PaginationParams } from '@core/models/pagination.model';
import { BankCompany } from '../models/bank-company.model';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BankCompanyService extends BaseApiService<BankCompany> {
  protected baseUrl = 'company/bank'; // Relative path (will be overridden by apiUrl)

  loading = signal<boolean>(false);

  // Override apiUrl to use specific endpoint
  protected override get apiUrl(): string {
    return 'http://192.168.30.71:8110/company/bank';
  }

  /**
   * Get all bank companies with pagination support
   * @param params Optional pagination parameters (page, size)
   * @returns Observable of BankCompany array
   */
  override getAll(params?: PaginationParams): Observable<BankCompany[]> {
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

    return this.http.get<PaginatedResponse<BankCompany>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        // API returns camelCase, normalize field names to match our model
        const transformedData: BankCompany[] = (response.content || []).map((item: any) =>
          this.normalizeFromApiFormat(item)
        );
        console.log('[BankCompanyService] Data loaded:', {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          currentPage: response.number,
          itemsCount: transformedData.length
        });
        return transformedData;
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
    data: BankCompany[];
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

    return this.http.get<PaginatedResponse<BankCompany>>(this.apiUrl, { params: httpParams }).pipe(
      map((response) => {
        // API returns camelCase, normalize field names to match our model
        const transformedData: BankCompany[] = (response.content || []).map((item: any) =>
          this.normalizeFromApiFormat(item)
        );
        console.log('[BankCompanyService] Pagination response:', {
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

  override create(data: Partial<BankCompany>): Observable<BankCompany> {
    this.loading.set(true);
    // API accepts camelCase, normalize data from model
    const apiData = this.normalizeToApiFormat(data);
    console.log('[BankCompanyService] Creating:', apiData);
    return this.http.post<BankCompany>(this.apiUrl, apiData).pipe(
      map((response) => this.normalizeFromApiFormat(response)),
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

  override update(id: string | number, data: Partial<BankCompany>): Observable<BankCompany> {
    this.loading.set(true);
    // API accepts camelCase, normalize data from model
    const apiData = this.normalizeToApiFormat(data);
    // Use POST same as create, to apiUrl
    console.log('[BankCompanyService] Updating (POST):', id, apiData);
    return this.http.post<BankCompany>(this.apiUrl, apiData).pipe(
      map((response) => this.normalizeFromApiFormat(response)),
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

  /**
   * Convert value to boolean
   */
  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value === '1' || value === 'true' || value === 'True';
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    return false;
  }

  /**
   * Normalize model data to API format (camelCase)
   * Handles boolean to string conversion for API
   */
  private normalizeToApiFormat(data: Partial<BankCompany>): any {
    return {
      companyId: data.companyId,
      bankId: data.bankId,
      branch: data.branch,
      bankBranch: data.bankBranch,
      lineNo: data.lineNo,
      account: data.account,
      bankClient: data.bankClient,
      bankClientThName: data.bankClientThName,
      bankClientEngName: data.bankClientEngName,
      contactPerson: data.contactPerson,
      tel: data.tel,
      transAts: typeof data.transAts === 'boolean' ? (data.transAts ? 1 : 0) : data.transAts,
      transMedia: data.transMedia,
      transOther: data.transOther,
      transOtherDesc: data.transOtherDesc,
      dayDisk: data.dayDisk,
      dayCheque: data.dayCheque,
      isDefault: typeof data.isDefault === 'boolean' ? (data.isDefault ? '1' : '0') : data.isDefault
    };
  }

  /**
   * Normalize API response to model format (camelCase)
   * Handles field name variations and type conversions
   */
  private normalizeFromApiFormat(item: any): BankCompany {
    return {
      companyId: item.companyId || '',
      bankId: item.bankId || '',
      branch: item.branch || '',
      bankBranch: item.bankBranch || '',
      lineNo: item.lineNo || '',
      account: item.account || '',
      bankClient: item.bankClient || '',
      bankClientThName: item.bankClientThName || item.bankClientThname || '',
      bankClientEngName: item.bankClientEngName || item.bankClientEngname || '',
      contactPerson: item.contactPerson || '',
      tel: item.tel || '',
      transAts: this.convertToBoolean(item.transAts),
      transMedia: item.transMedia || '',
      transOther: item.transOther || '',
      transOtherDesc: item.transOtherDesc,
      dayDisk: item.dayDisk,
      dayCheque: item.dayCheque,
      isDefault: this.convertToBoolean(item.isDefault || item.isdefault),
      bankTdesc: item.bankTdesc,
      bankEdesc: item.bankEdesc
    };
  }

  override delete(id: string | number): Observable<void> {
    this.loading.set(true);
    const url = `${this.apiUrl}/${id}`;
    console.log('[BankCompanyService] Deleting:', id);
    return this.http.delete<any>(url).pipe(
      tap((response) => {
        // Check for logical error in response (even if HTTP status is 200)
        if (response && (response.state === 'FAIL' || response.success === false || response.statusCode === 500)) {
          console.error('[BankCompanyService] Logical error in delete response:', response);
          throw new Error(response.message || 'Delete failed');
        }
        console.log('[BankCompanyService] Deleted:', id);
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


