import { MyCalendar } from '../services/Calendar';
import { TranslateService } from '@ngx-translate/core';
import { BaseModel } from './base.model';
import { Eventgrp, MyEventgrp } from './eventgrp.model';

export interface SupTimeAttendanceModel {
  employeeId?: string;
  dateId?: string;
  timeCode?: string;
  startDate?: string;
  startTime?: number;
  endDate?: string;
  endTime?: number;
  docNo?: string;
  docType?: string;
  eventgrp?: Eventgrp;
  hourD?: number;
  lv?: number;
  apot?: number;
  swiptime?: string[];
  time0id?: string;
  empName?: string;
  getDateId(): Date;
}

export class MySupTimeAttendanceModel extends BaseModel
  implements SupTimeAttendanceModel {
  eventgrp: Eventgrp | undefined;
  dateId: string = "";

  constructor(data: Partial<any>, tranSer: TranslateService) {
    super(data, tranSer);
    this.eventgrp = new MyEventgrp(this.eventgrp!, this.translateService);
    this.dateId = data.dateId;
  }
  getDateId(): Date {
    return new MyCalendar(this.dateId).toDate();
  }
}
