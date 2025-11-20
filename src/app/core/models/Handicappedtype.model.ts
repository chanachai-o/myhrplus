import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";

export interface HandicappedTypeModel {
  handicappedTypeId: string
  companyId: string
  tdesc: string
  edesc: string
}

export class HandicappedTypeModel extends BaseModel implements HandicappedTypeModel {
  handicappedTypeId: string
  companyId: string
  tdesc: string
  edesc: string
    constructor(data?: Partial<HandicappedTypeModel>, translateService?: TranslateService) {
        super(data!, translateService!)
        this.handicappedTypeId = checkData(data?.handicappedTypeId)
        this.companyId = checkData(data?.companyId)
        this.tdesc = checkData(data?.tdesc)
        this.edesc = checkData(data?.edesc)
    }
    getName() {
        return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang)
    }
}

