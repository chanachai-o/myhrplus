/**
 * Guest Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Guest,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapGuestService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/guests';
  }

  /**
   * Get all guests (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Guest>> {
    return this.getPaginated<Guest>('', params);
  }

  /**
   * Get guest by ID
   */
  getById(guestId: string): Observable<Guest> {
    return this.get<Guest>(`/${guestId}`);
  }

  /**
   * Create guest
   */
  create(data: Partial<Guest>): Observable<Guest> {
    return this.post<Guest>('', data);
  }

  /**
   * Update guest
   */
  update(guestId: string, data: Partial<Guest>): Observable<Guest> {
    return this.put<Guest>(`/${guestId}`, data);
  }

  /**
   * Check in guest
   */
  checkIn(guestId: string): Observable<Guest> {
    return this.post<Guest>(`/${guestId}/check-in`, {});
  }

  /**
   * Check out guest
   */
  checkOut(guestId: string): Observable<Guest> {
    return this.post<Guest>(`/${guestId}/check-out`, {});
  }

  /**
   * Register guest for event
   */
  register(data: Partial<Guest>): Observable<Guest> {
    return this.post<Guest>('/register', data);
  }

  /**
   * Get guest registrations
   */
  getRegistrations(guestId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${guestId}/registrations`, params);
  }
}

