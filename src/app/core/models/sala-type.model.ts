import { TranslateService } from "@ngx-translate/core";
import { BaseCodeDescriptionModel, checkData } from "./base-code-description.model";

/**
 * Salary Type Model
 * Standard model for salary type with code and description
 */
export interface SalaTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
}

export class SalaTypeModel extends BaseCodeDescriptionModel implements SalaTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
  
  constructor(data?: Partial<SalaTypeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.codeId = checkData(data?.codeId) ?? '';
    this.tdesc = checkData(data?.tdesc) ?? '';
    this.edesc = checkData(data?.edesc) ?? '';
  }
  
  // getName() is inherited from BaseCodeDescriptionModel
}

