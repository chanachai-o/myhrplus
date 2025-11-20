import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface CrsGroup {
  courseGroupId?: string;
  tdesc?: string;
  edesc?: string;
  getCrsGroupDesc() : string
}

export class MyCrsGroup extends BaseModel implements CrsGroup {
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data , translateService);
  }

  getCrsGroupDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}
