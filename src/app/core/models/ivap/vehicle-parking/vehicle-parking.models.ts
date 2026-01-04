/**
 * Vehicle & Parking Models
 */

import {
  VehicleType,
  VehicleStatus,
  ParkingStatus
} from '../common';

export interface Vehicle {
  vehicle_id: string;
  company_id: string;
  member_id?: string;
  license_plate: string;
  vehicle_type: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  status: VehicleStatus;
  registered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ParkingRecord {
  parking_id: string;
  company_id: string;
  vehicle_id: string;
  parking_slot?: string;
  entry_time: string;
  exit_time?: string;
  duration_minutes?: number;
  fee?: number;
  status: ParkingStatus;
  created_at: string;
  updated_at: string;
}

export interface ParkingSpace {
  space_id: string;
  company_id: string;
  space_number: string;
  space_type: 'REGULAR' | 'HANDICAP' | 'RESERVED' | 'VIP';
  floor?: string;
  zone?: string;
  is_occupied: boolean;
  is_reserved: boolean;
  reserved_until?: string;
  current_vehicle_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ParkingEntryRequest {
  vehicle_id: string;
  license_plate: string;
  entry_time?: string;
  parking_slot?: string;
  device_id?: string;
}

export interface ParkingExitRequest {
  vehicle_id: string;
  license_plate: string;
  exit_time?: string;
  device_id?: string;
}

export interface ParkingStatistics {
  total_spaces: number;
  occupied_spaces: number;
  available_spaces: number;
  reserved_spaces: number;
  occupancy_rate: number; // percentage
  total_entries_today: number;
  total_exits_today: number;
  average_duration: number; // minutes
  revenue_today?: number;
}

export interface VehicleAccessLog {
  access_log_id: string;
  vehicle_id: string;
  entry_time: string;
  exit_time?: string;
  location: string;
  access_type: 'ENTRY' | 'EXIT';
  device_id?: string;
  created_at: string;
}

