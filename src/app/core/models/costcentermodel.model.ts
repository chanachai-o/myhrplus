import { TranslateService } from "@ngx-translate/core"
import { BaseModel } from "./base.model"

function getDataString(data: any): string {
  return (data != undefined && data != null) ? data.toString() : ''
}

export interface CostcenterModel {
  costcenterId: string
  costCenterId: string
  tdesc: string
  edesc: string
  mainCostCenterCode: string
  getDesc(): string
}
export class MyCostcenterModel extends BaseModel implements CostcenterModel {
  costcenterId: string
  costCenterId: string
  tdesc: string
  edesc: string
  mainCostCenterCode: string
  constructor(data: Partial<CostcenterModel>, translateService: TranslateService) {
    super(data, translateService)
    this.costcenterId = getDataString(data.costcenterId)
    this.costCenterId = getDataString(data.costCenterId)
    this.tdesc = getDataString(data.tdesc)
    this.edesc = getDataString(data.edesc)
    this.mainCostCenterCode = getDataString(data.mainCostCenterCode)
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th' ? this.tdesc : this.edesc
  }
}

