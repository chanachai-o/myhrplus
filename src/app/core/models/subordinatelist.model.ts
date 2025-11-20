import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface SubordinateModel {
  employeeId: string
  groupId: string
  tdesc: string
  edesc: string
  subData: string
  getDesc(): string
}

export class MySubordinateModel extends BaseModel implements SubordinateModel {
  employeeId: string
  groupId: string
  tdesc: string
  edesc: string
  subData: string
  constructor(data: Partial<SubordinateModel>, translateService: TranslateService) {
    super(data, translateService)
    this.employeeId = getDataString(data.employeeId)
    this.groupId = getDataString(data.groupId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.subData = getDataString(data.subData)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
