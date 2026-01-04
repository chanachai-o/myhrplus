/**
 * Event Models
 */

import {
  EventType,
  EventStatus
} from '../common';

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
  created_by: string;
  created_at: string;
  updated_at: string;
}

