import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface StatusModel {
  statusCode: string
  tdesc: string
  edesc: string
  getDesc(): string
}
export class MyStatusModel extends BaseModel implements StatusModel {
  statusCode: string
  tdesc: string
  edesc: string
  constructor(data: Partial<StatusModel>, translateService: TranslateService) {
    super(data, translateService)
    this.statusCode = getDataString(data.statusCode)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}