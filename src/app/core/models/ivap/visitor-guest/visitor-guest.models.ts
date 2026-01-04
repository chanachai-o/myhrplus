/**
 * Visitor & Guest Models
 */

import {
  VisitorStatus,
  GuestStatus,
  RegistrationType
} from '../common';

export interface Visitor {
  visitor_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  company_name?: string;
  purpose: string;
  host_employee_id?: string;
  check_in_time?: string;
  check_out_time?: string;
  status: VisitorStatus;
  badge_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  guest_id: string;
  company_id: string;
  event_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  registration_type: RegistrationType;
  status: GuestStatus;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  updated_at: string;
}

export interface VisitorInvitation {
  invitation_id: string;
  visitor_id: string;
  invited_by: string;
  invitation_code: string;
  expires_at: string;
  is_used: boolean;
  used_at?: string;
  created_at: string;
}

export interface VisitorInvitationRequest {
  visitor_id: string;
  expires_in?: number; // minutes
  purpose?: string;
}

export interface VisitorBadge {
  badge_id: string;
  visitor_id: string;
  badge_number: string;
  qr_code?: string;
  issued_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Visit {
  visit_id: string;
  visitor_id: string;
  check_in_time: string;
  check_out_time?: string;
  location?: string;
  host_employee_id?: string;
  purpose?: string;
  notes?: string;
  created_at: string;
}

export interface VisitorStatistics {
  total_visitors: number;
  checked_in_count: number;
  checked_out_count: number;
  pending_count: number;
  expired_count: number;
  average_visit_duration: number; // minutes
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
  by_purpose: Record<string, number>;
}

export interface GuestStatistics {
  total_guests: number;
  registered_count: number;
  checked_in_count: number;
  checked_out_count: number;
  cancelled_count: number;
  by_registration_type: Record<RegistrationType, number>;
  by_event: Record<string, number>;
}

export interface GuestRegistration {
  registration_id: string;
  guest_id: string;
  event_id: string;
  registration_type: RegistrationType;
  registered_at: string;
  status: GuestStatus;
  check_in_time?: string;
  check_out_time?: string;
}

