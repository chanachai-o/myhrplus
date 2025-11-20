import { TranslateService } from "@ngx-translate/core";
import { BaseModel, baseGetName, checkData } from "./base.model";

export interface EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
}

export class EmpTypeModel extends BaseModel implements EmpTypeModel {
  codeId: string;
  tdesc: string;
  edesc: string;
  
    constructor(data: Partial<EmpTypeModel>, translateService?: TranslateService) {
        super(data, translateService);
        this.codeId = checkData(data?.codeId);
        this.tdesc = checkData(data?.tdesc);
        this.edesc = checkData(data?.edesc);
    }
    
    getName() {
        return baseGetName(this.tdesc, this.edesc, this.translateService?.currentLang);
    }
}

