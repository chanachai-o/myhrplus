import { TranslateService } from "@ngx-translate/core";
import { BaseModel, dataToArray } from "./base.model";

export interface ListApprovedModel {
  dataId: string
  status: string
  employeeId: string[]
}

export class ListApprovedModel extends BaseModel implements ListApprovedModel {
  dataId: string
  status: string
  employeeId: string[]

  constructor(data: Partial<any>) {
    super(data);
    this.employeeId = dataToArray(data?.employeeId)
    this.dataId = data.dataId ? data.dataId : ""
    this.status = data.status ? data.status : ""
  }

}
