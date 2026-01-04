/**
 * Event Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Event,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapEventService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/events';
  }

  /**
   * Get all events (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Event>> {
    return this.getPaginated<Event>('', params);
  }

  /**
   * Get event by ID
   */
  getById(eventId: string): Observable<Event> {
    return this.get<Event>(`/${eventId}`);
  }

  /**
   * Create event
   */
  create(data: Partial<Event>): Observable<Event> {
    return this.post<Event>('', data);
  }

  /**
   * Update event
   */
  update(eventId: string, data: Partial<Event>): Observable<Event> {
    return this.put<Event>(`/${eventId}`, data);
  }

  /**
   * Delete event
   */
  override delete(eventId: string): Observable<void> {
    return super.delete(`/${eventId}`);
  }

  /**
   * Register for event
   */
  register(eventId: string, data: any): Observable<any> {
    return this.post(`/${eventId}/register`, data);
  }

  /**
   * Get event registrations
   */
  getRegistrations(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${eventId}/registrations`, params);
  }

  /**
   * Get event participants
   */
  getParticipants(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${eventId}/participants`, params);
  }

  /**
   * Publish event
   */
  publish(eventId: string): Observable<Event> {
    return this.post<Event>(`/${eventId}/publish`, {});
  }

  /**
   * Cancel event
   */
  cancel(eventId: string, reason?: string): Observable<Event> {
    return this.post<Event>(`/${eventId}/cancel`, { reason });
  }
}

