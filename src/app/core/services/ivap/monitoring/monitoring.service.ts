/**
 * Monitoring Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  SystemHealth
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
}

