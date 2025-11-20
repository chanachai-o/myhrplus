import { BaseModel, TranslateService } from './base.model';
import { Absent, MyAbsent } from './absent.model';
import { Pageable } from './pageable.model';
import { Sort } from './sort.model';

/**
 * Leave stat model
 */
export interface LeaveStat {
  absent: Absent[] | undefined;
  pageable?: Pageable;
  totalPages?: number;
  last?: boolean;
  totalElements?: number;
  number?: number;
  sort?: Sort;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export class MyEmpLeaveStat extends BaseModel implements LeaveStat {
  absent: Absent[] | undefined;
  pageable?: Pageable;
  totalPages?: number;
  last?: boolean;
  totalElements?: number;
  number?: number;
  sort?: Sort;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.absent = data.absent
      ? data.absent.map((item: any) => new MyAbsent(item, translateService))
      : [];
    this.pageable = data.pageable;
    this.totalPages = data.totalPages;
    this.last = data.last;
    this.totalElements = data.totalElements;
    this.number = data.number;
    this.sort = data.sort;
    this.size = data.size;
    this.first = data.first;
    this.numberOfElements = data.numberOfElements;
    this.empty = data.empty;
  }
}

