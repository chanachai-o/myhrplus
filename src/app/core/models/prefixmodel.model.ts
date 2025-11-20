import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface PrefixModel {
  prefixId: string
  tdesc: string
  edesc: string
  getDesc(): string
}

export class MyPrefixModel extends BaseModel implements PrefixModel {
  prefixId: string
  tdesc: string
  edesc: string

  constructor(data: Partial<PrefixModel>, translateService: TranslateService) {
    super(data, translateService);
    this.prefixId = getDataString(data.prefixId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)

  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}
