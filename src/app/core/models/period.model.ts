import { Pageable } from './pageable.model';
import { TimeCurrent } from './time-current.model';

// TODO: Import Sort2 model when migrated
// import { Sort2 } from './sort2.model';

/**
 * Period model - represents paginated time current records
 */
export interface Period {
  content: TimeCurrent[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  sort: any; // TODO: use Sort2 type
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

