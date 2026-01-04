/**
 * Device Service สำหรับ IVAP Service API
 * 
 * Base endpoint: /devices
 * Most endpoints require companyId in path or query params
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
   * Get all devices for a company (paginated)
   * Endpoint: GET /api/v1/devices/company/{companyId}/devices
   * @param companyId - Company ID (optional, will be extracted from params if not provided)
   * @param params - Query parameters (may contain company_id)
   */
  getAll(companyIdOrParams?: string | QueryParams, params?: QueryParams): Observable<PaginatedResponse<Device>> {
    // Backward compatibility: support both getAll(params) and getAll(companyId, params)
    let companyId: string | undefined;
    let queryParams: QueryParams | undefined;

    if (typeof companyIdOrParams === 'string') {
      companyId = companyIdOrParams;
      queryParams = params;
    } else {
      queryParams = companyIdOrParams;
      // Try to get companyId from params
      companyId = queryParams?.['company_id'] as string;
    }

    if (!companyId) {
      // Fallback: try to get from localStorage or use default
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.getPaginated<Device>(`/company/${companyId}/devices`, queryParams);
  }

  /**
   * Get device by ID
   * Endpoint: GET /api/v1/devices/{deviceId}?companyId={companyId}
   */
  getById(deviceId: string, companyId: string): Observable<Device> {
    const params = this.buildParams({ companyId });
    return this.get<Device>(`/${deviceId}`, params);
  }

  /**
   * Create device
   * Endpoint: POST /api/v1/devices/company/{companyId}/devices
   * @param companyIdOrData - Company ID (string) or data object (for backward compatibility)
   * @param data - Device data (if first param is companyId)
   */
  create(companyIdOrData: string | Partial<Device>, data?: Partial<Device>): Observable<Device> {
    let companyId: string;
    let deviceData: Partial<Device>;

    if (typeof companyIdOrData === 'string') {
      companyId = companyIdOrData;
      deviceData = data || {};
    } else {
      deviceData = companyIdOrData;
      companyId = localStorage.getItem('current_company_id') || 'default';
    }

    return this.post<Device>(`/company/${companyId}/devices`, deviceData);
  }

  /**
   * Update device
   * Endpoint: PUT /api/v1/devices/{deviceId}?companyId={companyId}
   * Alternative: PUT /api/v1/devices/company/{companyId}/devices/{deviceId}
   */
  update(deviceId: string, companyId: string, data: Partial<Device>): Observable<Device> {
    const params = this.buildParams({ companyId });
    const url = this.getUrl(`/${deviceId}`);
    const headers = this.getHeaders();
    return this.http.put<Device>(url, data, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Delete device
   * Endpoint: DELETE /api/v1/devices/{deviceId}?companyId={companyId}
   * Alternative: DELETE /api/v1/devices/company/{companyId}/devices/{deviceId}
   */
  deleteDevice(deviceId: string, companyId: string): Observable<void> {
    const params = this.buildParams({ companyId });
    return super.delete(`/${deviceId}`, params);
  }

  /**
   * Get device API key (Public - for kiosk devices)
   * Endpoint: GET /api/v1/devices/devices/{deviceId}/key
   */
  getApiKey(deviceId: string): Observable<any> {
    const url = this.getUrl(`/devices/${deviceId}/key`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get device API key (Admin - requires auth)
   * Endpoint: GET /api/v1/devices/company/{companyId}/devices/{deviceId}/key
   */
  getApiKeyAdmin(companyId: string, deviceId: string): Observable<any> {
    return this.get(`/company/${companyId}/devices/${deviceId}/key`);
  }

  /**
   * Regenerate device API key
   * Endpoint: POST /api/v1/devices/{deviceId}/regenerate-key?companyId={companyId}
   */
  regenerateKey(deviceId: string, companyId: string): Observable<Device> {
    const params = this.buildParams({ companyId });
    const url = this.getUrl(`/${deviceId}/regenerate-key`);
    const headers = this.getHeaders();
    return this.http.post<Device>(url, {}, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Link device to event (for kiosk)
   * Endpoint: POST /api/v1/devices/{deviceId}/link-event
   */
  linkEvent(deviceId: string, eventId: string | null): Observable<any> {
    return this.post(`/${deviceId}/link-event`, { eventId });
  }

  /**
   * Get device statistics
   * Endpoint: GET /api/v1/devices/company/{companyId}/devices/statistics
   */
  getStatistics(companyId: string): Observable<any> {
    return this.get(`/company/${companyId}/devices/statistics`);
  }

  /**
   * Get device configuration (Public - for kiosk)
   * Endpoint: GET /api/v1/devices/{deviceId}/config
   */
  getConfig(deviceId: string): Observable<any> {
    const url = this.getUrl(`/${deviceId}/config`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Update device configuration (Public - for kiosk)
   * Endpoint: PUT /api/v1/devices/{deviceId}/config
   */
  updateConfig(deviceId: string, config: any): Observable<any> {
    const url = this.getUrl(`/${deviceId}/config`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.put(url, config, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Device heartbeat (Public - for kiosk monitoring)
   * Endpoint: POST /api/v1/devices/{deviceId}/heartbeat
   */
  heartbeat(deviceId: string, data: any): Observable<any> {
    const url = this.getUrl(`/${deviceId}/heartbeat`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(url, data, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}

