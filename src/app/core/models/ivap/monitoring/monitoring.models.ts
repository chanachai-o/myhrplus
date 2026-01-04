/**
 * Monitoring & System Models
 */

export interface SystemMetrics {
  cpu_usage: number; // percentage
  memory_usage: number; // percentage
  disk_usage: number; // percentage
  network_throughput: {
    upload: number; // bytes per second
    download: number; // bytes per second
  };
  active_connections: number;
  request_rate: number; // requests per second
  error_rate: number; // errors per second
  response_time_avg: number; // milliseconds
  timestamp: string;
}

export interface SystemPerformance {
  cpu: {
    usage: number; // percentage
    cores: number;
    load_average: number[];
  };
  memory: {
    total: number; // bytes
    used: number; // bytes
    available: number; // bytes
    usage_percentage: number;
  };
  disk: {
    total: number; // bytes
    used: number; // bytes
    available: number; // bytes
    usage_percentage: number;
  };
  network: {
    bytes_sent: number;
    bytes_received: number;
    packets_sent: number;
    packets_received: number;
    errors: number;
  };
  uptime: number; // seconds
  timestamp: string;
}

export interface DeviceMonitoringStatus {
  device_id: string;
  device_name: string;
  device_type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
  is_online: boolean;
  last_seen?: string;
  uptime?: number; // seconds
  cpu_usage?: number; // percentage
  memory_usage?: number; // percentage
  disk_usage?: number; // percentage
  network_status?: 'connected' | 'disconnected';
  firmware_version?: string;
  last_heartbeat?: string;
  error_count?: number;
  last_error?: string;
}

