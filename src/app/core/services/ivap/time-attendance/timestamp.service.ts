/**
 * Timestamp Service สำหรับ IVAP Service API
 * 
 * All endpoints require company_id in path: /timestamps/company/{company_id}
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  EmployeeTimestamp,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapTimestampService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/timestamps';
  }

  /**
   * Get all timestamps for a company (paginated)
   * Endpoint: GET /api/v1/timestamps/company/{company_id}
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<EmployeeTimestamp>> {
    let companyId: string | undefined;
    let queryParams: QueryParams | undefined;

    if (typeof companyIdOrParams === 'string') {
      companyId = companyIdOrParams;
      queryParams = params;
    } else {
      queryParams = companyIdOrParams;
      companyId = queryParams?.['company_id'] as string;
    }

    if (!companyId) {
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.getPaginated<EmployeeTimestamp>(`/company/${companyId}`, queryParams);
  }

  /**
   * Get timestamp by ID
   * Endpoint: GET /api/v1/timestamps/company/{company_id}/{timestamp_id}
   */
  getById(companyId: string, timestampId: string): Observable<EmployeeTimestamp> {
    return this.get<EmployeeTimestamp>(`/company/${companyId}/${timestampId}`);
  }

  /**
   * Create timestamp (check-in/check-out)
   * Endpoint: POST /api/v1/timestamps/company/{company_id}
   */
  create(companyId: string, data: Partial<EmployeeTimestamp>): Observable<EmployeeTimestamp> {
    return this.post<EmployeeTimestamp>(`/company/${companyId}`, data);
  }

  /**
   * Update timestamp
   * Endpoint: PUT /api/v1/timestamps/company/{company_id}/{timestamp_id}
   */
  update(companyId: string, timestampId: string, data: Partial<EmployeeTimestamp>): Observable<EmployeeTimestamp> {
    return this.put<EmployeeTimestamp>(`/company/${companyId}/${timestampId}`, data);
  }

  /**
   * Delete timestamp
   * Endpoint: DELETE /api/v1/timestamps/company/{company_id}/{timestamp_id}
   */
  deleteTimestamp(companyId: string, timestampId: string): Observable<void> {
    return super.delete(`/company/${companyId}/${timestampId}`);
  }

  /**
   * Approve timestamp
   * Endpoint: POST /api/v1/timestamps/company/{company_id}/{timestamp_id}/approve
   */
  approve(companyId: string, timestampId: string): Observable<EmployeeTimestamp> {
    return this.post<EmployeeTimestamp>(`/company/${companyId}/${timestampId}/approve`, {});
  }

  /**
   * Reject timestamp
   * Endpoint: POST /api/v1/timestamps/company/{company_id}/{timestamp_id}/reject
   */
  reject(companyId: string, timestampId: string, reason?: string): Observable<EmployeeTimestamp> {
    return this.post<EmployeeTimestamp>(`/company/${companyId}/${timestampId}/reject`, { reason });
  }

  /**
   * Bulk approve timestamps
   * Endpoint: POST /api/v1/timestamps/company/{company_id}/bulk-approve
   */
  bulkApprove(companyId: string, timestampIds: string[]): Observable<any> {
    return this.post(`/company/${companyId}/bulk-approve`, { timestamp_ids: timestampIds });
  }

  /**
   * Export timestamps as CSV
   * Endpoint: GET /api/v1/timestamps/company/{company_id}/export
   */
  export(companyId: string, params?: QueryParams): Observable<Blob> {
    return this.downloadFile(`/company/${companyId}/export`, params);
  }
}

