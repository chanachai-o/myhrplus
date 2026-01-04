import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UUID, PaginatedResponse } from '../models/base.model';
import {
  EmployeeDisplay,
  EmployeeListItem,
  EmployeeDetail,
  EmployeeCreateForm,
  EmployeeUpdateForm,
  EmployeeFilters,
  EmployeeStatistics,
  toEmployeeListItem,
  isEmployeeAdmin,
  getEmployeeTenure,
  isCurrentlyEmployed
} from '../models/employee-display.model';
import { Member } from '../models/member.model';
import { CompanyEmployee } from '../models/company-employee.model';
import { EmployeeHierarchy } from '../models/employee.model';

// Export aliases for backward compatibility
export type { EmployeeDisplay as Employee } from '../models/employee-display.model';
export type { EmployeeStatistics as EmployeeStats } from '../models/employee-display.model';
export type { EmployeeHierarchy };

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private currentEmployeeSubject = new BehaviorSubject<EmployeeDisplay | null>(null);
  public currentEmployee$ = this.currentEmployeeSubject.asObservable();

  constructor(private api: ApiService) {}

  // ==================== Employee CRUD ====================

  /**
   * Get employees with filtering and pagination
   * Returns paginated list of employees
   * Backend: GET /api/v1/employees/
   */
  public getEmployees(filters?: EmployeeFilters): Observable<PaginatedResponse<EmployeeDisplay>> {
    return this.api.get<any>('/employees', filters).pipe(
      map(response => ({
        ...response,
        data: response.data?.map((item: any) => this.transformBackendToDisplay(item)) || []
      }))
    );
  }

  /**
   * Get employees as simple list (without pagination)
   */
  public getEmployeesList(filters?: EmployeeFilters): Observable<EmployeeListItem[]> {
    return this.getEmployees(filters).pipe(
      map(response => response.data.map(emp => toEmployeeListItem(emp)))
    );
  }

  /**
   * Get a single employee by ID
   * Returns complete employee details
   * Backend: GET /api/v1/employees/{employee_id}
   */
  public getEmployeeById(id: UUID): Observable<EmployeeDetail> {
    return this.api.get<any>(`/employees/${id}`).pipe(
      map(response => this.transformBackendToDisplay(response) as EmployeeDetail)
    );
  }

  /**
   * Create a new employee
   * Creates both Member and CompanyEmployee records
   * Backend: POST /api/v1/employees/
   * Note: Must transform EmployeeCreateForm to CompanyEmployeePost format
   */
  public createEmployee(employeeData: EmployeeCreateForm): Observable<EmployeeDisplay> {
    // Transform frontend form to backend schema format
    const backendData = this.transformCreateFormToBackend(employeeData);
    return this.api.post<EmployeeDisplay>('/employees', backendData).pipe(
      map(response => this.transformBackendToDisplay(response))
    );
  }

  /**
   * Transform EmployeeCreateForm to backend CompanyEmployeePost format
   */
  private transformCreateFormToBackend(form: EmployeeCreateForm): any {
    return {
      member: {
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        picture: (form as any).picture || undefined
      },
      position: form.positionId ? {
        position_id: form.positionId,
        th_name: '', // Will be filled by backend if needed
        eng_name: ''
      } : undefined,
      department: form.departmentId ? {
        department_id: form.departmentId,
        th_name: '', // Will be filled by backend if needed
        eng_name: ''
      } : undefined,
      employee_id: form.employeeId,
      salary: form.salary,
      boss_id: form.bossId,
      company_role_type: form.companyRoleType,
      emp_type: form.empType,
      start_date: form.startDate
    };
  }

  /**
   * Update an existing employee
   * Updates both Member and CompanyEmployee data
   * Backend: PUT /api/v1/employees/{employee_id}
   * Note: Must transform EmployeeUpdateForm to CompanyEmployeeUpdate format
   */
  public updateEmployee(id: UUID, updates: EmployeeUpdateForm): Observable<EmployeeDisplay> {
    // Transform frontend form to backend schema format
    const backendData = this.transformUpdateFormToBackend(id, updates);
    return this.api.put<EmployeeDisplay>(`/employees/${id}`, backendData).pipe(
      map(response => this.transformBackendToDisplay(response))
    );
  }

  /**
   * Transform EmployeeUpdateForm to backend CompanyEmployeeUpdate format
   */
  private transformUpdateFormToBackend(employeeId: UUID, form: EmployeeUpdateForm): any {
    return {
      member: {
        email: form.email || '',
        first_name: form.firstName,
        last_name: form.lastName,
        picture: form.picture || undefined
      },
      position: form.positionId ? {
        position_id: form.positionId,
        th_name: '',
        eng_name: ''
      } : undefined,
      department: form.departmentId ? {
        department_id: form.departmentId,
        th_name: '',
        eng_name: ''
      } : undefined,
      employee_id: form.employeeId,
      salary: form.salary,
      boss_id: form.bossId,
      company_employee_id: employeeId, // Required in backend
      company_role_type: form.companyRoleType || 'EMPLOYEE', // Required in backend
      emp_type: form.empType || 'FULL_TIME', // Required in backend
      // Note: start_date is required in backend but may not be in update form
      // If not provided, we need to get it from existing employee data
      start_date: (form as any).startDate || new Date().toISOString() // Required in backend - may need to fetch from existing employee
    };
  }

  /**
   * Transform backend CompanyEmployeeResponse to frontend EmployeeDisplay
   */
  private transformBackendToDisplay(backend: any): EmployeeDisplay {
    return {
      ...backend,
      // Flatten nested structure
      memberId: backend.member?.member_id || backend.memberId,
      email: backend.member?.email || backend.email,
      firstName: backend.member?.first_name || backend.firstName,
      lastName: backend.member?.last_name || backend.lastName,
      picture: backend.member?.picture || backend.picture,
      departmentName: backend.department?.th_name || backend.departmentName,
      positionName: backend.position?.th_name || backend.positionName,
      // Map other fields
      id: backend.company_employee_id || backend.id,
      companyId: backend.company_id || backend.companyId,
      departmentId: backend.department?.department_id || backend.departmentId,
      positionId: backend.position?.position_id || backend.positionId,
      employeeId: backend.employee_id || backend.employeeId,
      salary: backend.salary,
      bossId: backend.boss_id || backend.bossId,
      companyRoleType: backend.company_role_type || backend.companyRoleType,
      empType: backend.emp_type || backend.empType,
      startDate: backend.start_date || backend.startDate,
      fullName: `${backend.member?.first_name || ''} ${backend.member?.last_name || ''}`.trim(),
      displayName: `${backend.member?.first_name || ''} ${backend.member?.last_name || ''}`.trim()
    } as EmployeeDisplay;
  }

  /**
   * Delete an employee
   * Soft delete - sets isActive to false
   */
  public deleteEmployee(id: UUID): Observable<void> {
    return this.api.delete<void>(`/employees/${id}`);
  }

  /**
   * Deactivate an employee (soft delete)
   */
  public deactivateEmployee(id: UUID, leftAt?: string): Observable<EmployeeDisplay> {
    return this.updateEmployee(id, { 
      isActive: false,
      leftAt: leftAt || new Date().toISOString()
    });
  }

  /**
   * Reactivate an employee
   */
  public reactivateEmployee(id: UUID): Observable<EmployeeDisplay> {
    return this.updateEmployee(id, { 
      isActive: true,
      leftAt: undefined
    });
  }

  // ==================== Member Operations ====================

  /**
   * Get member information by member ID
   */
  public getMemberById(memberId: UUID): Observable<Member> {
    return this.api.get<Member>(`/members/${memberId}`);
  }

  /**
   * Update member information
   */
  public updateMember(memberId: UUID, updates: Partial<Member>): Observable<Member> {
    return this.api.put<Member>(`/members/${memberId}`, updates);
  }

  // ==================== Company Employee Operations ====================

  /**
   * Get company employee record by ID
   */
  public getCompanyEmployeeById(id: UUID): Observable<CompanyEmployee> {
    return this.api.get<CompanyEmployee>(`/company-employees/${id}`);
  }

  /**
   * Get all company employees for a company
   */
  public getCompanyEmployees(companyId: UUID, filters?: EmployeeFilters): Observable<PaginatedResponse<EmployeeDisplay>> {
    return this.api.get<PaginatedResponse<EmployeeDisplay>>('/employees', { 
      ...filters, 
      companyId 
    });
  }

  // ==================== Statistics & Reports ====================

  /**
   * Get employee statistics
   * Note: Backend endpoint may not exist - consider removing or implementing backend endpoint
   */
  public getEmployeeStats(companyId?: UUID): Observable<EmployeeStatistics> {
    // TODO: Check if backend has /employees/stats endpoint
    // If not, remove this function or implement client-side calculation
    return this.api.get<EmployeeStatistics>('/employees/stats', companyId ? { companyId } : undefined);
  }

  /**
   * Get employee hierarchy for organization chart
   * Note: Backend endpoint may not exist - consider removing or implementing backend endpoint
   */
  public getEmployeeHierarchy(companyId?: UUID): Observable<EmployeeHierarchy[]> {
    // TODO: Check if backend has /employees/hierarchy endpoint
    // If not, remove this function or implement client-side calculation
    return this.api.get<EmployeeHierarchy[]>('/employees/hierarchy', companyId ? { companyId } : undefined);
  }

  /**
   * Get employees by department
   */
  public getEmployeesByDepartment(departmentId: UUID): Observable<EmployeeDisplay[]> {
    return this.getEmployees({ departmentId }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get employees by position
   */
  public getEmployeesByPosition(positionId: UUID): Observable<EmployeeDisplay[]> {
    return this.getEmployees({ positionId }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get subordinates of an employee
   * Backend: GET /api/v1/employees/{employee_id}/subordinates
   */
  public getSubordinates(employeeId: UUID): Observable<PaginatedResponse<EmployeeDisplay>> {
    return this.api.get<PaginatedResponse<EmployeeDisplay>>(`/employees/${employeeId}/subordinates`);
  }

  /**
   * Get subordinates as list (without pagination)
   */
  public getSubordinatesList(employeeId: UUID): Observable<EmployeeDisplay[]> {
    return this.getSubordinates(employeeId).pipe(
      map(response => response.data)
    );
  }

  // ==================== Current Employee State ====================

  /**
   * Set the current employee for detail views
   */
  public setCurrentEmployee(employee: EmployeeDisplay | null): void {
    this.currentEmployeeSubject.next(employee);
  }

  /**
   * Get the currently selected employee
   */
  public getCurrentEmployee(): EmployeeDisplay | null {
    return this.currentEmployeeSubject.getValue();
  }

  // ==================== Search & Filter ====================

  /**
   * Search employees by query
   */
  public searchEmployees(query: string, companyId?: UUID): Observable<EmployeeDisplay[]> {
    return this.getEmployees({ 
      search: query, 
      companyId 
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get active employees only
   */
  public getActiveEmployees(companyId?: UUID): Observable<EmployeeDisplay[]> {
    return this.getEmployees({ 
      isActive: true, 
      companyId 
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get inactive employees
   */
  public getInactiveEmployees(companyId?: UUID): Observable<EmployeeDisplay[]> {
    return this.getEmployees({ 
      isActive: false, 
      companyId 
    }).pipe(
      map(response => response.data)
    );
  }

  // ==================== Import/Export ====================

  /**
   * Export employee data
   * Note: Backend endpoint may not exist - check /api/v1/reports/export-employees instead
   */
  public exportEmployees(format: 'csv' | 'json' | 'excel' = 'csv', filters?: EmployeeFilters): Observable<Blob> {
    // TODO: Check if backend has /employees/export endpoint
    // Alternative: Use /api/v1/reports/export-employees
    return this.api.get<Blob>(`/employees/export`, { 
      ...filters, 
      format 
    });
  }

  /**
   * Import employee data from file
   * Note: Backend endpoint may not exist - consider removing or implementing backend endpoint
   */
  public importEmployees(file: File, companyId: UUID): Observable<{ 
    success: number; 
    failed: number; 
    errors: string[] 
  }> {
    // TODO: Check if backend has /employees/import endpoint
    // If not, remove this function
    return this.api.upload<{ 
      success: number; 
      failed: number; 
      errors: string[] 
    }>('/employees/import', file, { companyId });
  }

  /**
   * Download import template
   * Note: Backend endpoint may not exist - consider removing or implementing backend endpoint
   */
  public downloadImportTemplate(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    // TODO: Check if backend has /employees/import-template endpoint
    // If not, remove this function
    return this.api.get<Blob>(`/employees/import-template`, { format });
  }

  // ==================== Helper Methods ====================

  /**
   * Check if employee is admin
   */
  public isAdmin(employee: EmployeeDisplay): boolean {
    return isEmployeeAdmin(employee);
  }

  /**
   * Get employee tenure in months
   */
  public getTenure(employee: EmployeeDisplay): number {
    return getEmployeeTenure(employee);
  }

  /**
   * Check if employee is currently employed
   */
  public isCurrentlyEmployed(employee: EmployeeDisplay): boolean {
    return isCurrentlyEmployed(employee);
  }

  /**
   * Get employee full name
   */
  public getFullName(employee: EmployeeDisplay): string {
    return employee.fullName || `${employee.firstName} ${employee.lastName}`.trim();
  }

  /**
   * Get employee display name (with employee ID if available)
   */
  public getDisplayName(employee: EmployeeDisplay): string {
    const fullName = this.getFullName(employee);
    return employee.employeeId ? `${fullName} (${employee.employeeId})` : fullName;
  }
}

