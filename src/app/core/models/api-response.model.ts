/**
 * API Response Models
 * Models สำหรับ API responses และ error handling
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError | ApiError[];
  message: string;
  timestamp?: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

