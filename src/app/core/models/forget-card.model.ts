import { Pageable } from './pageable.model';
import { ContentForgetCard } from './content-forget-card.model';

/**
 * Forget card model
 */
export interface ForgetCard {
  content: ContentForgetCard[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable?: Pageable;
  size: number;
  totalElements?: number;
  totalPages: number;
}

