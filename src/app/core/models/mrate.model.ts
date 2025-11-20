import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Mrate1Model } from "./mrate1.model";

export interface MrateModel {
  companyId: string
  edesc: string
  effDate: string
  groupId: string
  mrate1List: Mrate1Model[]
  rateId: string
  status: string
  tdesc: string
  type: string
}

export class MrateModel extends BaseModel implements MrateModel {
  companyId: string
  edesc: string
  effDate: string
  groupId: string
  mrate1List: Mrate1Model[]
  rateId: string
  status: string
  tdesc: string
  type: string
  constructor(data: Partial<MrateModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.effDate = data.effDate ? data.effDate : ""
    this.groupId = data.groupId ? data.groupId : ""
    this.mrate1List = data.mrate1List ? data.mrate1List.map(x => new Mrate1Model(x, translateService)) : []
    this.rateId = data.rateId ? data.rateId : ""
    this.status = data.status ? data.status : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
    this.type = data.type ? data.type : ""
  }

  getDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.tdesc
      : this.edesc;
  }
}
