import { BaseModel, TranslateService } from './base.model';
import { Eventgrp, MyEventgrp } from './eventgrp.model';

/**
 * Dayoff model - represents leave/absence record
 */
export interface Dayoff {
  employeeId: string;
  dateId: string;
  timeCode: string;
  timeCodeTdesc: string;
  timeCodeEdesc: string;
  startDate: string;
  startTime: number;
  endDate: string;
  endTime: number;
  swipeTime: string;
  docNo: string;
  docType: string;
  eventgrp: Eventgrp;
  hourD: number;
  hourS: number;
  lv: number;
  apot: number;
  trType: string;
  getDesc?(): string;
}

export class MyDayOff extends BaseModel implements Dayoff {
  employeeId: string;
  dateId: string;
  timeCode: string;
  timeCodeTdesc: string;
  timeCodeEdesc: string;
  startDate: string;
  startTime: number;
  endDate: string;
  endTime: number;
  swipeTime: string;
  docNo: string;
  docType: string;
  eventgrp: Eventgrp;
  hourD: number;
  hourS: number;
  lv: number;
  apot: number;
  trType: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId || '';
    this.dateId = data.dateId || '';
    this.timeCode = data.timeCode || '';
    this.timeCodeTdesc = data.timeCodeTdesc || '';
    this.timeCodeEdesc = data.timeCodeEdesc || '';
    this.startDate = data.startDate || '';
    this.startTime = data.startTime || 0;
    this.endDate = data.endDate || '';
    this.endTime = data.endTime || 0;
    this.swipeTime = data.swipeTime || '';
    this.docNo = data.docNo || '';
    this.docType = data.docType || '';
    this.eventgrp = data.eventgrp
      ? new MyEventgrp(data.eventgrp, this.translateService!)
      : {} as Eventgrp;
    this.hourD = data.hourD || 0;
    this.hourS = data.hourS || 0;
    this.lv = data.lv || 0;
    this.apot = data.apot || 0;
    this.trType = data.trType || '';
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th' 
      ? this.timeCodeTdesc 
      : this.timeCodeEdesc;
  }
}

