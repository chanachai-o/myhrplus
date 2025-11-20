import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface NationalModel {
  nationalId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyNationalModel extends BaseModel implements NationalModel {
  nationalId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<NationalModel>, translateService: TranslateService) {
    super(data, translateService)
    this.nationalId = getDataString(data.nationalId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

