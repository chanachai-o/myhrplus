import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { Employee, MyEmployee } from './employee.model';
import { LeaveSummary } from './leaveSummary.model';
import { MyTimeWarning, TimeWarning } from './timeWarning.model';

export interface SupTimeWarn {
    employee?: Employee;
    timeWarning?: TimeWarning[];
    leaveSummary?: LeaveSummary;
}

export class MySupTimeWarn extends BaseModel
  implements SupTimeWarn{
      employee : Employee | undefined;
      timeWarning: TimeWarning[] | undefined;
      constructor(data : Partial<any>,tranSer : TranslateService){
        super(data,tranSer);
        this.employee = new MyEmployee(this.employee! , this.translateService);
        this.timeWarning = this.timeWarning!.map( data=> new MyTimeWarning(data, this.translateService));
      }


  }
