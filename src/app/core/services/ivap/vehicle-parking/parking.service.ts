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

  /**
   * Parking entry (LPR - License Plate Recognition)
   */
  entry(data: any): Observable<ParkingRecord> {
    return this.post<ParkingRecord>('/entry', data);
  }

  /**
   * Parking exit (LPR)
   */
  exitLpr(data: any): Observable<ParkingRecord> {
    return this.post<ParkingRecord>('/exit', data);
  }

  /**
   * Get parking spaces
   */
  getSpaces(params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated('/spaces', params);
  }

  /**
   * Get parking statistics
   */
  getStatistics(params?: QueryParams): Observable<any> {
    return this.get('/statistics', params);
  }
}

