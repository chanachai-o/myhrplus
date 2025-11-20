import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface Academy {
  academyId?: string;
  tdesc?: string;
  edesc?: string;
  photo?: string;
  getAcademyDesc?() : string;
}


export class MyAcademy extends BaseModel implements Academy{
  tdesc : string | undefined;
  edesc : string | undefined;


  constructor(data : Partial<any>,tranSer : TranslateService) {
    super(data,tranSer);

  }

  getAcademyDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }

}
