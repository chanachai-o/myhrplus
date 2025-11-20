import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { EmpPositionModel } from "./empposition.model";

export interface Highcost1Model {
  companyId: string
  lineNo: string
  mposition: EmpPositionModel
  status: string
}

export class Highcost1Model extends BaseModel implements Highcost1Model {
  companyId: string
  lineNo: string
  mposition: EmpPositionModel
  status: string
  constructor(data: Partial<Highcost1Model>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.lineNo = data.lineNo ? data.lineNo : ""
    this.mposition = new EmpPositionModel(data.mposition ? data.mposition : {}, translateService)
    this.status = data.status ? data.status : ""
  }
}
