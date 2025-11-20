import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface ReligionModel {
  religionId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyReligionModel extends BaseModel implements ReligionModel {
  religionId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<ReligionModel>, translateService: TranslateService) {
    super(data, translateService)
    this.religionId = getDataString(data.religionId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
