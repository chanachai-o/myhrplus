import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface OccupationModel {
  occId: string,
  tdesc: string,
  edesc: string
  getDesc(): string
}

export class MyOccupationModel extends BaseModel implements OccupationModel {
  occId: string
  tdesc: string
  edesc: string
  constructor(data: Partial<OccupationModel>, translateService: TranslateService) {
    super(data, translateService)
    this.occId = getDataString(data.occId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

