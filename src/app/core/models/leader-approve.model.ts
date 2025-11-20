import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { EmployeeApproveModel } from "./employee-approve.model";

export interface LeaderApproveModel {
  employee: EmployeeApproveModel
  dateLeader: string
  timeLeader: string
  ququeLeader: string
}
export class LeaderApproveModel extends BaseModel implements LeaderApproveModel {
  employee: EmployeeApproveModel
  dateLeader: string
  timeLeader: string
  ququeLeader: string
    constructor(data: Partial<LeaderApproveModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.employee = new EmployeeApproveModel(data.employee ? data.employee : {}, translateService)
        this.dateLeader = checkData(data?.dateLeader)
        this.timeLeader = checkData(data?.timeLeader)
        this.ququeLeader = checkData(data?.ququeLeader)
    }

}

