/**
 * Event Models
 */

import {
  EventType,
  EventStatus,
  RegistrationType
} from '../common';
import { Member } from '../auth';

export interface Event {
  event_id: string;
  company_id: string;
  event_name: string;
  event_description?: string;
  event_type: EventType;
  start_date: string; // ISO 8601 datetime
  end_date: string; // ISO 8601 datetime
  location?: string;
  max_attendees?: number;
  current_attendees: number;
  status: EventStatus;
  public_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  registration_id: string;
  event_id: string;
  member_id?: string;
  visitor_id?: string;
  guest_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  company_name?: string;
  registration_type: RegistrationType;
  dietary_requirements?: string;
  special_requests?: string;
  check_in_time?: string;
  check_out_time?: string;
  qr_code?: string;
  is_confirmed: boolean;
  confirmation_token?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  attendee_id: string;
  event_id: string;
  member_id?: string;
  visitor_id?: string;
  guest_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  check_in_time?: string;
  check_out_time?: string;
  registration_type: RegistrationType;
  status: 'REGISTERED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export interface EventStatistics {
  total_registrations: number;
  total_attendees: number;
  checked_in_count: number;
  checked_out_count: number;
  pending_count: number;
  cancelled_count: number;
  attendance_rate: number; // percentage
  peak_attendance_time?: string;
  average_check_in_duration?: number; // minutes
}

