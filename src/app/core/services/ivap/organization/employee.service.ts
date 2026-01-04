/**
 * Employee Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  CompanyEmployee,
  CompanyEmployeePost,
  CompanyEmployeeUpdate,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapEmployeeService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/employees';
  }

  /**
   * Get all employees (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<CompanyEmployee>> {
    return this.getPaginated<CompanyEmployee>('', params);
  }

  /**
   * Get employee by ID
   */
  getById(employeeId: string): Observable<CompanyEmployee> {
    return this.get<CompanyEmployee>(`/${employeeId}`);
  }

  /**
   * Create new employee
   */
  create(data: CompanyEmployeePost): Observable<CompanyEmployee> {
    return this.post<CompanyEmployee>('', data);
  }

  /**
   * Update employee
   */
  update(employeeId: string, data: CompanyEmployeeUpdate): Observable<CompanyEmployee> {
    // Ensure company_employee_id matches path parameter
    const updateData = { ...data, company_employee_id: employeeId };
    return this.put<CompanyEmployee>(`/${employeeId}`, updateData);
  }

  /**
   * Delete employee
   */
  override delete(employeeId: string): Observable<void> {
    return super.delete(`/${employeeId}`);
  }

  /**
   * Get employee subordinates
   */
  getSubordinates(employeeId: string, params?: QueryParams): Observable<PaginatedResponse<CompanyEmployee>> {
    return this.getPaginated<CompanyEmployee>(`/${employeeId}/subordinates`, params);
  }
}

