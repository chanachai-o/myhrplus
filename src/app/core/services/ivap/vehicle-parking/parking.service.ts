/**
 * Parking Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  ParkingRecord,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapParkingService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/parking';
  }

  /**
   * Get all parking records (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<ParkingRecord>> {
    return this.getPaginated<ParkingRecord>('', params);
  }

  /**
   * Get parking record by ID
   */
  getById(parkingId: string): Observable<ParkingRecord> {
    return this.get<ParkingRecord>(`/${parkingId}`);
  }

  /**
   * Create parking record
   */
  create(data: Partial<ParkingRecord>): Observable<ParkingRecord> {
    return this.post<ParkingRecord>('', data);
  }

  /**
   * Update parking record
   */
  update(parkingId: string, data: Partial<ParkingRecord>): Observable<ParkingRecord> {
    return this.put<ParkingRecord>(`/${parkingId}`, data);
  }

  /**
   * Exit parking (check out)
   */
  exit(parkingId: string): Observable<ParkingRecord> {
    return this.post<ParkingRecord>(`/${parkingId}/exit`, {});
  }
}

