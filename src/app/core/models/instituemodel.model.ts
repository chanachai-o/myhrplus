import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface InstitueModel {
  institueId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyInstitueModel extends BaseModel implements InstitueModel {
  institueId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<InstitueModel>, translateService: TranslateService) {
    super(data, translateService)
    this.institueId = getDataString(data.institueId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}



