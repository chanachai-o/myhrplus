import { BaseModel, TranslateService } from './base.model';
import { SubordinatesContent, MySubordinatesContent } from './subordinates-content.model';
import { Pageable } from './pageable.model';
import { Sort2 } from './sort2.model';

/**
 * Subordinates model
 */
export interface SubordinatesModel {
  content: SubordinatesContent[] | undefined;
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  number?: number;
  sort?: Sort2;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export class MySubordinatesModel extends BaseModel implements SubordinatesModel {
  content: SubordinatesContent[] | undefined;
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  number?: number;
  sort?: Sort2;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.content = data.content
      ? data.content.map((item: any) => new MySubordinatesContent(item, translateService))
      : [];
    this.pageable = data.pageable;
    this.totalPages = data.totalPages;
    this.totalElements = data.totalElements;
    this.last = data.last;
    this.number = data.number;
    this.sort = data.sort;
    this.size = data.size;
    this.first = data.first;
    this.numberOfElements = data.numberOfElements;
    this.empty = data.empty;
  }
}

