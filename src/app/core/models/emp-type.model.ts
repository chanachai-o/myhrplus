import { TranslateService } from "@ngx-translate/core";
import { BaseCodeDescriptionModel, checkData } from "./base-code-description.model";

/**
 * Employee Type Model
 * Standard model for employee type with code and description
 */
export interface EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
}

export class EmpTypeModel extends BaseCodeDescriptionModel implements EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
  
  constructor(data?: Partial<EmpTypeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.codeId = checkData(data?.codeId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
  }
  
  // getName() is inherited from BaseCodeDescriptionModel
}

