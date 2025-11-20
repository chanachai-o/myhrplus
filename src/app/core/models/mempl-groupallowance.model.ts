import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { MemplGroupAllowance1Model } from "./mempl-groupallowance1.model";

export interface MemplGroupAllowanceModel {
  allday: number
  companyId: string
  forenoon: number
  groupallowanceId: string
  memplGroupAllowance1List: MemplGroupAllowance1Model[]
  midday: number
  status: string
  twilight: number
}

export class MemplGroupAllowanceModel extends BaseModel implements MemplGroupAllowanceModel {
  allday: number
  companyId: string
  forenoon: number
  groupallowanceId: string
  memplGroupAllowance1List: MemplGroupAllowance1Model[]
  midday: number
  status: string
  twilight: number
  constructor(data: Partial<MemplGroupAllowanceModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.allday = data.allday ? data.allday : 0
    this.companyId = data.companyId ? data.companyId : ""
    this.forenoon = data.forenoon ? data.forenoon : 0
    this.groupallowanceId = data.groupallowanceId ? data.groupallowanceId : ""
    this.memplGroupAllowance1List = data.memplGroupAllowance1List ? data.memplGroupAllowance1List.map(x => new MemplGroupAllowance1Model(x, translateService)) : []
    this.midday = data.midday ? data.midday : 0
    this.status = data.status ? data.status : ""
    this.twilight = data.twilight ? data.twilight : 0
  }
}
