import { BaseModel, TranslateService } from './base.model';
import { TrainingContent, MyTrainingContent } from './training-content.model';
import { Pageable } from './pageable.model';
import { Sort2 } from './sort2.model';

/**
 * Training history model
 */
export interface TrainingHistoryModel {
  content?: TrainingContent[];
  pageable?: Pageable;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  number?: number;
  sort?: Sort2;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export class MyTrainingHistoryModel extends BaseModel implements TrainingHistoryModel {
  content: TrainingContent[] | undefined;
  pageable?: Pageable;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  number?: number;
  sort?: Sort2;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    if (data.content) {
      this.content = data.content.map((item: any) =>
        new MyTrainingContent(item, translateService)
      );
    }
    this.pageable = data.pageable;
    this.last = data.last;
    this.totalPages = data.totalPages;
    this.totalElements = data.totalElements;
    this.number = data.number;
    this.sort = data.sort;
    this.size = data.size;
    this.first = data.first;
    this.numberOfElements = data.numberOfElements;
    this.empty = data.empty;
  }
}

