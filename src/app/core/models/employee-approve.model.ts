import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { WorkAreaModel } from "./workareamodel.model";
import { Prefix } from "./prefix.model";
import { MyOldJob, OldJob } from "./oldjob.model";

export interface EmployeeApproveModel {
  employeeId: string
  prefix: Prefix
  fname: string
  lname: string
  efname: string
  elname: string
  empType: string
  empPosition: string
  thFullName: string
  engFullName: string
  job: OldJob
}
export class EmployeeApproveModel extends BaseModel implements EmployeeApproveModel {
  employeeId: string
  prefix: Prefix
  fname: string
  lname: string
  efname: string
  elname: string
  empType: string
  empPosition: string
  thFullName: string
  engFullName: string
  job: OldJob
    constructor(data: Partial<EmployeeApproveModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.employeeId = checkData(data?.employeeId)
        this.prefix = new Prefix(data.prefix ? data.prefix : {}, translateService)
        this.job = new MyOldJob(data.job ? data.job : {}, translateService)
        this.fname = checkData(data?.fname)
        this.lname = checkData(data?.lname)
        this.efname = checkData(data?.efname)
        this.elname = checkData(data?.elname)
        this.empType = checkData(data?.empType)
        this.empPosition = checkData(data?.empPosition)
        this.thFullName = checkData(data?.thFullName)
        this.engFullName = checkData(data?.engFullName)
    }

}

