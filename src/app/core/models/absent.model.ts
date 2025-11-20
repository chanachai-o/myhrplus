import { BaseModel, TranslateService } from './base.model';
import { MyTypeAbsent, TypeAbsent } from './type-absent.model';

/**
 * Absent model
 */
export interface Absent {
  absentid?: string;
  employeeId?: string;
  type_absent?: TypeAbsent;
  start_date?: string;
  end_date?: string;
  start_time?: number;
  end_time?: number;
  remark?: any;
  cause_absent?: string;
  leave_format?: string;
  leave_hour?: string;
  leave_day?: string;
  wf_ref_doc?: string;
}

export class MyAbsent extends BaseModel implements Absent {
  type_absent: TypeAbsent | undefined;
  absentid?: string;
  employeeId?: string;
  start_date?: string;
  end_date?: string;
  start_time?: number;
  end_time?: number;
  remark?: any;
  cause_absent?: string;
  leave_format?: string;
  leave_hour?: string;
  leave_day?: string;
  wf_ref_doc?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.type_absent = data.type_absent
      ? new MyTypeAbsent(data.type_absent, this.translateService!)
      : undefined;
    this.absentid = data.absentid;
    this.employeeId = data.employeeId;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.remark = data.remark;
    this.cause_absent = data.cause_absent;
    this.leave_format = data.leave_format;
    this.leave_hour = data.leave_hour;
    this.leave_day = data.leave_day;
    this.wf_ref_doc = data.wf_ref_doc;
  }
}

