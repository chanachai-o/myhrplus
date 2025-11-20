import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface DegreeModel {
  degreeId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyDegreeModel extends BaseModel implements DegreeModel {
  degreeId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<DegreeModel>, translateService: TranslateService) {
    super(data, translateService)
    this.degreeId = getDataString(data.degreeId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
