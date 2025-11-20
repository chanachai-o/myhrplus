import { BaseModel, TranslateService } from './base.model';
import { Employee, MyEmployee } from './employee.model';
import { LeaveSummary, MyLeaveSummary } from './leave-summary.model';

/**
 * Employee leave summary model
 */
export interface EmpLeaveSum {
  employee?: Employee;
  leaveSummary?: LeaveSummary;
}

export class MyEmpLeaveSum extends BaseModel implements EmpLeaveSum {
  employee: Employee | undefined;
  leaveSummary: LeaveSummary | undefined;

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.employee = data.employee
      ? new MyEmployee(data.employee, this.translateService!)
      : undefined;
    this.leaveSummary = data.leaveSummary
      ? new MyLeaveSummary(data.leaveSummary, this.translateService!)
      : undefined;
  }
}

