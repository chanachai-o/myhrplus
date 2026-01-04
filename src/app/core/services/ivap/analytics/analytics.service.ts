/**
 * Analytics Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  AnalyticsResponse,
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
}

