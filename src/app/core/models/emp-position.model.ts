import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";

export interface EmpPositionModel {
  positionId: string;
  tdesc: string;
  edesc: string;
  consolidate: string;
  shortName: string;
}

export class EmpPositionModel extends BaseModel implements EmpPositionModel {
  positionId: string;
  tdesc: string;
  edesc: string;
  consolidate: string;
  shortName: string;
  
  constructor(data?: Partial<EmpPositionModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.positionId = checkData(data?.positionId);
    this.tdesc = checkData(data?.tdesc);
    this.edesc = checkData(data?.edesc);
    this.consolidate = checkData(data?.consolidate);
    this.shortName = checkData(data?.shortName);
  }
  
  getName() {
    return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
  }
}

