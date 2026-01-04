/**
 * Common Types, Pagination, and Error Handling Models
 * Shared across all IVAP modules
 */

// ============================================================================
// Common Types
// ============================================================================

export type ActorType = 'MEMBER' | 'ADMIN_SYSTEM' | 'GUEST' | 'PUBLIC' | 'DEVICE' | 'API' | 'SYSTEM';
export type MemberType = 'ADMIN' | 'EMPLOYEE' | 'MANAGER' | 'SECURITY' | 'IT' | 'HR' | 'CONTRACTOR' | 'SYSTEM' | 'DEFAULT';
export type StatusType = 'ENABLE' | 'DISABLE';
export type PublicType = 'PUBLIC' | 'PENDING';
export type CompanyRoleType = 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'HR' | 'SECURITY' | 'IT';
export type EmpType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
export type TimestampType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_START' | 'BREAK_END';
export type DeviceType = 'CAMERA' | 'ACCESS_CONTROL' | 'BIOMETRIC' | 'RFID_READER' | 'QR_SCANNER';
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
export type VerificationType = 'FACE' | 'RFID' | 'QR_CODE' | 'BIOMETRIC' | 'PIN';
export type VerificationStatus = 'SUCCESS' | 'FAILED' | 'PENDING';
export type VisitorStatus = 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED';
export type GuestStatus = 'REGISTERED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type EventType = 'MEETING' | 'CONFERENCE' | 'WORKSHOP' | 'SEMINAR' | 'OTHER';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type VehicleType = 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'VAN' | 'OTHER';
export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';
export type ParkingStatus = 'PARKED' | 'EXITED' | 'OVERDUE';
export type LeaveType = 'ANNUAL' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type NotificationType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export type RFIDCardType = 'EMPLOYEE' | 'VISITOR' | 'GUEST' | 'TEMPORARY';
export type RFIDCardStatus = 'ACTIVE' | 'INACTIVE' | 'LOST' | 'STOLEN';
export type RegistrationType = 'PRE_REGISTERED' | 'WALK_IN';
export type AccessLevel = 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';
export type SortOrder = 'asc' | 'desc';

// ============================================================================
// Pagination
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface QueryParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: SortOrder;
  search?: string;
  [key: string]: any; // For additional filters
}

// ============================================================================
// Error Handling
// ============================================================================

export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  value?: any;
  details?: Record<string, any>;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  type: string;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
  validation_errors?: ValidationErrorDetail[];
  timestamp?: string;
  request_id?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp?: string;
  request_id?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

