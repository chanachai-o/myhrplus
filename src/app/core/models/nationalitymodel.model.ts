import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface NationalityModel {
  nationalityId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyNationalityModel extends BaseModel implements NationalityModel {
  nationalityId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<NationalityModel>, translateService: TranslateService) {
    super(data, translateService)
    this.nationalityId = getDataString(data.nationalityId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

