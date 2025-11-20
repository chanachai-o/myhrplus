import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Highcost1Model } from "./highcost1.model";

export interface HighcostModel {
  companyId: string
  highcost1List: Highcost1Model[]
  status: string
  value: number
  workarea: string
}

export class HighcostModel extends BaseModel implements HighcostModel {
  companyId: string
  highcost1List: Highcost1Model[]
  status: string
  value: number
  workarea: string
  constructor(data: Partial<HighcostModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.highcost1List = data.highcost1List ? data.highcost1List.map(x => new Highcost1Model(x, translateService)) : []
    this.status = data.status ? data.status : ""
    this.value = data.value ? data.value : 0
    this.workarea = data.workarea ? data.workarea : ""
  }
}
