import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Employee, MyEmployee } from "./employee.model";
import { LeaveSummary, MyLeaveSummary } from "./leaveSummary.model";

export interface EmpLeaveSum {
    employee?: Employee;
    leaveSummary?: LeaveSummary;
}
export class MyEmpLeaveSum extends BaseModel implements EmpLeaveSum{
      employee : Employee | undefined;
      leaveSummary : LeaveSummary | undefined;

      constructor(data : Partial<any>,tranSer : TranslateService){
        super(data,tranSer);
        this.employee = new MyEmployee(this.employee! , this.translateService);
        this.leaveSummary = new MyLeaveSummary(this.leaveSummary!,this.translateService);
      }


  }
