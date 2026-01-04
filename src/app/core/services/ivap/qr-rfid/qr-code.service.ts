/**
 * QR Code Service สำหรับ IVAP Service API
 * 
 * Base endpoint: /qr-codes
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
   * Endpoint: GET /api/v1/qr-codes
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<QRCode>> {
    return this.getPaginated<QRCode>('', params);
  }

  /**
   * Get QR code by ID
   * Endpoint: GET /api/v1/qr-codes/{qr_code_id}
   */
  getById(qrCodeId: string): Observable<QRCode> {
    return this.get<QRCode>(`/${qrCodeId}`);
  }

  /**
   * Get QR code by data value
   * Endpoint: GET /api/v1/qr-codes/data/{qr_data_value}
   */
  getByData(qrData: string): Observable<QRCode> {
    return this.get<QRCode>(`/data/${qrData}`);
  }

  /**
   * Create QR code
   * Endpoint: POST /api/v1/qr-codes
   */
  create(data: Partial<QRCode>): Observable<QRCode> {
    return this.post<QRCode>('', data);
  }

  /**
   * Update QR code
   * Endpoint: PUT /api/v1/qr-codes/{qr_code_id}
   */
  update(qrCodeId: string, data: Partial<QRCode>): Observable<QRCode> {
    return this.put<QRCode>(`/${qrCodeId}`, data);
  }

  /**
   * Generate QR Code
   * Endpoint: POST /api/v1/qr-codes/generate
   */
  generate(data: QRCodeGenerateRequest): Observable<QRCode> {
    return this.post<QRCode>('/generate', data);
  }

  /**
   * Delete QR code
   * Endpoint: DELETE /api/v1/qr-codes/{qr_code_id}
   */
  deleteQrCode(qrCodeId: string): Observable<void> {
    return super.delete(`/${qrCodeId}`);
  }

  /**
   * Verify QR code
   * Endpoint: POST /api/v1/qr-codes/verify
   */
  verify(data: { qr_data: string; door_id: string }): Observable<any> {
    return this.post('/verify', data);
  }

  /**
   * Generate QR code image (PNG)
   * Endpoint: GET /api/v1/qr-codes/generate-image?qr_data={qr_data}
   */
  generateImage(qrData: string): Observable<Blob> {
    const params = this.buildParams({ qr_data: qrData });
    return this.downloadFile('/generate-image', params);
  }

  /**
   * Get QR code statistics
   * Endpoint: GET /api/v1/qr-codes/statistics
   */
  getStatistics(): Observable<any> {
    return this.get('/statistics');
  }

  /**
   * Get QR code types
   * Endpoint: GET /api/v1/qr-codes/types
   */
  getTypes(): Observable<string[]> {
    return this.get<string[]>('/types');
  }

  /**
   * Update QR code status
   * Endpoint: PATCH /api/v1/qr-codes/{qr_code_id}/status
   */
  updateStatus(qrCodeId: string, newStatus: string): Observable<QRCode> {
    return this.patch<QRCode>(`/${qrCodeId}/status`, { new_status: newStatus });
  }

  /**
   * Update QR code authorization
   * Endpoint: PATCH /api/v1/qr-codes/{qr_code_id}/authorization
   */
  updateAuthorization(qrCodeId: string, isAuthorized: boolean): Observable<QRCode> {
    return this.patch<QRCode>(`/${qrCodeId}/authorization`, { is_authorized: isAuthorized });
  }

  /**
   * Import QR codes from CSV
   * Endpoint: POST /api/v1/qr-codes/import
   */
  import(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.postFormData('/import', formData);
  }

  /**
   * Export QR codes as CSV
   * Endpoint: GET /api/v1/qr-codes/export
   */
  export(params?: QueryParams): Observable<Blob> {
    return this.downloadFile('/export', params);
  }
}

