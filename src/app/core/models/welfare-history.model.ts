import { Pageable } from './pageable.model';
import { Sort } from './sort.model';
import { Complain } from './complain.model';

/**
 * Welfare history model
 */
export interface WelHis {
  complain?: Complain[];
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  number?: number;
  sort?: Sort;
  size?: number;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
}

