import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface Institue {
  institueId: string | undefined;
  tdesc: string | undefined;
  edesc: string | undefined;
  getInstitueDesc() : string
}

export class MyInstitue extends BaseModel implements Institue {
  institueId: string | undefined;
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data , translateService);
  }
  

  getInstitueDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}
