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

