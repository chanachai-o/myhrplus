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

