import { TranslateService } from "@ngx-translate/core";
import { Absent, MyAbsent } from "./absent.model";
import { BaseModel } from "./base.model";
import { PageAble } from './pageable.model';
import { Sort } from './sort.model';

export interface LeaveStat {
    absent: Absent[] | undefined;
    pageable?: PageAble;
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

  constructor(data : Partial<any>, translateService : TranslateService){
      super(data,translateService);
      this.absent = this.absent!.map(dataContent => new MyAbsent(dataContent , translateService))

  }

}



