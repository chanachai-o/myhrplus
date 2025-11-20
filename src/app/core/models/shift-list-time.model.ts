import { BaseModel, TranslateService } from './base.model';
import { Eventgrp } from './eventgrp.model';

/**
 * Shift list time model
 */
export interface ShiftListTimeModel {
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
  getDesc(): string;
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
    this.apot = data.apot;
    this.dateId = data.dateId;
    this.docNo = data.docNo;
    this.docType = data.docType;
    this.edesc = data.edesc;
    this.employeeId = data.employeeId;
    this.endDate = data.endDate;
    this.endTime = data.endTime;
    this.eventgrp = data.eventgrp;
    this.hourD = data.hourD;
    this.hourS = data.hourS;
    this.lv = data.lv;
    this.startDate = data.startDate;
    this.startTime = data.startTime;
    this.tdesc = data.tdesc;
    this.timeCode = data.timeCode;
  }

  getDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

