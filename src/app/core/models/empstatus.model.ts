import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";


export interface EmpStatusModel {
  statusCode: string
  statusType: string
  tdesc: string
  edesc: string
}
export class EmpStatusModel extends BaseModel implements EmpStatusModel {
  statusCode: string
  statusType: string
  tdesc: string
  edesc: string
    constructor(data?: Partial<EmpStatusModel>, translateService?: TranslateService) {
        super(data, translateService)
        this.statusCode = checkData(data?.statusCode)
        this.statusType = checkData(data?.statusType)
        this.tdesc = checkData(data?.tdesc)
        this.edesc = checkData(data?.edesc)
    }
    getName() {
        return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang)
    }
}

