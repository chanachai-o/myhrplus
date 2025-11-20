import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { EmployeeApproveModel } from "./employee-approve.model";

export interface ManagerApproveModel {
  employee: EmployeeApproveModel
  dateManager: string
  timeManager: string
  ququeManager: string
}
export class ManagerApproveModel extends BaseModel implements ManagerApproveModel {
  employee: EmployeeApproveModel
  dateManager: string
  timeManager: string
  ququeManager: string
    constructor(data: Partial<ManagerApproveModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.employee = new EmployeeApproveModel(data.employee ? data.employee : {}, translateService)
        this.dateManager = checkData(data?.dateManager)
        this.timeManager = checkData(data?.timeManager)
        this.ququeManager = checkData(data?.ququeManager)
    }

}

