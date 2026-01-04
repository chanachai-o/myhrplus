/**
 * Position Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../base-api.service';
import {
  Position,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapPositionService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/positions';
  }

  /**
   * Get all positions (paginated)
   * Query Parameters: company_id (required for filtering)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Position>> {
    return this.getPaginated<Position>('', params);
  }

  /**
   * Get position by ID
   * Query Parameters: company_id (required)
   */
  getById(positionId: string, companyId: string): Observable<Position> {
    const params = this.buildParams({ company_id: companyId });
    return this.get<Position>(`/${positionId}`, params);
  }

  /**
   * Get positions by company
   */
  getByCompany(companyId: string, params?: QueryParams): Observable<PaginatedResponse<Position>> {
    return this.getPaginated<Position>(`/company/${companyId}`, params);
  }

  /**
   * Create position
   */
  create(data: Partial<Position>): Observable<Position> {
    return this.post<Position>('', data);
  }

  /**
   * Update position
   * Query Parameters: company_id (required)
   */
  update(positionId: string, companyId: string, data: Partial<Position>): Observable<Position> {
    const params = this.buildParams({ company_id: companyId });
    const url = this.getUrl(`/${positionId}`);
    const headers = this.getHeaders();
    return this.http.put<Position>(url, data, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Delete position
   * Query Parameters: company_id (required)
   */
  deletePosition(positionId: string, companyId: string): Observable<void> {
    const params = this.buildParams({ company_id: companyId });
    return super.delete(`/${positionId}`, params);
  }
}

