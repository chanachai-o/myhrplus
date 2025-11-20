import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface ProvinceModel {
  provinceId: string
  longTname: string
  longEname: string
  getDesc():string
}

export class MyProvinceModel extends BaseModel implements ProvinceModel {
  provinceId: string
  longTname: string
  longEname: string
  constructor(data: Partial<ProvinceModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.provinceId = getDataString(data.provinceId)
    this.longTname = getDataString(data.longTname)
    this.longEname = getDataString(data.longEname)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.longTname : this.longEname
  }
}

