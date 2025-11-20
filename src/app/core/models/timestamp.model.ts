import { Pageable } from './pageable.model';
import { Sort } from './sort.model';
import { TimeStampContent } from './timestamp-content.model';

/**
 * Timestamp model
 */
export interface TimpStamp {
  timestampcontent: TimeStampContent[];
  pageable: Pageable;
  totalPages: number;
  last: boolean;
  totalElements: number;
  number: number;
  sort: Sort;
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

