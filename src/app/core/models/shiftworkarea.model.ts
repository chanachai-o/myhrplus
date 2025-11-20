import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { WorkArea1Model } from "./workarea1.model";

export interface ShiftWorkareaModel {
  companyId: string
  edesc: string
  groupFilter: string
  groupId: string
  tdesc: string
}

export class ShiftWorkareaModel extends BaseModel implements ShiftWorkareaModel {
  tdesc: string = "";
  edesc: string = "";
  companyId: string = "";
  groupId: string = "";
  groupFilter: string = "";

  constructor(data: Partial<ShiftWorkareaModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.companyId = data.companyId ? data.companyId : ""
    this.edesc = data.edesc ? data.edesc : ""
    this.groupFilter = data.groupFilter ? data.groupFilter : ""
    this.groupId = data.groupId ? data.groupId : ""
    this.tdesc = data.tdesc ? data.tdesc : ""
  }

  getWorkAreaDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.tdesc
      : this.edesc;
  }
}

