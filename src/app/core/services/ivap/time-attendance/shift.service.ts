/**
 * Shift Service สำหรับ IVAP Service API
 * 
 * All endpoints require company_id in path: /shifts/company/{company_id}/shifts
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Shift,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapShiftService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/shifts';
  }

  /**
   * Get all shifts for a company
   * Endpoint: GET /api/v1/shifts/company/{company_id}/shifts
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Shift>> {
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

    return this.getPaginated<Shift>(`/company/${companyId}/shifts`, queryParams);
  }

  /**
   * Get shift by ID
   * Endpoint: GET /api/v1/shifts/company/{company_id}/shifts/{shift_id}
   */
  getById(companyId: string, shiftId: string): Observable<Shift> {
    return this.get<Shift>(`/company/${companyId}/shifts/${shiftId}`);
  }

  /**
   * Create shift
   * Endpoint: POST /api/v1/shifts/company/{company_id}/shifts
   */
  create(companyId: string, data: Partial<Shift>): Observable<Shift> {
    return this.post<Shift>(`/company/${companyId}/shifts`, data);
  }

  /**
   * Update shift
   * Endpoint: PUT /api/v1/shifts/company/{company_id}/shifts/{shift_id}
   */
  update(companyId: string, shiftId: string, data: Partial<Shift>): Observable<Shift> {
    return this.put<Shift>(`/company/${companyId}/shifts/${shiftId}`, data);
  }

  /**
   * Delete shift
   * Endpoint: DELETE /api/v1/shifts/company/{company_id}/shifts/{shift_id}
   */
  deleteShift(companyId: string, shiftId: string): Observable<void> {
    return super.delete(`/company/${companyId}/shifts/${shiftId}`);
  }

  /**
   * Assign shift to employee
   * Endpoint: POST /api/v1/shifts/company/{company_id}/shifts/user-shifts
   */
  assign(companyId: string, data: { company_employeeId: string; shiftId: string }): Observable<any> {
    return this.post(`/company/${companyId}/shifts/user-shifts`, data);
  }

  /**
   * Unassign shift from employee
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  unassign(companyId: string, data: any): Observable<any> {
    return this.post(`/company/${companyId}/shifts/user-shifts/unassign`, data);
  }

  /**
   * Get shift assignments
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getAssignments(companyId: string, shiftId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/company/${companyId}/shifts/${shiftId}/assignments`, params);
  }
}

