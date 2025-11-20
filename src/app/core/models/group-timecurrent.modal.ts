import { TranslateService } from "@ngx-translate/core";
import { BaseModel, dataToArray } from "./base.model";
import { WorkAreaModel } from "./workareamodel.model";
import { EmployeeTimeCurrentModel } from "./employee-timecurrent.modal";

export interface GroupTimeCurrentModel {
  workarea: WorkAreaModel
  amountEmployee: number
  status: boolean
  ttimeCurrentWorkareaEmployee: EmployeeTimeCurrentModel[]
}

export class GroupTimeCurrentModel extends BaseModel implements GroupTimeCurrentModel {
  workarea: WorkAreaModel
  amountEmployee: number
  status: boolean
  ttimeCurrentWorkareaEmployee: EmployeeTimeCurrentModel[]

  constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
      this.workarea = data.workarea ? new WorkAreaModel(data.workarea, translateService) : new WorkAreaModel({})
      this.amountEmployee = data.amountEmployee ? data.amountEmployee  : 0
      this.status = data.status?data.status:false
      this.ttimeCurrentWorkareaEmployee = dataToArray(data?.ttimeCurrentWorkareaEmployee).map((x: EmployeeTimeCurrentModel) => new EmployeeTimeCurrentModel(x, translateService))
  }


}
