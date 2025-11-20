import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface SupEmpGroupContent {
  employeeId?: string;
  groupId?: string;
  tdesc: string;
  edesc: string;
  getDesc(): string;
}
export class MySupEmpGroupContent extends BaseModel implements SupEmpGroupContent {
  employeeId?: string = "";
  groupId?: string = "";
  tdesc: string = "";
  edesc: string = "";
  constructor(data: Partial<SupEmpGroupContent>, tranSer: TranslateService) {
    super(data, tranSer)
    this.employeeId = data.employeeId ?? "";
    this.groupId = data.groupId ?? "";
    this.tdesc = data.tdesc!;
    this.edesc = data.edesc!;
  }
  getDesc(): string {
    return this.translateService.currentLang == 'th'
      ? this.tdesc
      : this.edesc;
  }
}
