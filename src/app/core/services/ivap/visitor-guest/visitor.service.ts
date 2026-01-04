/**
 * Visitor Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Visitor,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapVisitorService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/visitors';
  }

  /**
   * Get all visitors (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Visitor>> {
    return this.getPaginated<Visitor>('', params);
  }

  /**
   * Get visitor by ID
   */
  getById(visitorId: string): Observable<Visitor> {
    return this.get<Visitor>(`/${visitorId}`);
  }

  /**
   * Create visitor
   */
  create(data: Partial<Visitor>): Observable<Visitor> {
    return this.post<Visitor>('', data);
  }

  /**
   * Update visitor
   */
  update(visitorId: string, data: Partial<Visitor>): Observable<Visitor> {
    return this.put<Visitor>(`/${visitorId}`, data);
  }

  /**
   * Check in visitor
   */
  checkIn(visitorId: string): Observable<Visitor> {
    return this.post<Visitor>(`/${visitorId}/check-in`, {});
  }

  /**
   * Check out visitor
   */
  checkOut(visitorId: string): Observable<Visitor> {
    return this.post<Visitor>(`/${visitorId}/check-out`, {});
  }
}

