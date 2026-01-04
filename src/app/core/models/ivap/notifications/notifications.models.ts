/**
 * Notifications Models
 */

import {
  NotificationType
} from '../common';

export interface Notification {
  notification_id: string;
  member_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  // Legacy compatibility properties
  id?: string; // Alias for notification_id
  type?: NotificationType; // Alias for notification_type
  read?: boolean; // Alias for is_read
  timestamp?: string; // Alias for created_at
  route?: string; // Optional route for navigation
}

