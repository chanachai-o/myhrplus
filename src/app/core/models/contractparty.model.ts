import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";


export interface ContractPartyModel {
  partyId: string
  companyId: string
  tname: string
  ename: string
  creditorId: string
  active: string
}

export class ContractPartyModel extends BaseModel implements ContractPartyModel {
  partyId: string
  companyId: string
  tname: string
  ename: string
  creditorId: string
  active: string
    constructor(data: Partial<ContractPartyModel>, translateService: TranslateService) {
        super(data, translateService)
        this.partyId = checkData(data?.partyId)
        this.companyId = checkData(data?.companyId)
        this.tname = checkData(data?.tname)
        this.ename = checkData(data?.ename)
        this.creditorId = checkData(data?.creditorId)
        this.active = checkData(data?.active)
    }
    getName() {
        return baseGetName(this.tname, this.ename, this.translateService?.currentLang)
    }
}

