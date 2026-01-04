/**
 * Analytics Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  AnalyticsResponse,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapAnalyticsService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/analytics';
  }

  /**
   * Get analytics data
   */
  getAnalytics(params?: QueryParams): Observable<AnalyticsResponse> {
    return this.get<AnalyticsResponse>('', params);
  }

  /**
   * Get analytics reports
   */
  getReports(params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated('/reports', params);
  }

  /**
   * Generate analytics report
   */
  generateReport(data: any): Observable<any> {
    return this.post('/reports', data);
  }

  /**
   * Get specific metrics
   */
  getMetrics(metricType: string, params?: QueryParams): Observable<any> {
    return this.get(`/metrics/${metricType}`, params);
  }
}

