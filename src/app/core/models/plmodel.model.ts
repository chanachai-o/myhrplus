import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface PlModel {
  plId: string
  tdesc: string
  edesc: string
  getDesc(): string
}
export class MyPlModel extends BaseModel implements PlModel {
  plId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<PlModel>, translateService: TranslateService) {
    super(data, translateService)
    this.plId = getDataString(data.plId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

