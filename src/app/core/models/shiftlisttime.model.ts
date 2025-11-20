import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Eventgrp } from "./eventgrp.model";

export interface ShiftListTimeModel {
    apot: number | undefined
    dateId: string | undefined
    docNo: string | undefined
    docType: string | undefined
    edesc: string | undefined
    employeeId: string | undefined
    endDate: string | undefined
    endTime: number | undefined
    eventgrp: Eventgrp | undefined
    hourD: number | undefined
    hourS: number | undefined
    lv: number | undefined
    startDate: string | undefined
    startTime: number | undefined
    tdesc: string | undefined
    timeCode: string | undefined
    getDesc() : string;
}
export class MyShiftListTimeModel extends BaseModel implements ShiftListTimeModel {
  apot: number | undefined;
  dateId: string | undefined;
  docNo: string | undefined;
  docType: string | undefined;
  edesc: string | undefined;
  employeeId: string | undefined;
  endDate: string | undefined;
  endTime: number | undefined;
  eventgrp: Eventgrp | undefined;
  hourD: number | undefined;
  hourS: number | undefined;
  lv: number | undefined;
  startDate: string | undefined;
  startTime: number | undefined;
  tdesc: string | undefined;
  timeCode: string | undefined;
  constructor(data: Partial<ShiftListTimeModel>, translateService: TranslateService) {
      super(data, translateService);
  }
  getDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  } 
}


