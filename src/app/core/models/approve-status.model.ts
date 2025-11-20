import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { WorkAreaModel } from "./workareamodel.model";
import { LeaderApproveModel } from "./leader-approve.model";
import { ManagerApproveModel } from "./manager-approve.model";

export interface ApproveStatusModel {
  workarea: WorkAreaModel
  period: string
  leaderApprove: LeaderApproveModel
  managerApprove: ManagerApproveModel
}

export class ApproveStatusModel extends BaseModel implements ApproveStatusModel {
  workarea: WorkAreaModel
  period: string
  leaderApprove: LeaderApproveModel
  managerApprove: ManagerApproveModel
    constructor(data: Partial<ApproveStatusModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.workarea = new WorkAreaModel(data.workarea ? data.workarea : {}, translateService)
        this.period = checkData(data?.period)
        this.leaderApprove = new LeaderApproveModel(data.leaderApprove ? data.leaderApprove : {}, translateService)
        this.managerApprove = new ManagerApproveModel(data.managerApprove ? data.managerApprove : {}, translateService)
    }

}

