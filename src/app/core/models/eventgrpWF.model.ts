import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

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
  getEventgrpWFDesc?() : string
}
export class MyEventgrpWF extends BaseModel implements EventgrpWF {
  tdesc?: string | undefined;
  edesc?: string | undefined;

  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
  }
  getEventgrpWFDesc() : string{
    return this.translateService.currentLang == 'th'
    ? this.tdesc!
    : this.edesc!;
  }
}

