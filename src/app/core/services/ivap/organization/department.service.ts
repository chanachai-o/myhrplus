/**
 * Department Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../base-api.service';
import {
  Department,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapDepartmentService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/departments';
  }

  /**
   * Get all departments (paginated)
   * Query Parameters: company_id (required for filtering)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<Department>> {
    return this.getPaginated<Department>('', params);
  }

  /**
   * Get department by ID
   * Query Parameters: company_id (required)
   */
  getById(departmentId: string, companyId: string): Observable<Department> {
    const params = this.buildParams({ company_id: companyId });
    return this.get<Department>(`/${departmentId}`, params);
  }

  /**
   * Get departments by company
   */
  getByCompany(companyId: string, params?: QueryParams): Observable<PaginatedResponse<Department>> {
    return this.getPaginated<Department>(`/company/${companyId}`, params);
  }

  /**
   * Create department
   */
  create(data: Partial<Department>): Observable<Department> {
    return this.post<Department>('', data);
  }

  /**
   * Update department
   * Query Parameters: company_id (required)
   */
  update(departmentId: string, companyId: string, data: Partial<Department>): Observable<Department> {
    const params = this.buildParams({ company_id: companyId });
    const url = this.getUrl(`/${departmentId}`);
    const headers = this.getHeaders();
    return this.http.put<Department>(url, data, { headers, params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Delete department
   * Query Parameters: company_id (required)
   */
  deleteDepartment(departmentId: string, companyId: string): Observable<void> {
    const params = this.buildParams({ company_id: companyId });
    return super.delete(`/${departmentId}`, params);
  }
}

