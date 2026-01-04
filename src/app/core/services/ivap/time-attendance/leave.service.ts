/**
 * Leave Service สำหรับ IVAP Service API
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base-api.service';
import {
  LeaveRequest,
  PaginatedResponse,
  QueryParams
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class IvapLeaveService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/leaves';
  }

  /**
   * Get all leave requests (paginated)
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<LeaveRequest>> {
    return this.getPaginated<LeaveRequest>('', params);
  }

  /**
   * Get leave request by ID
   */
  getById(leaveId: string): Observable<LeaveRequest> {
    return this.get<LeaveRequest>(`/${leaveId}`);
  }

  /**
   * Create leave request
   */
  create(data: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.post<LeaveRequest>('', data);
  }

  /**
   * Update leave request
   */
  update(leaveId: string, data: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.put<LeaveRequest>(`/${leaveId}`, data);
  }

  /**
   * Approve leave request
   */
  approve(leaveId: string): Observable<LeaveRequest> {
    return this.post<LeaveRequest>(`/${leaveId}/approve`, {});
  }

  /**
   * Reject leave request
   */
  reject(leaveId: string, reason?: string): Observable<LeaveRequest> {
    return this.post<LeaveRequest>(`/${leaveId}/reject`, { reason });
  }

  /**
   * Cancel leave request
   */
  cancel(leaveId: string): Observable<LeaveRequest> {
    return this.post<LeaveRequest>(`/${leaveId}/cancel`, {});
  }
}

