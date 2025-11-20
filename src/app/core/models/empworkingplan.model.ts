import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";
import { WorkAreaModel } from "./workareamodel.model";
import { Prefix } from "./prefix.model";
import { Bu7, MyBu7 } from "./bu7.model";
import { StatsuWorkingTimeModel } from "./status-workngtime.model";

export interface EmployeeWorkingTiemModel {
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
  status: StatsuWorkingTimeModel
  bu7: Bu7
}
export class EmployeeWorkingTiemModel extends BaseModel implements EmployeeWorkingTiemModel {
  employeeId: string
  prefix: Prefix
  bu7: Bu7
  fname: string
  lname: string
  efname: string
  elname: string
  empType: string
  empPosition: string
  status: StatsuWorkingTimeModel
  thFullName: string
  engFullName: string
    constructor(data: Partial<EmployeeWorkingTiemModel>, translateService?: TranslateService) {
      super(data!, translateService!)
        this.employeeId = checkData(data?.employeeId)
        this.prefix = new Prefix(data.prefix ? data.prefix : {}, translateService)
        this.bu7 = new MyBu7(data.bu7 ? data.bu7 : {}, translateService)
        this.status = new StatsuWorkingTimeModel(data.status ? data.status : {}, translateService)
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

