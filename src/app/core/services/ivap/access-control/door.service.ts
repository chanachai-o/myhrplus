/**
 * Door Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Door,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapDoorService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/doors';
  }

  /**
   * Get all doors (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Door>> {
    return this.getPaginated<Door>('', params);
  }

  /**
   * Get door by ID
   */
  getById(doorId: string): Observable<Door> {
    return this.get<Door>(`/${doorId}`);
  }

  /**
   * Create door
   */
  create(data: Partial<Door>): Observable<Door> {
    return this.post<Door>('', data);
  }

  /**
   * Update door
   */
  update(doorId: string, data: Partial<Door>): Observable<Door> {
    return this.put<Door>(`/${doorId}`, data);
  }

  /**
   * Delete door
   */
  override delete(doorId: string): Observable<void> {
    return super.delete(`/${doorId}`);
  }
}

