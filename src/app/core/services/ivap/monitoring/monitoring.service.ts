/**
 * Monitoring Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  SystemHealth,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapMonitoringService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/monitoring';
  }

  /**
   * Get system health
   */
  getHealth(): Observable<SystemHealth> {
    return this.get<SystemHealth>('/health');
  }

  /**
   * Get system metrics
   */
  getMetrics(params?: QueryParams): Observable<any> {
    return this.get('/metrics', params);
  }

  /**
   * Get performance metrics
   */
  getPerformance(params?: QueryParams): Observable<any> {
    return this.get('/performance', params);
  }

  /**
   * Get device status
   */
  getDevices(params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated('/devices', params);
  }
}

