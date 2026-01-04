/**
 * QR Code Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  QRCode,
  QRCodeGenerateRequest,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapQrCodeService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/qr-codes';
  }

  /**
   * Get all QR codes (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<QRCode>> {
    return this.getPaginated<QRCode>('', params);
  }

  /**
   * Get QR code by ID
   */
  getById(qrCodeId: string): Observable<QRCode> {
    return this.get<QRCode>(`/${qrCodeId}`);
  }

  /**
   * Generate QR Code
   */
  generate(data: QRCodeGenerateRequest): Observable<QRCode> {
    return this.post<QRCode>('/generate', data);
  }

  /**
   * Delete QR code
   */
  override delete(qrCodeId: string): Observable<void> {
    return super.delete(`/${qrCodeId}`);
  }
}

