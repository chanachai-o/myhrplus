import { PageAble } from './pageable.model';
import { Sort2 } from './sort2.model';
import { MySupEmpGroupContent, SupEmpGroupContent } from './empGroup.model';
import { BaseModel } from './base.model';
import { TranslateService } from '@ngx-translate/core';

export interface SupEmpGroup {
    content: SupEmpGroupContent[] | undefined;
    pageable?: PageAble;
    totalPages?: number;
    totalElements?: number;
    last?: boolean;
    number?: number;
    sort?: Sort2;
    size?: number;
    numberOfElements?: number;
    first?: boolean;
    empty?: boolean;
}

export class MySupEmpGroup extends BaseModel implements SupEmpGroup{
  content : SupEmpGroupContent[] | undefined;

  constructor(data : Partial<any> , tranSer : TranslateService){
    super(data,tranSer)
    this.content = this.content!.map(content => new MySupEmpGroupContent(content,tranSer));
  }
}
