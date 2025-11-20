import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { KerryEmpModel } from "./kerry-mix-model.model";
import { TimeCurrentSumModel } from "./ttimecurrentsum.modal";

export interface EmployeeTimeCurrentModel {
  employee: KerryEmpModel
  ttimeCurrentSum: TimeCurrentSumModel
}

export class EmployeeTimeCurrentModel extends BaseModel implements EmployeeTimeCurrentModel {
  employee: KerryEmpModel
  ttimeCurrentSum: TimeCurrentSumModel

  constructor(data: Partial<any>, translateService: TranslateService) {
      super(data, translateService);
      this.employee = data.employee ? new KerryEmpModel(data.employee, translateService) : new KerryEmpModel({})
      this.ttimeCurrentSum = data.ttimeCurrentSum?new TimeCurrentSumModel(data.ttimeCurrentSum, translateService):new TimeCurrentSumModel({}, translateService)
  }


}
