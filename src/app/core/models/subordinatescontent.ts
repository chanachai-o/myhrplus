import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { Employee, MyEmployee } from './employee.model';
import { MyTimeCurrent, TimeCurrent } from './timecurrent.model';
import { from } from 'rxjs';
export interface SubordinatesContent {
  employee: Employee | undefined;
  timeCurrent?: TimeCurrent[] | undefined;
}

export class MySubordinatesContent extends BaseModel
  implements SubordinatesContent {
  employee: Employee | undefined;
  timeCurrent?: TimeCurrent[];

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.employee = new MyEmployee(this.employee!, this.translateService);
    this.timeCurrent = this.timeCurrent!.map( data=> new MyTimeCurrent(data, this.translateService));
  }
}
