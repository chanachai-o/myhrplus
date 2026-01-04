/**
 * QR Code Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  QRCode,
  QRCodeGenerateRequest
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapQrCodeService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/verification/qr-code';
  }

  /**
   * Generate QR Code
   */
  generate(data: QRCodeGenerateRequest): Observable<QRCode> {
    return this.post<QRCode>('/generate', data);
  }
}

