import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";

  export interface EventgrpLeave {
      eventgrpid?: string;
      tdesc?: string;
      edesc?: string;
      limits?: number;
      daytype?: string;
      datebeforerequest?: number;
      service_year?: number;
      limit_times?: number;
      event_status?: number;
      clear_leave?: number;
      privilege_event?: string;
      limit_probation?: number;
      sex_type?: string;
      guarantee?: string;
      guarantee_date?: number;
      remarks?: string;
      display_order?: number;
      display?: number;
      event_desc?: string;
      display_limit?: number;
      lvpastlimit?: number;
      lvfuturelimit?: number;
      day_leave_stat?: number;
      fhalf_leave_stat?: number;
      shalf_leave_stat?: number;
      hour_leave_stat?: number;
      month_limit0?: number;
      month_limit1?: number;
      month_limit2?: number;
      month_limit3?: number;
      leaverounding?: string;
      clear_leave_month?: number;
      limit_hours?: string;
      sharelimit_event?: string;
      needapprovedate?: number;
      min_limit_hours?: string;
      advance_approve?: string;
      approve_before?: number;
      approve_after?: number;
      tsdesc?: any;
      esdesc?: any;
      dctsal?: string;
      dctsvc?: string;
      prev_last?: string;
      yos?: string;
      ispay?: number;
      limit_per_request?: number;
  }


  export class MyEventgrpLeave extends BaseModel implements EventgrpLeave {


    constructor(data: Partial<EventgrpLeave>, translateService: TranslateService) {
      super(data , translateService);
    }
    eventgrpid: string | undefined;
    tdesc: string| undefined;
    edesc: string| undefined;
    limits: number| undefined;
    daytype: string| undefined;
    datebeforerequest: number| undefined;
    service_year: number| undefined;
    limit_times: number| undefined;
    event_status: number| undefined;
    clear_leave: number| undefined;
    privilege_event: string| undefined;
    limit_probation: number| undefined;
    sex_type: string| undefined;
    guarantee: string| undefined;
    guarantee_date: number| undefined;
    remarks: string| undefined;
    display_order: number| undefined;
    display: number| undefined;
    event_desc: string| undefined;
    display_limit: number| undefined;
    lvpastlimit: number| undefined;
    lvfuturelimit: number| undefined;
    day_leave_stat: number| undefined;
    fhalf_leave_stat: number| undefined;
    shalf_leave_stat: number| undefined;
    hour_leave_stat: number| undefined;
    month_limit0: number| undefined;
    month_limit1: number| undefined;
    month_limit2: number| undefined;
    month_limit3: number| undefined;
    leaverounding: string| undefined;
    clear_leave_month: number| undefined;
    limit_hours: string| undefined;
    sharelimit_event: string| undefined;
    needapprovedate: number| undefined;
    min_limit_hours: string| undefined;
    advance_approve: string| undefined;
    approve_before: number| undefined;
    approve_after: number| undefined;
    tsdesc: any| undefined;
    esdesc: any| undefined;
    dctsal: string| undefined;
    dctsvc: string| undefined;
    prev_last: string| undefined;
    yos: string| undefined;
    ispay: number| undefined;
    limit_per_request: number| undefined;

    // getDesc() : string{
    //   return this.translateService.currentLang == 'th'
    //   ? this.tdesc
    //   : this.edesc;
    // }
  }

