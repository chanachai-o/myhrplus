/**
 * Pagination Models - Standard interfaces for paginated API responses
 * Used across all services that support pagination
 */

/**
 * Sort information in paginated response
 */
export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

/**
 * Pageable information in paginated response
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

/**
 * Standard paginated response structure
 * Compatible with Spring Boot Page<T> response format
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

