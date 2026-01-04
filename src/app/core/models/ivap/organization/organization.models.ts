/**
 * Organization Models (Company, Employee, Department, Position)
 */

import {
  PublicType,
  CompanyRoleType,
  EmpType
} from '../common';

// ============================================================================
// Company
// ============================================================================

export interface Company {
  company_id: string;
  company_name: string;
  company_code: string;
  company_info: string;
  address: string;
  latitude: number;
  longitude: number;
  picture?: string;
  status: PublicType;
  owner_name: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyBase {
  company_name: string;
  company_code: string;
  company_info: string;
  address: string;
  latitude: number;
  longitude: number;
  picture?: string;
  status: PublicType;
  owner_name: string;
  contact: string;
}

export interface CompanyUpdate {
  company_name?: string;
  company_code?: string;
  company_info?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  picture?: string;
  status?: PublicType;
  owner_name?: string;
  contact?: string;
}

export interface CompanySettings {
  company_id: string;
  max_users: number;
  max_devices: number;
  max_storage_gb: number;
  subscription_type: string;
  features: string[];
  additional_settings: Record<string, any>;
  updated_at?: string;
  created_at?: string;
}

export interface CompanySettingsUpdate {
  max_users?: number;
  max_devices?: number;
  max_storage_gb?: number;
  subscription_type?: string;
  features?: string[];
  additional_settings?: Record<string, any>;
}

export interface CompanyStatistics {
  total_companies: number;
  public_companies: number;
  pending_companies: number;
  suspended_companies: number;
}

export interface CompanyLocation {
  location_id: string;
  company_id: string;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Employee
// ============================================================================

export interface MemberInput {
  member_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
}

export interface PositionInput {
  position_id: string;
  th_name: string;
  eng_name: string;
}

export interface DepartmentInput {
  department_id: string;
  th_name: string;
  eng_name: string;
}

export interface MemberResponse {
  member_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
}

export interface PositionResponse {
  position_id: string;
  th_name: string;
  eng_name: string;
}

export interface DepartmentResponse {
  department_id: string;
  th_name: string;
  eng_name: string;
}

export interface CompanyEmployee {
  company_employee_id: string;
  company_id: string;
  employee_id: string;
  member: MemberResponse;
  position?: PositionResponse;
  department?: DepartmentResponse;
  salary: number;
  boss_id: string;
  company_role_type: CompanyRoleType;
  emp_type: EmpType;
  start_date: string;
}

export interface CompanyEmployeePost {
  member: MemberInput;
  position?: PositionInput;
  department?: DepartmentInput;
  employee_id?: string;
  salary?: number;
  boss_id?: string;
  company_role_type: CompanyRoleType;
  emp_type: EmpType;
  start_date: string;
}

export interface CompanyEmployeeUpdate {
  company_employee_id: string;
  member: MemberInput;
  position?: PositionInput;
  department?: DepartmentInput;
  employee_id?: string;
  salary?: number;
  boss_id?: string;
  company_role_type: CompanyRoleType;
  emp_type: EmpType;
  start_date: string;
}

// ============================================================================
// Department & Position
// ============================================================================

export interface Department {
  department_id: string;
  company_id: string;
  th_name: string;
  eng_name: string;
  description?: string;
  parent_department_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Position {
  position_id: string;
  company_id: string;
  th_name: string;
  eng_name: string;
  description?: string;
  level?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

