/**
 * Event Service สำหรับ IVAP Service API
 * 
 * Base endpoint: /events
 * Some endpoints are public (no auth required)
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  // ============================================================================
  // Admin Endpoints (Require Auth)
  // ============================================================================

  /**
   * Get all events (paginated)
   * Endpoint: GET /api/v1/events
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Event>> {
    return this.getPaginated<Event>('', params);
  }

  /**
   * Get event by ID
   * Endpoint: GET /api/v1/events/{event_id}
   */
  getById(eventId: string): Observable<Event> {
    return this.get<Event>(`/${eventId}`);
  }

  /**
   * Create event
   * Endpoint: POST /api/v1/events
   */
  create(data: Partial<Event>): Observable<Event> {
    return this.post<Event>('', data);
  }

  /**
   * Update event
   * Endpoint: PUT /api/v1/events/{event_id}
   */
  update(eventId: string, data: Partial<Event>): Observable<Event> {
    return this.put<Event>(`/${eventId}`, data);
  }

  /**
   * Delete event
   * Endpoint: DELETE /api/v1/events/{event_id}
   */
  deleteEvent(eventId: string): Observable<void> {
    return super.delete(`/${eventId}`);
  }

  /**
   * Publish event
   * Endpoint: POST /api/v1/events/{event_id}/publish
   */
  publish(eventId: string): Observable<Event> {
    return this.post<Event>(`/${eventId}/publish`, {});
  }

  /**
   * Cancel event
   * Endpoint: POST /api/v1/events/{event_id}/cancel
   */
  cancel(eventId: string, reason?: string): Observable<Event> {
    return this.post<Event>(`/${eventId}/cancel`, { reason });
  }

  /**
   * Get event attendees
   * Endpoint: GET /api/v1/events/{event_id}/attendees
   */
  getAttendees(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${eventId}/attendees`, params);
  }

  /**
   * Get event participants (alias for getAttendees - backward compatibility)
   */
  getParticipants(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getAttendees(eventId, params);
  }

  /**
   * Get event registrations
   * Note: This endpoint may not exist in API, keeping for backward compatibility
   */
  getRegistrations(eventId: string, params?: QueryParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(`/${eventId}/registrations`, params);
  }

  /**
   * Get event linked devices
   * Endpoint: GET /api/v1/events/{event_id}/devices
   */
  getLinkedDevices(eventId: string): Observable<any[]> {
    return this.get<any[]>(`/${eventId}/devices`);
  }

  /**
   * Add attendee to event (manual)
   * Endpoint: POST /api/v1/events/attendees
   */
  addAttendee(data: { event_id: string; member_id: string; registration_type: string }): Observable<any> {
    return this.post('/attendees', data);
  }

  /**
   * Get event statistics
   * Endpoint: GET /api/v1/events/{event_id}/statistics
   */
  getStatistics(eventId: string): Observable<any> {
    return this.get(`/${eventId}/statistics`);
  }

  /**
   * Send event reminders
   * Endpoint: POST /api/v1/events/{event_id}/send-reminders
   */
  sendReminders(eventId: string, data: { reminder_type: string; message: string; send_to_all: boolean }): Observable<any> {
    return this.post(`/${eventId}/send-reminders`, data);
  }

  // ============================================================================
  // Public Endpoints (No Auth Required)
  // ============================================================================

  /**
   * Get public event details
   * Endpoint: GET /api/v1/events/public/details/{public_url}
   */
  getPublicDetails(publicUrl: string): Observable<Event> {
    const url = this.getUrl(`/public/details/${publicUrl}`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<Event>(url, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Public event registration
   * Endpoint: POST /api/v1/events/public/register/{public_url}
   */
  publicRegister(publicUrl: string, data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    company_name?: string;
    dietary_requirements?: string;
    special_requests?: string;
  }): Observable<any> {
    const url = this.getUrl(`/public/register/${publicUrl}`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(url, data, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Confirm registration email
   * Endpoint: POST /api/v1/events/public/register/{public_url}/confirm-email?token={token}
   */
  confirmEmail(publicUrl: string, token: string): Observable<any> {
    const url = this.getUrl(`/public/register/${publicUrl}/confirm-email`);
    const params = this.buildParams({ token });
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(url, {}, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get public event QR code
   * Endpoint: GET /api/v1/events/public/{public_url}/qr-code
   */
  getPublicQrCode(publicUrl: string): Observable<any> {
    const url = this.getUrl(`/public/${publicUrl}/qr-code`);
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get(url, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Check check-in status
   * Endpoint: GET /api/v1/events/public/{public_url}/check-status?email={email}
   */
  checkStatus(publicUrl: string, email: string): Observable<any> {
    const url = this.getUrl(`/public/${publicUrl}/check-status`);
    const params = this.buildParams({ email });
    // Public endpoint - no auth required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get(url, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // ============================================================================
  // Kiosk Endpoints (Public - No Auth Required, but requires API Key)
  // ============================================================================

  /**
   * Event check-in via kiosk (single person)
   * Endpoint: POST /api/v1/events/kiosk/check-in?api_key={api_key}
   */
  kioskCheckIn(apiKey: string, formData: FormData): Observable<any> {
    const url = this.getUrl('/kiosk/check-in');
    const params = this.buildParams({ api_key: apiKey });
    // Public endpoint - no auth required, but needs API key
    const headers = new HttpHeaders();
    return this.http.post(url, formData, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Event check-in via kiosk (multiple people)
   * Endpoint: POST /api/v1/events/kiosk/check-in-many?api_key={api_key}
   */
  kioskCheckInMany(apiKey: string, formData: FormData): Observable<any> {
    const url = this.getUrl('/kiosk/check-in-many');
    const params = this.buildParams({ api_key: apiKey });
    // Public endpoint - no auth required, but needs API key
    const headers = new HttpHeaders();
    return this.http.post(url, formData, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Register for event (alias - backward compatibility)
   * Note: Use publicRegister() for public registration
   */
  register(eventId: string, data: any): Observable<any> {
    return this.post(`/${eventId}/register`, data);
  }
}

