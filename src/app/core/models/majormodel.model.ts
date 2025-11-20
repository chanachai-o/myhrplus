import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface MajorModel {
  majorId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyMajorModel extends BaseModel implements MajorModel {
  majorId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<MajorModel>, translateService: TranslateService) {
    super(data, translateService)
    this.majorId = getDataString(data.majorId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
