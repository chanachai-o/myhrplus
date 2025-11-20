import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface CrsCategory {
    categoryId?: string;
    tdesc?: string;
    edesc?: string;

    getCrsCategoryDesc() : string;
}
export class MyCrsCategory extends BaseModel implements CrsCategory {
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data , translateService);
  }

  getCrsCategoryDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}
