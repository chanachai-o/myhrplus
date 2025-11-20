import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MyProvinceModel, ProvinceModel } from "./provincemodel.model";

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

function getDataModel(data: any): any {
  return data ? data : {}
}

export interface DistrictModel {
  districtId: string
  tdesc: string
  edesc: string
  province: ProvinceModel
  getDesc(): string
}

export class MyDistrictModel extends BaseModel implements DistrictModel {
  districtId: string
  tdesc: string
  edesc: string
  province: ProvinceModel
  constructor(data: Partial<DistrictModel>, translateService: TranslateService) {
    super(data, translateService);
    this.districtId = getDataString(data.districtId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.province = new MyProvinceModel(getDataModel(data.province), translateService)
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

