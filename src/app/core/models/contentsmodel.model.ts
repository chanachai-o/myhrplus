import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { Content } from "./content.model";
import { PageAble } from "./pageable.model";
import { Sort } from "./sort.model";

export interface ContentsModel {
  content?: Content[];
  pageable?: PageAble;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  number?: number;
  sort?: Sort;
  size?: number;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
}




