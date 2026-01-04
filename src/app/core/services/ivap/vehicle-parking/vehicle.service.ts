/**
 * Vehicle Service สำหรับ IVAP Service API
 * 
 * All endpoints require company_id in path: /vehicles/company/{company_id}
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Vehicle,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapVehicleService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/vehicles';
  }

  /**
   * Get all vehicles for a company (paginated)
   * Endpoint: GET /api/v1/vehicles/company/{company_id}
   * @param companyIdOrParams - Company ID (string) or QueryParams (for backward compatibility)
   * @param params - Query parameters (if first param is companyId)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Vehicle>> {
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

    return this.getPaginated<Vehicle>(`/company/${companyId}`, queryParams);
  }

  /**
   * Get vehicle by ID
   * Endpoint: GET /api/v1/vehicles/company/{company_id}/{vehicle_id}
   */
  getById(companyId: string, vehicleId: string): Observable<Vehicle> {
    return this.get<Vehicle>(`/company/${companyId}/${vehicleId}`);
  }

  /**
   * Create vehicle
   * Endpoint: POST /api/v1/vehicles/company/{company_id}
   * @param companyIdOrData - Company ID (string) or data object (for backward compatibility)
   * @param data - Vehicle data (if first param is companyId)
   */
  create(companyIdOrData: string | Partial<Vehicle>, data?: Partial<Vehicle>): Observable<Vehicle> {
    let companyId: string;
    let vehicleData: Partial<Vehicle>;

    if (typeof companyIdOrData === 'string') {
      companyId = companyIdOrData;
      vehicleData = data || {};
    } else {
      vehicleData = companyIdOrData;
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.post<Vehicle>(`/company/${companyId}`, vehicleData);
  }

  /**
   * Update vehicle
   * Endpoint: PUT /api/v1/vehicles/company/{company_id}/{vehicle_id}
   */
  update(companyId: string, vehicleId: string, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.put<Vehicle>(`/company/${companyId}/${vehicleId}`, data);
  }

  /**
   * Delete vehicle
   * Endpoint: DELETE /api/v1/vehicles/company/{company_id}/{vehicle_id}
   */
  deleteVehicle(companyId: string, vehicleId: string): Observable<void> {
    return super.delete(`/company/${companyId}/${vehicleId}`);
  }

  /**
   * Check in vehicle
   * Endpoint: POST /api/v1/vehicles/company/{company_id}/{vehicle_id}/check-in
   */
  checkIn(companyId: string, vehicleId: string, data?: { entry_time?: string; parking_slot?: string }): Observable<Vehicle> {
    return this.post<Vehicle>(`/company/${companyId}/${vehicleId}/check-in`, data || {});
  }

  /**
   * Check out vehicle
   * Endpoint: POST /api/v1/vehicles/company/{company_id}/{vehicle_id}/check-out
   */
  checkOut(companyId: string, vehicleId: string, data?: { exit_time?: string }): Observable<Vehicle> {
    return this.post<Vehicle>(`/company/${companyId}/${vehicleId}/check-out`, data || {});
  }

  /**
   * Get vehicle access logs
   * Endpoint: GET /api/v1/vehicles/company/{company_id}/{vehicle_id}/access-logs
   */
  getAccessLogs(companyId: string, vehicleId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/company/${companyId}/${vehicleId}/access-logs`, params);
  }

  /**
   * Assign parking spot to vehicle
   * Endpoint: POST /api/v1/vehicles/company/{company_id}/{vehicle_id}/assign-parking
   */
  assignParking(companyId: string, vehicleId: string, data: { parking_slot: string; reserved_until?: string }): Observable<Vehicle> {
    return this.post<Vehicle>(`/company/${companyId}/${vehicleId}/assign-parking`, data);
  }

  /**
   * Get parking spots
   * Endpoint: GET /api/v1/vehicles/company/{company_id}/parking-spots
   */
  getParkingSpots(companyId: string): Observable<any[]> {
    return this.get<any[]>(`/company/${companyId}/parking-spots`);
  }

  /**
   * Get vehicle statistics
   * Endpoint: GET /api/v1/vehicles/company/{company_id}/statistics
   */
  getStatistics(companyId: string): Observable<any> {
    return this.get(`/company/${companyId}/statistics`);
  }
}

