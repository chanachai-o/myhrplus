import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface ChangeMoneyModel {
  fundtableId?: string;
  tdesc?: string;
  edesc?: string;
  getChangeMoneyDesc() : string;
}

export class MyChangeMoneyModel extends BaseModel implements ChangeMoneyModel{
  fundtableId?: string;
  tdesc : string | undefined;
  edesc : string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.fundtableId = data.fundtableId? data.fundtableId : "";
    this.tdesc = data.tdesc? data.tdesc : "";
    this.edesc = data.edesc? data.edesc : "";
  }

  getChangeMoneyDesc(): string{
  return this.translateService.currentLang == 'th' ? (this.tdesc?this.tdesc:""): (this.edesc?this.edesc:"");
  }
}
