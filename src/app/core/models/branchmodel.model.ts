import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface BranchModel {
  branchId: string
  tdesc: string
  edesc: string
  getDesc(): string
}
export class MyBranchModel extends BaseModel implements BranchModel {
  branchId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<BranchModel>, translateService: TranslateService) {
    super(data, translateService)
    this.branchId = getDataString(data.branchId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
