import { BaseModel, TranslateService } from './base.model';
import { Eventgrp, MyEventgrp } from './eventgrp.model';

/**
 * Work plan model
 */
export interface WorkPlan {
  employeeId: string;
  dateId: string;
  timeCode?: string;
  startDate?: string;
  startTime?: number;
  endDate?: string;
  endTime?: number;
  docNo?: string;
  docType?: string;
  eventgrp?: Eventgrp;
  hourD?: number;
  hourS?: number;
  lv?: number;
  apot?: number;
  costCenter?: string[];
  time0id?: string;
  swipeTime?: string;
  getDateId?(): Date;
}

export class MyWorkPlanModel extends BaseModel implements WorkPlan {
  employeeId: string;
  dateId: string;
  timeCode: string | undefined;
  startDate: string | undefined;
  startTime: number | undefined;
  endDate: string | undefined;
  endTime: number | undefined;
  docNo: string | undefined;
  docType: string | undefined;
  eventgrp: Eventgrp | undefined;
  hourD: number | undefined;
  hourS: number | undefined;
  lv: number | undefined;
  apot: number | undefined;
  costCenter: string[] = [];
  swipeTime?: string;
  time0id: string | undefined;

  constructor(data: Partial<WorkPlan>, translateService: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId || '';
    this.dateId = data.dateId || '';
    this.timeCode = data.timeCode;
    this.startDate = data.startDate;
    this.startTime = data.startTime;
    this.endDate = data.endDate;
    this.endTime = data.endTime;
    this.docNo = data.docNo;
    this.docType = data.docType;
    this.hourD = data.hourD;
    this.hourS = data.hourS;
    this.lv = data.lv;
    this.apot = data.apot;
    this.time0id = data.time0id;
    this.costCenter = data.costCenter || [];
    this.swipeTime = data.swipeTime;
    this.eventgrp = data.eventgrp
      ? new MyEventgrp(data.eventgrp, this.translateService!)
      : undefined;
  }

  getDateId(): Date {
    // TODO: Use Calendar service when available
    return this.dateId ? new Date(this.dateId) : new Date();
  }
}

