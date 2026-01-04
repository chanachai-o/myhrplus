/**
 * Company Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  Company,
  CompanyBase,
  CompanyUpdate,
  CompanySettings,
  CompanySettingsUpdate,
  CompanyStatistics,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapCompanyService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/companies';
  }

  /**
   * Get all companies (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Company>> {
    return this.getPaginated<Company>('', params);
  }

  /**
   * Get company by ID
   */
  getById(companyId: string): Observable<Company> {
    return this.get<Company>(`/${companyId}`);
  }

  /**
   * Create new company
   */
  create(data: CompanyBase): Observable<Company> {
    return this.post<Company>('', data);
  }

  /**
   * Update company
   */
  update(companyId: string, data: CompanyUpdate): Observable<Company> {
    return this.put<Company>(`/${companyId}`, data);
  }

  /**
   * Delete company
   */
  override delete(companyId: string): Observable<void> {
    return super.delete(`/${companyId}`);
  }

  /**
   * Get company statistics
   */
  getStatistics(): Observable<CompanyStatistics> {
    return this.get<CompanyStatistics>('/stats');
  }

  /**
   * Get company settings
   */
  getSettings(companyId: string): Observable<CompanySettings> {
    return this.get<CompanySettings>(`/${companyId}/settings`);
  }

  /**
   * Update company settings
   */
  updateSettings(companyId: string, data: CompanySettingsUpdate): Observable<CompanySettings> {
    return this.put<CompanySettings>(`/${companyId}/settings`, data);
  }

  /**
   * Activate company
   */
  activate(companyId: string): Observable<any> {
    return this.post(`/${companyId}/activate`, {});
  }

  /**
   * Deactivate company
   */
  deactivate(companyId: string): Observable<any> {
    return this.post(`/${companyId}/deactivate`, {});
  }

  /**
   * Suspend company
   */
  suspend(companyId: string, reason: string): Observable<any> {
    return this.post(`/${companyId}/suspend`, { reason });
  }

  /**
   * Export companies as CSV
   */
  export(params?: QueryParams): Observable<Blob> {
    return this.downloadFile('/export', params);
  }
}

