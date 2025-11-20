import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Mrate1Model } from "./mrate1.model";
import { EmpPositionModel } from "./empposition.model";

export interface MemplGroupAllowance1Model {
  companyId: string
  lineNo: string
  mposition: EmpPositionModel
}

export class MemplGroupAllowance1Model extends BaseModel implements MemplGroupAllowance1Model {
  companyId: string
  lineNo: string
  mposition: EmpPositionModel
  constructor(data: Partial<MemplGroupAllowance1Model>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.lineNo = data.lineNo ? data.lineNo : ""
    this.mposition = data.mposition ? new EmpPositionModel(data.mposition, translateService) : new EmpPositionModel({}, translateService)
  }
}
