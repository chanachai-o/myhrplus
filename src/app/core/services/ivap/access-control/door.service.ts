/**
 * Door Service สำหรับ IVAP Service API
 *
 * All endpoints require company_id in path: /doors/company/{company_id}/doors
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Door,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapDoorService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/doors';
  }

  /**
   * Get all doors for a company
   * Endpoint: GET /api/v1/doors/company/{company_id}/doors
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Door>> {
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

    return this.getPaginated<Door>(`/company/${companyId}/doors`, queryParams);
  }

  /**
   * Get door by ID
   * Endpoint: GET /api/v1/doors/company/{company_id}/doors/{door_id}
   */
  getById(companyId: string, doorId: string): Observable<Door> {
    return this.get<Door>(`/company/${companyId}/doors/${doorId}`);
  }

  /**
   * Create door
   * Endpoint: POST /api/v1/doors/company/{company_id}/doors
   */
  create(companyId: string, data: Partial<Door>): Observable<Door> {
    return this.post<Door>(`/company/${companyId}/doors`, data);
  }

  /**
   * Update door
   * Endpoint: PUT /api/v1/doors/company/{company_id}/doors/{door_id}
   */
  update(companyId: string, doorId: string, data: Partial<Door>): Observable<Door> {
    return this.put<Door>(`/company/${companyId}/doors/${doorId}`, data);
  }

  /**
   * Delete door
   * Endpoint: DELETE /api/v1/doors/company/{company_id}/doors/{door_id}
   */
  deleteDoor(companyId: string, doorId: string): Observable<void> {
    return super.delete(`/company/${companyId}/doors/${doorId}`);
  }

  /**
   * Get door permissions
   * Endpoint: GET /api/v1/doors/company/{company_id}/doors/{door_id}/permissions
   */
  getPermissions(companyId: string, doorId: string): Observable<any[]> {
    return this.get<any[]>(`/company/${companyId}/doors/${doorId}/permissions`);
  }

  /**
   * Grant door permission
   * Endpoint: POST /api/v1/doors/company/{company_id}/doors/permissions
   */
  grantAccess(companyId: string, data: {
    company_employee_id: string;
    door_id: string;
    access_type: string;
    valid_from?: string;
    valid_until?: string;
  }): Observable<any> {
    return this.post(`/company/${companyId}/doors/permissions`, data);
  }

  /**
   * Revoke door permission
   * Endpoint: DELETE /api/v1/doors/company/{company_id}/doors/permissions/{permission_id}
   */
  revokeAccess(companyId: string, permissionId: string): Observable<void> {
    return super.delete(`/company/${companyId}/doors/permissions/${permissionId}`);
  }

  /**
   * Get door access logs
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getAccessLogs(companyId: string, doorId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/company/${companyId}/doors/${doorId}/access-logs`, params);
  }
}

