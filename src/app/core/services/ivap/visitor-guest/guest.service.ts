/**
 * Guest Service สำหรับ IVAP Service API
 * 
 * All endpoints require company_id in path: /guests/company/{company_id}
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Guest,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapGuestService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/guests';
  }

  /**
   * Get all guests for a company (paginated)
   * Endpoint: GET /api/v1/guests/company/{company_id}
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Guest>> {
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

    return this.getPaginated<Guest>(`/company/${companyId}`, queryParams);
  }

  /**
   * Get guest by ID
   * Endpoint: GET /api/v1/guests/company/{company_id}/{guest_id}
   */
  getById(companyId: string, guestId: string): Observable<Guest> {
    return this.get<Guest>(`/company/${companyId}/${guestId}`);
  }

  /**
   * Create guest
   * Endpoint: POST /api/v1/guests/company/{company_id}
   * @param companyIdOrData - Company ID (string) or data object (for backward compatibility)
   * @param data - Guest data (if first param is companyId)
   */
  create(companyIdOrData: string | Partial<Guest>, data?: Partial<Guest>): Observable<Guest> {
    let companyId: string;
    let guestData: Partial<Guest>;

    if (typeof companyIdOrData === 'string') {
      companyId = companyIdOrData;
      guestData = data || {};
    } else {
      guestData = companyIdOrData;
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.post<Guest>(`/company/${companyId}`, guestData);
  }

  /**
   * Update guest
   * Endpoint: PUT /api/v1/guests/company/{company_id}/{guest_id}
   */
  update(companyId: string, guestId: string, data: Partial<Guest>): Observable<Guest> {
    return this.put<Guest>(`/company/${companyId}/${guestId}`, data);
  }

  /**
   * Delete guest
   * Endpoint: DELETE /api/v1/guests/company/{company_id}/{guest_id}
   */
  deleteGuest(companyId: string, guestId: string): Observable<void> {
    return super.delete(`/company/${companyId}/${guestId}`);
  }

  /**
   * Check in guest
   * Endpoint: POST /api/v1/guests/company/{company_id}/{guest_id}/check-in
   * @param companyIdOrGuestId - Company ID (string) or Guest ID (for backward compatibility)
   * @param guestIdOrData - Guest ID (string) or data object (if first param is companyId)
   * @param data - Optional check-in data (if first two params are IDs)
   */
  checkIn(companyIdOrGuestId: string, guestIdOrData?: string | { check_in_time?: string; location?: string }, data?: { check_in_time?: string; location?: string }): Observable<Guest> {
    let companyId: string;
    let guestId: string;
    let checkInData: { check_in_time?: string; location?: string } | undefined;

    if (guestIdOrData && typeof guestIdOrData === 'string') {
      companyId = companyIdOrGuestId;
      guestId = guestIdOrData;
      checkInData = data;
    } else {
      guestId = companyIdOrGuestId;
      companyId = localStorage.getItem('current_company_id') || 'default';
      checkInData = guestIdOrData as { check_in_time?: string; location?: string } | undefined;
    }

    return this.post<Guest>(`/company/${companyId}/${guestId}/check-in`, checkInData || {});
  }

  /**
   * Check out guest
   * Endpoint: POST /api/v1/guests/company/{company_id}/{guest_id}/check-out
   * @param companyIdOrGuestId - Company ID (string) or Guest ID (for backward compatibility)
   * @param guestIdOrData - Guest ID (string) or data object (if first param is companyId)
   * @param data - Optional check-out data (if first two params are IDs)
   */
  checkOut(companyIdOrGuestId: string, guestIdOrData?: string | { check_out_time?: string }, data?: { check_out_time?: string }): Observable<Guest> {
    let companyId: string;
    let guestId: string;
    let checkOutData: { check_out_time?: string } | undefined;

    if (guestIdOrData && typeof guestIdOrData === 'string') {
      companyId = companyIdOrGuestId;
      guestId = guestIdOrData;
      checkOutData = data;
    } else {
      guestId = companyIdOrGuestId;
      companyId = localStorage.getItem('current_company_id') || 'default';
      checkOutData = guestIdOrData as { check_out_time?: string } | undefined;
    }

    return this.post<Guest>(`/company/${companyId}/${guestId}/check-out`, checkOutData || {});
  }

  /**
   * Register guest for event (alias for create - backward compatibility)
   * Note: Use create() method instead
   */
  register(companyId: string, data: Partial<Guest>): Observable<Guest> {
    return this.create(companyId, data);
  }

  /**
   * Get guest registrations
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getRegistrations(companyId: string, guestId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/company/${companyId}/${guestId}/registrations`, params);
  }

  /**
   * Get guest statistics
   * Endpoint: GET /api/v1/guests/company/{company_id}/statistics
   */
  getStatistics(companyId: string): Observable<any> {
    return this.get(`/company/${companyId}/statistics`);
  }

  /**
   * Export guests as CSV
   * Endpoint: GET /api/v1/guests/company/{company_id}/export
   */
  export(companyId: string, params?: QueryParams): Observable<Blob> {
    return this.downloadFile(`/company/${companyId}/export`, params);
  }
}

