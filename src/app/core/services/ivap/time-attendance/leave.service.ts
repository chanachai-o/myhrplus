/**
 * Leave Service สำหรับ IVAP Service API
 * 
 * Base endpoint: /leaves/leave-requests
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
   * Endpoint: GET /api/v1/leaves/leave-requests
   */
  getAll(params?: QueryParams): Observable<PaginatedResponse<LeaveRequest>> {
    return this.getPaginated<LeaveRequest>('/leave-requests', params);
  }

  /**
   * Get leave request by ID
   * Endpoint: GET /api/v1/leaves/leave-requests/{leave_request_id}
   */
  getById(leaveRequestId: string): Observable<LeaveRequest> {
    return this.get<LeaveRequest>(`/leave-requests/${leaveRequestId}`);
  }

  /**
   * Create leave request
   * Endpoint: POST /api/v1/leaves/leave-requests
   */
  create(data: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.post<LeaveRequest>('/leave-requests', data);
  }

  /**
   * Update leave request
   * Endpoint: PUT /api/v1/leaves/leave-requests/{leave_request_id}
   */
  update(leaveRequestId: string, data: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.put<LeaveRequest>(`/leave-requests/${leaveRequestId}`, data);
  }

  /**
   * Approve leave request
   * Endpoint: PUT /api/v1/leaves/leave-requests/{leave_request_id}/approve
   */
  approve(leaveRequestId: string, approvalNotes?: string): Observable<LeaveRequest> {
    return this.put<LeaveRequest>(`/leave-requests/${leaveRequestId}/approve`, { approval_notes: approvalNotes });
  }

  /**
   * Reject leave request
   * Endpoint: PUT /api/v1/leaves/leave-requests/{leave_request_id}/reject
   * @param leaveRequestId - Leave request ID
   * @param rejectionReason - Rejection reason (optional for backward compatibility)
   */
  reject(leaveRequestId: string, rejectionReason?: string): Observable<LeaveRequest> {
    return this.put<LeaveRequest>(`/leave-requests/${leaveRequestId}/reject`, { rejection_reason: rejectionReason || 'Rejected' });
  }

  /**
   * Cancel leave request
   * Endpoint: DELETE /api/v1/leaves/leave-requests/{leave_request_id}?employee_id={employee_id}
   */
  cancel(leaveRequestId: string, employeeId: string): Observable<any> {
    const params = this.buildParams({ employee_id: employeeId });
    return super.delete(`/leave-requests/${leaveRequestId}`, params);
  }

  /**
   * Get employee leave balance
   * Endpoint: GET /api/v1/leaves/employees/{employee_id}/leave-balance
   */
  getLeaveBalance(employeeId: string): Observable<any> {
    return this.get(`/employees/${employeeId}/leave-balance`);
  }

  /**
   * Get company leave statistics
   * Endpoint: GET /api/v1/leaves/companies/{company_id}/leave-statistics
   */
  getCompanyStatistics(companyId: string, year?: number): Observable<any> {
    const params = year ? this.buildParams({ year }) : undefined;
    return this.get(`/companies/${companyId}/leave-statistics`, params);
  }
}

