import { Pageable } from './pageable.model';
import { Sort } from './sort.model';
import { OtStatContent } from './otstat-content.model';

/**
 * OT stat model
 */
export interface OtStatModel {
  otstatcontent: OtStatContent[];
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

