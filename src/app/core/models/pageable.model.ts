import { Sort } from './sort.model';

/**
 * Pageable model for pagination requests
 */
export interface Pageable {
  sort?: Sort;
  offset?: number;
  pageNumber?: number;
  pageSize?: number;
  paged?: boolean;
  unpaged?: boolean;
}

