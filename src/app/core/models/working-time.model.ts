import { BaseModel, TranslateService } from './base.model';

/**
 * Working time model
 */
export interface WorkingTimeModel {
  employeeId: string;
  dateId: string;
  startTime: number;
  endTime: number;
  swipeTime: string;
  hourD: number;
  hourS: number;
  lv: number;
  apot: number;
}

export class MyWorkingTimeModel extends BaseModel implements WorkingTimeModel {
  employeeId: string;
  dateId: string;
  startTime: number;
  endTime: number;
  swipeTime: string;
  hourD: number;
  hourS: number;
  lv: number;
  apot: number;

  constructor(data: Partial<WorkingTimeModel>, translateService?: TranslateService) {
    super(data, translateService);
    this.employeeId = data.employeeId ? data.employeeId : '';
    this.dateId = data.dateId ? data.dateId : '';
    this.startTime = data.startTime ? data.startTime : 0;
    this.endTime = data.endTime ? data.endTime : 0;
    this.swipeTime = data.swipeTime ? data.swipeTime : '';
    this.hourD = data.hourD ? data.hourD : 0;
    this.hourS = data.hourS ? data.hourS : 0;
    this.lv = data.lv ? data.lv : 0;
    this.apot = data.apot ? data.apot : 0;
  }
}

