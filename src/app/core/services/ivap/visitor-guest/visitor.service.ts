/**
 * Visitor Service สำหรับ IVAP Service API
 *
 * All endpoints require company_id in path: /visitors/company/{company_id}
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Visitor,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapVisitorService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/visitors';
  }

  /**
   * Get all visitors for a company (paginated)
   * Endpoint: GET /api/v1/visitors/company/{company_id}
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Visitor>> {
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

    return this.getPaginated<Visitor>(`/company/${companyId}`, queryParams);
  }

  /**
   * Get visitor by ID
   * Endpoint: GET /api/v1/visitors/company/{company_id}/{visitor_id}
   * @param companyIdOrVisitorId - Company ID (string) or Visitor ID (for backward compatibility)
   * @param visitorId - Visitor ID (if first param is companyId)
   */
  getById(companyIdOrVisitorId: string, visitorId?: string): Observable<Visitor> {
    let companyId: string;
    let id: string;

    if (visitorId) {
      companyId = companyIdOrVisitorId;
      id = visitorId;
    } else {
      id = companyIdOrVisitorId;
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.get<Visitor>(`/company/${companyId}/${id}`);
  }

  /**
   * Create visitor
   * Endpoint: POST /api/v1/visitors/company/{company_id}
   * @param companyIdOrData - Company ID (string) or data object (for backward compatibility)
   * @param data - Visitor data (if first param is companyId)
   */
  create(companyIdOrData: string | Partial<Visitor>, data?: Partial<Visitor>): Observable<Visitor> {
    let companyId: string;
    let visitorData: Partial<Visitor>;

    if (typeof companyIdOrData === 'string') {
      companyId = companyIdOrData;
      visitorData = data || {};
    } else {
      visitorData = companyIdOrData;
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.post<Visitor>(`/company/${companyId}`, visitorData);
  }

  /**
   * Update visitor
   * Endpoint: PUT /api/v1/visitors/company/{company_id}/{visitor_id}
   */
  update(companyId: string, visitorId: string, data: Partial<Visitor>): Observable<Visitor> {
    return this.put<Visitor>(`/company/${companyId}/${visitorId}`, data);
  }

  /**
   * Delete visitor
   * Endpoint: DELETE /api/v1/visitors/company/{company_id}/{visitor_id}
   */
  deleteVisitor(companyId: string, visitorId: string): Observable<void> {
    return super.delete(`/company/${companyId}/${visitorId}`);
  }

  /**
   * Check in visitor
   * Endpoint: POST /api/v1/visitors/company/{company_id}/{visitor_id}/check-in
   * @param companyIdOrVisitorId - Company ID (string) or Visitor ID (for backward compatibility)
   * @param visitorIdOrData - Visitor ID (string) or data object (if first param is companyId)
   * @param data - Optional check-in data (if first two params are IDs)
   */
  checkIn(companyIdOrVisitorId: string, visitorIdOrData?: string | { check_in_time?: string; location?: string; notes?: string }, data?: { check_in_time?: string; location?: string; notes?: string }): Observable<Visitor> {
    let companyId: string;
    let visitorId: string;
    let checkInData: { check_in_time?: string; location?: string; notes?: string } | undefined;

    if (visitorIdOrData && typeof visitorIdOrData === 'string') {
      companyId = companyIdOrVisitorId;
      visitorId = visitorIdOrData;
      checkInData = data;
    } else {
      visitorId = companyIdOrVisitorId;
      companyId = localStorage.getItem('current_company_id') || 'default';
      checkInData = visitorIdOrData as { check_in_time?: string; location?: string; notes?: string } | undefined;
    }

    return this.post<Visitor>(`/company/${companyId}/${visitorId}/check-in`, checkInData || {});
  }

  /**
   * Check out visitor
   * Endpoint: POST /api/v1/visitors/company/{company_id}/{visitor_id}/check-out
   * @param companyIdOrVisitorId - Company ID (string) or Visitor ID (for backward compatibility)
   * @param visitorIdOrData - Visitor ID (string) or data object (if first param is companyId)
   * @param data - Optional check-out data (if first two params are IDs)
   */
  checkOut(companyIdOrVisitorId: string, visitorIdOrData?: string | { check_out_time?: string; notes?: string }, data?: { check_out_time?: string; notes?: string }): Observable<Visitor> {
    let companyId: string;
    let visitorId: string;
    let checkOutData: { check_out_time?: string; notes?: string } | undefined;

    if (visitorIdOrData && typeof visitorIdOrData === 'string') {
      companyId = companyIdOrVisitorId;
      visitorId = visitorIdOrData;
      checkOutData = data;
    } else {
      visitorId = companyIdOrVisitorId;
      companyId = localStorage.getItem('current_company_id') || 'default';
      checkOutData = visitorIdOrData as { check_out_time?: string; notes?: string } | undefined;
    }

    return this.post<Visitor>(`/company/${companyId}/${visitorId}/check-out`, checkOutData || {});
  }

  /**
   * Get visitor visits
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getVisits(companyId: string, visitorId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/company/${companyId}/${visitorId}/visits`, params);
  }

  /**
   * Create visitor invitation
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  createInvitation(companyId: string, visitorId: string, data: any): Observable<any> {
    return this.post(`/company/${companyId}/${visitorId}/invitations`, data);
  }

  /**
   * Get visitor badges
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getBadges(companyId: string, visitorId: string): Observable<any> {
    return this.get(`/company/${companyId}/${visitorId}/badges`);
  }

  /**
   * Get visitor statistics
   * Endpoint: GET /api/v1/visitors/company/{company_id}/statistics
   */
  getStatistics(companyId: string): Observable<any> {
    return this.get(`/company/${companyId}/statistics`);
  }

  /**
   * Export visitors as CSV
   * Endpoint: GET /api/v1/visitors/company/{company_id}/export
   */
  export(companyId: string, params?: QueryParams): Observable<Blob> {
    return this.downloadFile(`/company/${companyId}/export`, params);
  }
}

