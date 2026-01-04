/**
 * Time & Attendance Models
 */

import {
  TimestampType,
  LeaveType,
  LeaveStatus
} from '../common';

export interface EmployeeTimestamp {
  timestamp_id: string;
  company_employee_id: string;
  timestamp: string;
  timestamp_type: TimestampType;
  device_id?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  created_at: string;
}

export interface Shift {
  shift_id: string;
  company_id: string;
  shift_name: string;
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  break_duration?: number; // minutes
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  leave_id: string;
  company_employee_id: string;
  leave_type: LeaveType;
  start_date: string; // ISO 8601 date
  end_date: string; // ISO 8601 date
  days: number;
  reason?: string;
  status: LeaveStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  company_employee_id: string;
  leave_type: LeaveType;
  total_days: number;
  used_days: number;
  remaining_days: number;
  pending_days: number;
  year: number;
}

export interface LeaveStatistics {
  total_requests: number;
  approved_requests: number;
  rejected_requests: number;
  pending_requests: number;
  cancelled_requests: number;
  total_days_taken: number;
  average_days_per_request: number;
  by_leave_type: Record<LeaveType, {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  }>;
}

export interface ShiftAssignment {
  assignment_id: string;
  shift_id: string;
  company_employee_id: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

