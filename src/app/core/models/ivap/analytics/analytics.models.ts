/**
 * Analytics & Monitoring Models
 */

export interface AIService {
  service_id: string;
  service_name: string;
  service_type: 'FACE_RECOGNITION' | 'OBJECT_DETECTION' | 'ANALYTICS' | 'ANOMALY_DETECTION';
  status: 'ACTIVE' | 'INACTIVE';
  endpoint?: string;
  api_key?: string;
  created_at: string;
}

export interface AnalyticsMetric {
  metric_id: string;
  metric_type: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsResponse {
  metrics: AnalyticsMetric[];
  summary: {
    total_visitors: number;
    total_employees: number;
    total_verifications: number;
    [key: string]: any;
  };
}

export interface DashboardStatistics {
  total_employees: number;
  total_visitors: number;
  total_devices: number;
  active_verifications: number;
}

export interface Activity {
  activity_id: string;
  activity_type: string;
  description: string;
  user_id?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Alert {
  alert_id: string;
  alert_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface DashboardResponse {
  statistics: DashboardStatistics;
  recent_activities: Activity[];
  alerts: Alert[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    storage: 'up' | 'down';
  };
  timestamp: string;
}

export interface AnalyticsReport {
  report_id: string;
  report_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  report_name: string;
  start_date: string;
  end_date: string;
  generated_at: string;
  generated_by: string;
  data: Record<string, any>;
  summary: {
    total_visitors: number;
    total_employees: number;
    total_verifications: number;
    total_events: number;
    [key: string]: any;
  };
}

export interface AnalyticsReportRequest {
  report_type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  report_name: string;
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
  include_charts?: boolean;
}

export interface AnalyticsMetrics {
  total_visitors: number;
  total_employees: number;
  total_verifications: number;
  total_events: number;
  active_devices: number;
  verification_success_rate: number; // percentage
  average_visit_duration: number; // minutes
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
  by_verification_type: Record<string, number>;
  by_event_type: Record<string, number>;
  trends: {
    visitors: Array<{ date: string; count: number }>;
    verifications: Array<{ date: string; count: number }>;
    events: Array<{ date: string; count: number }>;
  };
}

