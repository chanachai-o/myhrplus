/**
 * RFID Card Service สำหรับ IVAP Service API
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
    this.endpoint = '/verification/rfid-card';
  }

  /**
   * Get all RFID cards (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<RFIDCard>> {
    return this.getPaginated<RFIDCard>('', params);
  }

  /**
   * Get RFID card by ID
   */
  getById(rfidCardId: string): Observable<RFIDCard> {
    return this.get<RFIDCard>(`/${rfidCardId}`);
  }

  /**
   * Create RFID card
   */
  create(data: Partial<RFIDCard>): Observable<RFIDCard> {
    return this.post<RFIDCard>('', data);
  }

  /**
   * Update RFID card
   */
  update(rfidCardId: string, data: Partial<RFIDCard>): Observable<RFIDCard> {
    return this.put<RFIDCard>(`/${rfidCardId}`, data);
  }

  /**
   * Delete RFID card
   */
  override delete(rfidCardId: string): Observable<void> {
    return super.delete(`/${rfidCardId}`);
  }
}

