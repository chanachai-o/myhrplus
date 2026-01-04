/**
 * Vehicle Service สำหรับ IVAP Service API
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
   * Get all vehicles (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Vehicle>> {
    return this.getPaginated<Vehicle>('', params);
  }

  /**
   * Get vehicle by ID
   */
  getById(vehicleId: string): Observable<Vehicle> {
    return this.get<Vehicle>(`/${vehicleId}`);
  }

  /**
   * Create vehicle
   */
  create(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.post<Vehicle>('', data);
  }

  /**
   * Update vehicle
   */
  update(vehicleId: string, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.put<Vehicle>(`/${vehicleId}`, data);
  }

  /**
   * Delete vehicle
   */
  override delete(vehicleId: string): Observable<void> {
    return super.delete(`/${vehicleId}`);
  }

  /**
   * Check in vehicle
   */
  checkIn(vehicleId: string): Observable<Vehicle> {
    return this.post<Vehicle>(`/${vehicleId}/check-in`, {});
  }

  /**
   * Check out vehicle
   */
  checkOut(vehicleId: string): Observable<Vehicle> {
    return this.post<Vehicle>(`/${vehicleId}/check-out`, {});
  }

  /**
   * Get vehicle access logs
   */
  getAccessLogs(vehicleId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${vehicleId}/access-logs`, params);
  }
}

