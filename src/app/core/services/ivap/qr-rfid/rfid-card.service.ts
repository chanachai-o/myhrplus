/**
 * RFID Card Service สำหรับ IVAP Service API
 *
 * Base endpoint: /rfid-cards
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  RFIDCard,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapRfidCardService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/rfid-cards';
  }

  /**
   * Get all RFID cards (paginated)
   * Endpoint: GET /api/v1/rfid-cards
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<RFIDCard>> {
    return this.getPaginated<RFIDCard>('', params);
  }

  /**
   * Get RFID card by ID
   * Endpoint: GET /api/v1/rfid-cards/{rfid_card_id}
   */
  getById(rfidCardId: string): Observable<RFIDCard> {
    return this.get<RFIDCard>(`/${rfidCardId}`);
  }

  /**
   * Get RFID card by card number
   * Endpoint: GET /api/v1/rfid-cards/number/{card_number}
   */
  getByNumber(cardNumber: string): Observable<RFIDCard> {
    return this.get<RFIDCard>(`/number/${cardNumber}`);
  }

  /**
   * Create RFID card
   * Endpoint: POST /api/v1/rfid-cards
   */
  create(data: Partial<RFIDCard>): Observable<RFIDCard> {
    return this.post<RFIDCard>('', data);
  }

  /**
   * Update RFID card
   * Endpoint: PUT /api/v1/rfid-cards/{rfid_card_id}
   */
  update(rfidCardId: string, data: Partial<RFIDCard>): Observable<RFIDCard> {
    return this.put<RFIDCard>(`/${rfidCardId}`, data);
  }

  /**
   * Delete RFID card
   * Endpoint: DELETE /api/v1/rfid-cards/{rfid_card_id}
   */
  deleteRfidCard(rfidCardId: string): Observable<void> {
    return super.delete(`/${rfidCardId}`);
  }

  /**
   * Verify RFID card
   * Endpoint: POST /api/v1/rfid-cards/verify
   */
  verify(data: { card_number: string; door_id: string }): Observable<any> {
    return this.post('/verify', data);
  }

  /**
   * Get RFID card statistics
   * Endpoint: GET /api/v1/rfid-cards/statistics
   */
  getStatistics(): Observable<any> {
    return this.get('/statistics');
  }

  /**
   * Get RFID card types
   * Endpoint: GET /api/v1/rfid-cards/types
   */
  getTypes(): Observable<string[]> {
    return this.get<string[]>('/types');
  }

  /**
   * Update RFID card status
   * Endpoint: PATCH /api/v1/rfid-cards/{rfid_card_id}/status
   */
  updateStatus(rfidCardId: string, newStatus: string): Observable<RFIDCard> {
    return this.patch<RFIDCard>(`/${rfidCardId}/status`, { new_status: newStatus });
  }

  /**
   * Update RFID card authorization
   * Endpoint: PATCH /api/v1/rfid-cards/{rfid_card_id}/authorization
   */
  updateAuthorization(rfidCardId: string, isAuthorized: boolean): Observable<RFIDCard> {
    return this.patch<RFIDCard>(`/${rfidCardId}/authorization`, { is_authorized: isAuthorized });
  }

  /**
   * Import RFID cards from CSV
   * Endpoint: POST /api/v1/rfid-cards/import
   */
  import(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.postFormData('/import', formData);
  }

  /**
   * Export RFID cards as CSV
   * Endpoint: GET /api/v1/rfid-cards/export
   */
  export(params?: QueryParams): Observable<Blob> {
    return this.downloadFile('/export', params);
  }
}

