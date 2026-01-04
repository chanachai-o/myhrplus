/**
 * Dashboard Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  DashboardResponse
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapDashboardService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/dashboard';
  }

  /**
   * Get dashboard data
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.get<DashboardResponse>('');
  }
}

