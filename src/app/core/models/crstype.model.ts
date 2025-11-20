import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface CrsType {
  courseTypeId?: string;
  tdesc?: string;
  edesc?: string;
  getCrsTypeDesc() : string
}

export class MyCrsType extends BaseModel implements CrsType {
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data , translateService);
  }

  getCrsTypeDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}
