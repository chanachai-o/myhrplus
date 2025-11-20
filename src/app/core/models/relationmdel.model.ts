import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface FamilyralationModel {
  relationId: string;
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyFamilyralationModel extends BaseModel implements FamilyralationModel {
  relationId: string;
  tdesc: string
  edesc: string
  constructor(data: Partial<FamilyralationModel>, translateService: TranslateService) {
    super(data, translateService)
    this.relationId = getDataString(data.relationId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
