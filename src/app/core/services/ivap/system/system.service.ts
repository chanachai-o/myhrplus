/**
 * System Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class IvapSystemService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/system';
  }

  /**
   * Get system settings
   */
  getSettings(): Observable<Record<string, any>> {
    return this.get<Record<string, any>>('/settings');
  }

  /**
   * Update system settings
   */
  updateSettings(settings: Record<string, any>): Observable<Record<string, any>> {
    return this.put<Record<string, any>>('/settings', settings);
  }
}

