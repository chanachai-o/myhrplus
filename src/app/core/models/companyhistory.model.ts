import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface CompanyHistoryModel{
  mcomId?: string;
  topic?: string;
  etopic?: string;
  tdesc?: string;
  edesc?: string;
  getHistory(): string;
}
export class MyCompanyHistory extends BaseModel implements CompanyHistoryModel{
  mcomId?: string;
  topic?: string;
  etopic?: string;
  tdesc?: string;
  edesc?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);

  }

  getHistory(): string{
  return this.translateService.currentLang == 'th'
  ? this.tdesc!
  : this.edesc!;
  }
}


