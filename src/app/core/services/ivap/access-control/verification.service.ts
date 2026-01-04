/**
 * Verification Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Verification,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapVerificationService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/verification';
  }

  /**
   * Get all verifications (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Verification>> {
    return this.getPaginated<Verification>('', params);
  }

  /**
   * Get verification by ID
   */
  getById(verificationId: string): Observable<Verification> {
    return this.get<Verification>(`/${verificationId}`);
  }
}

