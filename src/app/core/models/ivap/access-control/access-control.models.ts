/**
 * Access Control Models (Device, Door, Verification)
 */

import {
  DeviceType,
  DeviceStatus,
  VerificationType,
  VerificationStatus,
  AccessLevel
} from '../common';

export interface Device {
  device_id: string;
  company_id: string;
  device_name: string;
  device_type: DeviceType;
  device_model?: string;
  serial_number?: string;
  ip_address?: string;
  mac_address?: string;
  location?: string;
  status: DeviceStatus;
  is_online: boolean;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface Door {
  door_id: string;
  company_id: string;
  door_name: string;
  door_code: string;
  location?: string;
  device_id?: string;
  access_level: AccessLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Verification {
  verification_id: string;
  company_id: string;
  member_id?: string;
  visitor_id?: string;
  guest_id?: string;
  verification_type: VerificationType;
  verification_method: string;
  status: VerificationStatus;
  confidence_score?: number;
  device_id?: string;
  door_id?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DoorPermission {
  permission_id: string;
  company_id: string;
  company_employee_id: string;
  door_id: string;
  access_type: string;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessLog {
  access_log_id: string;
  company_id: string;
  door_id: string;
  member_id?: string;
  visitor_id?: string;
  guest_id?: string;
  access_type: string;
  access_result: 'GRANTED' | 'DENIED';
  verification_method?: string;
  timestamp: string;
  device_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DeviceStatusInfo {
  device_id: string;
  device_name: string;
  status: DeviceStatus;
  is_online: boolean;
  last_seen?: string;
  uptime?: number; // seconds
  cpu_usage?: number; // percentage
  memory_usage?: number; // percentage
  disk_usage?: number; // percentage
  network_status?: 'connected' | 'disconnected';
  firmware_version?: string;
  last_heartbeat?: string;
}

