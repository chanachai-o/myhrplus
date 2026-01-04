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
  created_at: string;
  updated_at: string;
}

