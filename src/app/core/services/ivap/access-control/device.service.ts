/**
 * Device Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Device,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapDeviceService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/devices';
  }

  /**
   * Get all devices (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Device>> {
    return this.getPaginated<Device>('', params);
  }

  /**
   * Get device by ID
   */
  getById(deviceId: string): Observable<Device> {
    return this.get<Device>(`/${deviceId}`);
  }

  /**
   * Create device
   */
  create(data: Partial<Device>): Observable<Device> {
    return this.post<Device>('', data);
  }

  /**
   * Update device
   */
  update(deviceId: string, data: Partial<Device>): Observable<Device> {
    return this.put<Device>(`/${deviceId}`, data);
  }

  /**
   * Delete device
   */
  override delete(deviceId: string): Observable<void> {
    return super.delete(`/${deviceId}`);
  }
}

