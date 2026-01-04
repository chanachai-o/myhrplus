/**
 * Timestamp Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  EmployeeTimestamp,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapTimestampService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/timestamps';
  }

  /**
   * Get all timestamps (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<EmployeeTimestamp>> {
    return this.getPaginated<EmployeeTimestamp>('', params);
  }

  /**
   * Get timestamp by ID
   */
  getById(timestampId: string): Observable<EmployeeTimestamp> {
    return this.get<EmployeeTimestamp>(`/${timestampId}`);
  }

  /**
   * Create timestamp (check-in/check-out)
   */
  create(data: Partial<EmployeeTimestamp>): Observable<EmployeeTimestamp> {
    return this.post<EmployeeTimestamp>('', data);
  }
}

