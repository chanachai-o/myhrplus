import { PageAble } from './pageable.model';
import { Sort2 } from './sort2.model';
import { EmpLeaveSum,MyEmpLeaveSum } from './empLeaveSum.model'
import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';

export interface SupLeaveStat {
    content?: EmpLeaveSum[];
    pageable?: PageAble;
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
export class MySupLeaveStat extends BaseModel
  implements SupLeaveStat{
    content: EmpLeaveSum[] | undefined;

      constructor(data : Partial<any>,tranSer : TranslateService){
        super(data,tranSer);
        this.content = this.content!.map(e=> new MyEmpLeaveSum(e , this.translateService));

 }

  }
