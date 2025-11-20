import { Pageable } from './pageable.model';
import { Sort } from './sort.model';

/**
 * Page model for paginated API responses
 * @template T - Type of items in the page
 */
export interface PageModel<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

