import { BaseModel, TranslateService } from './base.model';
import { Employee, MyEmployee } from './employee.model';
import { TimeCurrent } from './time-current.model';

/**
 * Subordinates content model
 */
export interface SubordinatesContent {
  employee: Employee | undefined;
  timeCurrent?: TimeCurrent[] | undefined;
}

export class MySubordinatesContent extends BaseModel implements SubordinatesContent {
  employee: Employee | undefined;
  timeCurrent?: TimeCurrent[];

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.employee = data.employee
      ? new MyEmployee(data.employee, this.translateService!)
      : undefined;
    this.timeCurrent = data.timeCurrent
      ? data.timeCurrent.map((item: any) => item) // TODO: Use MyTimeCurrent when available
      : undefined;
  }
}

