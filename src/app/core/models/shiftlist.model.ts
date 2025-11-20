import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

export interface ShiftListModel {
  time0Id?: any;
  startDate?: any;
  endDate?: string ;
  employeeId?: string;
  time0id: string | undefined;
  edesc: string | undefined;
  tdesc: string | undefined;
  companyid?: string ;
  getDesc?(): string
}

export class MyShiftListModel extends BaseModel implements ShiftListModel {
  employeeId?: string;
  time0id: string | undefined;
  edesc: string | undefined;
  tdesc: string | undefined;
  startDate?: string ;
  endDate?: string ;
  time0Id?: any;
  companyid?: string ;

  constructor(data: Partial<ShiftListModel>, translateService: TranslateService) {
    super(data, translateService);
  }
  getDesc() {
    return this.translateService.currentLang == 'th'
      ? this.tdesc!
      : this.edesc!;
  }
}
