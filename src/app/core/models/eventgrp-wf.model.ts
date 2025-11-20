import { BaseModel, TranslateService } from './base.model';

/**
 * Event group workflow model
 */
export interface EventgrpWF {
  eventgrpid?: string;
  guarantee?: string;
  guarantee_date?: string;
  tdesc?: string;
  edesc?: string;
  day_leave_stat?: string;
  fhalf_leave_stat?: string;
  shalf_leave_stat?: string;
  hour_leave_stat?: string;
  daytype?: string;
  ps_over_avi?: string;
  getEventgrpWFDesc?(): string;
}

export class MyEventgrpWF extends BaseModel implements EventgrpWF {
  tdesc?: string | undefined;
  edesc?: string | undefined;
  eventgrpid?: string;
  guarantee?: string;
  guarantee_date?: string;
  day_leave_stat?: string;
  fhalf_leave_stat?: string;
  shalf_leave_stat?: string;
  hour_leave_stat?: string;
  daytype?: string;
  ps_over_avi?: string;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
    this.eventgrpid = data.eventgrpid;
    this.guarantee = data.guarantee;
    this.guarantee_date = data.guarantee_date;
    this.tdesc = data.tdesc;
    this.edesc = data.edesc;
    this.day_leave_stat = data.day_leave_stat;
    this.fhalf_leave_stat = data.fhalf_leave_stat;
    this.shalf_leave_stat = data.shalf_leave_stat;
    this.hour_leave_stat = data.hour_leave_stat;
    this.daytype = data.daytype;
    this.ps_over_avi = data.ps_over_avi;
  }

  getEventgrpWFDesc(): string {
    return this.translateService?.currentLang === 'th'
      ? (this.tdesc || '')
      : (this.edesc || '');
  }
}

